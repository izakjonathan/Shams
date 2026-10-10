import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createDatabaseClient, safeDatabaseLabel } from "./db-common.mjs";

const sql = createDatabaseClient();
const migrationsDir = resolve(process.cwd(), "src/db/migrations");
try {
  console.log(`Database migration target: ${safeDatabaseLabel()}`);
  const files = (await readdir(migrationsDir)).filter((name) => /^\d+.*\.sql$/.test(name)).sort();
  if (!files.length) throw new Error("No SQL migrations were found in src/db/migrations.");
  // Transaction-scoped lock works through Neon transaction pooling. Never use
  // a session lock across pooled transactions. All DDL and ledger writes roll
  // back together if any migration fails.
  await sql.begin(async (tx) => {
    await tx.unsafe("SET LOCAL lock_timeout = '15s'; SET LOCAL statement_timeout = '120s'");
    await tx`SELECT pg_advisory_xact_lock(736426, 1)`;
    await tx.unsafe(`CREATE TABLE IF NOT EXISTS shams_migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())`);
    for (const name of files) {
      const contents = await readFile(resolve(migrationsDir, name), "utf8");
      const checksum = createHash("sha256").update(contents).digest("hex");
      const [existing] = await tx`SELECT checksum FROM shams_migrations WHERE name = ${name}`;
      if (existing) {
        if (existing.checksum !== checksum) throw new Error(`Migration ${name} was already applied but its checksum has changed. Create a new migration instead of editing an applied migration.`);
        console.log(`SKIP ${name}`);
        continue;
      }
      await tx.unsafe(contents);
      await tx`INSERT INTO shams_migrations (name, checksum) VALUES (${name}, ${checksum})`;
      console.log(`APPLY ${name}`);
    }
  });
  console.log("Migration complete.");
} finally { await sql.end({ timeout: 5 }); }
