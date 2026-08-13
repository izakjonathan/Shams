import { randomUUID } from "node:crypto";
import { createDatabaseClient, safeDatabaseLabel } from "./db-common.mjs";

const sql = createDatabaseClient();
const actor = process.env.DB_ADMIN_ACTOR?.trim() || "github-actions";
const confirmation = process.env.REPAIR_CONFIRMATION?.trim();

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeData(row) {
  if (!isObject(row.data)) throw new Error(`${row.type}:${row.id} has non-object JSON data and cannot be repaired automatically.`);
  const next = { ...row.data, id: row.id, status: row.status };
  if (row.type !== "page" || Object.prototype.hasOwnProperty.call(row.data, "sortOrder")) next.sortOrder = row.sort_order;
  if (row.slug) next.slug = row.slug;
  return next;
}

function needsRepair(row, next) {
  if (row.data.id !== row.id) return true;
  if (row.data.status !== row.status) return true;
  if (row.type !== "page" && row.data.sortOrder !== row.sort_order) return true;
  if (row.slug && row.data.slug !== row.slug) return true;
  return false;
}

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
  console.log(`Record repair target: ${safeDatabaseLabel()}`);
  if (confirmation !== "REPAIR") throw new Error('Safety check failed. Run with confirmation "REPAIR".');

  const rows = await sql`
    SELECT id, type, slug, status, sort_order, data, updated_at, published_at
    FROM content_records
    ORDER BY type, sort_order, id
  `;

  const repairs = [];
  for (const row of rows) {
    const next = normalizeData(row);
    if (needsRepair(row, next)) repairs.push({ row, next });
  }

  console.log(`Scanned ${rows.length} content record(s); ${repairs.length} require metadata normalization.`);
  if (!repairs.length) {
    console.log("No record metadata repair is required.");
  } else {
    await sql.begin(async (tx) => {
    for (const { row, next } of repairs) {
      const before = snapshot(row);
      await tx`
        INSERT INTO content_revisions (id, record_type, record_id, actor, reason, snapshot)
        VALUES (${randomUUID()}, ${row.type}, ${row.id}, ${actor}, 'before:metadata-normalization', ${JSON.stringify(before)}::jsonb)
      `;
      await tx`
        UPDATE content_records
        SET data = ${JSON.stringify(next)}::jsonb,
            updated_at = now()
        WHERE id = ${row.id}
      `;
      await tx`
        INSERT INTO audit_logs (id, actor, action, record_type, record_id, before, after)
        VALUES (
          ${randomUUID()}, ${actor}, 'repair:normalize-record-metadata', ${row.type}, ${row.id},
          ${JSON.stringify({ id: row.data?.id ?? null, status: row.data?.status ?? null, sortOrder: row.data?.sortOrder ?? null, slug: row.data?.slug ?? null })}::jsonb,
          ${JSON.stringify({ id: next.id, status: next.status, sortOrder: next.sortOrder ?? null, slug: next.slug ?? null })}::jsonb
        )
      `;
      console.log(`Repaired ${row.type}:${row.id}.`);
    }
    });

    console.log(`Record repair complete. Normalized ${repairs.length} record(s) without changing editorial fields or publication states.`);
  }
} finally {
  await sql.end({ timeout: 5 });
}
