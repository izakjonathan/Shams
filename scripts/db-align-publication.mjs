import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createDatabaseClient, safeDatabaseLabel } from "./db-common.mjs";

const sql = createDatabaseClient();
const seed = JSON.parse(await readFile(resolve(process.cwd(), "scripts/db-seed-data.json"), "utf8"));
const actor = process.env.DB_ADMIN_ACTOR?.trim() || "github-actions";
const publishIds = seed.records.filter((record) => record.status === "published").map((record) => record.id);

function snapshot(row) {
  return {
    id: row.id,
    type: row.type,
    slug: row.slug,
    status: row.status,
    sortOrder: row.sort_order,
    data: row.data,
    updatedAt: row.updated_at?.toISOString?.() ?? String(row.updated_at ?? ""),
  };
}

try {
  console.log(`Publication alignment target: ${safeDatabaseLabel()}`);
  if (!publishIds.length) throw new Error("The canonical seed contains no records marked published.");

  await sql.begin(async (tx) => {
    await tx.unsafe("SET LOCAL lock_timeout = '15s'; SET LOCAL statement_timeout = '120s'");
  const rows = await tx`
    SELECT id, type, slug, status, sort_order, data, updated_at, published_at
    FROM content_records
    WHERE id = ANY(${publishIds})
    ORDER BY type, sort_order, id FOR UPDATE
  `;

  const candidates = rows.filter((row) => row.status === "placeholder");
  const protectedRows = rows.filter((row) => row.status === "draft" || row.status === "archived");

  console.log(`Canonical public records found: ${rows.length}.`);
  console.log(`Placeholder records eligible for status-only publication: ${candidates.length}.`);
  if (protectedRows.length) {
    console.log(`Leaving ${protectedRows.length} draft/archived record(s) untouched because those states may represent intentional admin decisions.`);
  }

  if (!candidates.length) {
    console.log("No placeholder records require publication alignment.");
    return;
  }

    for (const row of candidates) {
      const before = snapshot(row);
      const nextData = { ...row.data, status: "published" };

      await tx`
        INSERT INTO content_revisions (id, record_type, record_id, actor, reason, snapshot)
        VALUES (${randomUUID()}, ${row.type}, ${row.id}, ${actor}, 'before:baseline-publication-alignment', ${JSON.stringify(before)}::jsonb)
      `;

      await tx`
        UPDATE content_records
        SET status = 'published',
            data = ${JSON.stringify(nextData)}::jsonb,
            updated_at = now(),
            published_at = COALESCE(published_at, now())
        WHERE id = ${row.id} AND status = 'placeholder'
      `;

      await tx`
        INSERT INTO audit_logs (id, actor, action, record_type, record_id, before, after)
        VALUES (
          ${randomUUID()},
          ${actor},
          'status:placeholder->published:baseline-alignment',
          ${row.type},
          ${row.id},
          ${JSON.stringify({ status: "placeholder", dataStatus: row.data?.status ?? null })}::jsonb,
          ${JSON.stringify({ status: "published", dataStatus: "published" })}::jsonb
        )
      `;
    }

  console.log(`Publication alignment complete. Published ${candidates.length} existing placeholder record(s) without replacing their content.`);
  });
} finally {
  await sql.end({ timeout: 5 });
}
