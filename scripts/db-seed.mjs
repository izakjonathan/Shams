import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createDatabaseClient, safeDatabaseLabel } from "./db-common.mjs";

const sql = createDatabaseClient();
const seed = JSON.parse(await readFile(resolve(process.cwd(), "scripts/db-seed-data.json"), "utf8"));
const allowReseed = /^(1|true|yes)$/i.test(process.env.ALLOW_RESEED ?? "");
const actor = process.env.DB_ADMIN_ACTOR?.trim() || "github-actions";

try {
  console.log(`Database seed target: ${safeDatabaseLabel()}`);
  const [table] = await sql`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'content_records'
    ) AS exists
  `;
  if (!table.exists) throw new Error("content_records does not exist. Run the Migrate Database workflow first.");

  const [existing] = await sql`SELECT count(*)::int AS count FROM content_records`;
  if (existing.count > 0 && !allowReseed) {
    throw new Error(`Database already contains ${existing.count} content record(s). Initial seed aborted to protect admin edits. Run the workflow again with refresh_existing=true only if you intentionally want to overwrite matching baseline records.`);
  }

  console.log(`${allowReseed ? "Refreshing" : "Seeding"} ${seed.records.length} canonical content records from baseline ${seed.version}.`);
  await sql.begin(async (tx) => {
    for (const record of seed.records) {
      const publishedAt = record.status === "published" ? new Date() : null;
      await tx`
        INSERT INTO content_records (id, type, slug, status, sort_order, data, updated_at, published_at)
        VALUES (${record.id}, ${record.type}, ${record.slug}, ${record.status}, ${record.sortOrder}, ${JSON.stringify(record.data)}::jsonb, now(), ${publishedAt})
        ON CONFLICT (id) DO UPDATE SET
          type = EXCLUDED.type,
          slug = EXCLUDED.slug,
          status = EXCLUDED.status,
          sort_order = EXCLUDED.sort_order,
          data = EXCLUDED.data,
          updated_at = now(),
          published_at = CASE WHEN EXCLUDED.status = 'published' THEN COALESCE(content_records.published_at, now()) ELSE NULL END
      `;
    }
    await tx`
      INSERT INTO audit_logs (id, actor, action, record_type, record_id, after)
      VALUES (${randomUUID()}, ${actor}, ${allowReseed ? "seed:refresh" : "seed:initial"}, 'all', 'local-content', ${JSON.stringify({ version: seed.version, records: seed.records.length })}::jsonb)
    `;
  });

  const [count] = await sql`SELECT count(*)::int AS count FROM content_records`;
  console.log(`Seed complete. Database now contains ${count.count} content record(s).`);
} finally {
  await sql.end({ timeout: 5 });
}
