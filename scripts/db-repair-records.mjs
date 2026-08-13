import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createDatabaseClient, safeDatabaseLabel } from "./db-common.mjs";

const sql = createDatabaseClient();
const actor = process.env.DB_ADMIN_ACTOR?.trim() || "github-actions";
const confirmation = process.env.REPAIR_CONFIRMATION?.trim();
const seed = JSON.parse(await readFile(resolve(process.cwd(), "scripts/db-seed-data.json"), "utf8"));
const baselineById = new Map(seed.records.map((record) => [record.id, record]));

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function fillMissing(baseline, current) {
  if (Array.isArray(baseline)) {
    if (!Array.isArray(current)) return current === undefined ? baseline : current;
    return current.map((value, index) => index < baseline.length ? fillMissing(baseline[index], value) : value);
  }
  if (isObject(baseline)) {
    if (!isObject(current)) return current === undefined ? baseline : current;
    const next = { ...current };
    for (const [key, value] of Object.entries(baseline)) {
      if (!Object.prototype.hasOwnProperty.call(current, key) || current[key] === undefined) next[key] = value;
      else next[key] = fillMissing(value, current[key]);
    }
    return next;
  }
  return current === undefined ? baseline : current;
}

function normalizeData(row) {
  if (!isObject(row.data)) throw new Error(`${row.type}:${row.id} has non-object JSON data and cannot be repaired automatically.`);
  const baseline = baselineById.get(row.id);
  const completed = baseline ? fillMissing(baseline.data, row.data) : { ...row.data };
  const next = { ...completed, id: row.id, status: row.status };
  if (row.type !== "page" || Object.prototype.hasOwnProperty.call(completed, "sortOrder")) next.sortOrder = row.sort_order;
  if (row.slug) next.slug = row.slug;
  return next;
}

function stable(value) { return JSON.stringify(value); }
function needsRepair(row, next) { return stable(row.data) !== stable(next); }
function snapshot(row) {
  return { id: row.id, type: row.type, slug: row.slug, status: row.status, sortOrder: row.sort_order, data: row.data, updatedAt: row.updated_at?.toISOString?.() ?? String(row.updated_at ?? "") };
}

try {
  console.log(`Record repair target: ${safeDatabaseLabel()}`);
  if (confirmation !== "REPAIR") throw new Error('Safety check failed. Run with confirmation "REPAIR".');
  const rows = await sql`SELECT id, type, slug, status, sort_order, data, updated_at, published_at FROM content_records ORDER BY type, sort_order, id`;
  const repairs = [];
  for (const row of rows) {
    const next = normalizeData(row);
    if (needsRepair(row, next)) repairs.push({ row, next });
  }
  console.log(`Scanned ${rows.length} content record(s); ${repairs.length} require canonical completion or metadata normalization.`);
  if (repairs.length) {
    await sql.begin(async (tx) => {
      for (const { row, next } of repairs) {
        const before = snapshot(row);
        await tx`INSERT INTO content_revisions (id, record_type, record_id, actor, reason, snapshot) VALUES (${randomUUID()}, ${row.type}, ${row.id}, ${actor}, 'before:canonical-record-repair', ${JSON.stringify(before)}::jsonb)`;
        await tx`UPDATE content_records SET data = ${JSON.stringify(next)}::jsonb, updated_at = now() WHERE id = ${row.id}`;
        await tx`INSERT INTO audit_logs (id, actor, action, record_type, record_id, before, after) VALUES (${randomUUID()}, ${actor}, 'repair:complete-canonical-record', ${row.type}, ${row.id}, ${JSON.stringify(row.data)}::jsonb, ${JSON.stringify(next)}::jsonb)`;
        console.log(`Repaired ${row.type}:${row.id}.`);
      }
    });
  }
  console.log(`Record repair complete. Updated ${repairs.length} record(s) without overwriting existing editorial values or publication states.`);
} finally {
  await sql.end({ timeout: 5 });
}
