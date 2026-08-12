import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createDatabaseClient, safeDatabaseLabel } from "./db-common.mjs";

const sql = createDatabaseClient();
const migrationsDir = resolve(process.cwd(), "app/db/migrations");

function checksum(contents) {
  return createHash("sha256").update(contents).digest("hex");
}

try {
  console.log(`Database migration target: ${safeDatabaseLabel()}`);
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS shams_migrations (
      name text PRIMARY KEY,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  const files = (await readdir(migrationsDir))
    .filter((name) => /^\d+.*\.sql$/.test(name))
    .sort((a, b) => a.localeCompare(b));

  if (!files.length) throw new Error("No SQL migrations were found in app/db/migrations.");

  for (const name of files) {
    const contents = await readFile(resolve(migrationsDir, name), "utf8");
    const hash = checksum(contents);
    const [existing] = await sql`SELECT checksum FROM shams_migrations WHERE name = ${name} LIMIT 1`;

    if (existing) {
      if (existing.checksum !== hash) {
        throw new Error(`Migration ${name} was already applied but its checksum has changed. Create a new migration instead of editing an applied migration.`);
      }
      console.log(`SKIP ${name} (already applied)`);
      continue;
    }

    console.log(`APPLY ${name}`);
    await sql.begin(async (tx) => {
      await tx.unsafe(contents);
      await tx`INSERT INTO shams_migrations (name, checksum) VALUES (${name}, ${hash})`;
    });
    console.log(`DONE  ${name}`);
  }

  const applied = await sql`SELECT name, applied_at FROM shams_migrations ORDER BY name`;
  console.log(`Migration complete. ${applied.length} migration(s) registered.`);
  for (const row of applied) console.log(` - ${row.name}`);
} finally {
  await sql.end({ timeout: 5 });
}
