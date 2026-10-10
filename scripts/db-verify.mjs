import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createDatabaseClient, safeDatabaseLabel } from "./db-common.mjs";

const sql = createDatabaseClient();
const errors = [];
const migrationsDir = resolve(process.cwd(), "src/db/migrations");
const requiredTables = ["content_records", "audit_logs", "content_revisions", "shams_migrations", "admin_login_attempts"];
const requiredIndexes = [
  "content_records_public_idx",
  "admin_login_attempts_window_idx",
  "content_records_type_idx",
  "content_records_status_idx",
  "content_records_type_slug_unique",
  "audit_logs_record_idx",
  "audit_logs_created_idx",
  "content_revisions_record_idx",
];
const requiredColumns = {
  content_records: ["id", "type", "slug", "status", "sort_order", "data", "created_at", "updated_at", "published_at"],
  audit_logs: ["id", "actor", "action", "record_type", "record_id", "before", "after", "created_at"],
  content_revisions: ["id", "record_type", "record_id", "actor", "reason", "snapshot", "created_at"],
  admin_login_attempts: ["key", "attempts", "window_start"],
  shams_migrations: ["name", "checksum", "applied_at"],
};

function hash(contents) {
  return createHash("sha256").update(contents).digest("hex");
}

try {
  console.log(`Database verification target: ${safeDatabaseLabel()}`);
  const [ping] = await sql`SELECT current_database() AS database, current_user AS user, now() AS checked_at`;
  console.log(`Connected to ${ping.database} as ${ping.user}.`);

  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
  `;
  const tableSet = new Set(tables.map((row) => row.table_name));
  for (const table of requiredTables) if (!tableSet.has(table)) errors.push(`Missing table: ${table}`);

  const columns = await sql`
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name IN ('content_records', 'audit_logs', 'content_revisions', 'shams_migrations', 'admin_login_attempts')
  `;
  const columnsByTable = new Map();
  for (const row of columns) {
    if (!columnsByTable.has(row.table_name)) columnsByTable.set(row.table_name, new Set());
    columnsByTable.get(row.table_name).add(row.column_name);
  }
  for (const [table, expected] of Object.entries(requiredColumns)) {
    const actual = columnsByTable.get(table) ?? new Set();
    for (const column of expected) if (!actual.has(column)) errors.push(`Missing column: ${table}.${column}`);
  }

  const indexes = await sql`SELECT indexname FROM pg_indexes WHERE schemaname = 'public'`;
  const indexSet = new Set(indexes.map((row) => row.indexname));
  for (const index of requiredIndexes) if (!indexSet.has(index)) errors.push(`Missing index: ${index}`);

  if (tableSet.has("shams_migrations")) {
    const migrationFiles = (await readdir(migrationsDir)).filter((name) => /^\d+.*\.sql$/.test(name)).sort();
    const applied = await sql`SELECT name, checksum FROM shams_migrations ORDER BY name`;
    const appliedMap = new Map(applied.map((row) => [row.name, row.checksum]));
    for (const name of migrationFiles) {
      const contents = await readFile(resolve(migrationsDir, name), "utf8");
      const expected = hash(contents);
      if (!appliedMap.has(name)) errors.push(`Migration not registered: ${name}`);
      else if (appliedMap.get(name) !== expected) errors.push(`Migration checksum mismatch: ${name}`);
    }
  }

  if (tableSet.has("content_records")) {
    const [counts] = await sql`
      SELECT
        count(*)::int AS total,
        count(*) FILTER (WHERE status = 'published')::int AS published,
        count(*) FILTER (WHERE status = 'draft')::int AS draft,
        count(*) FILTER (WHERE status = 'placeholder')::int AS placeholder,
        count(*) FILTER (WHERE status = 'archived')::int AS archived
      FROM content_records
    `;
    console.log(`Content records: ${counts.total} total (${counts.published} published, ${counts.draft} draft, ${counts.placeholder} placeholder, ${counts.archived} archived).`);

    const invalid = await sql`SELECT id FROM content_records WHERE type NOT IN ('artist','gallery','programme','ticket','faq','page') OR status NOT IN ('draft','placeholder','published','archived') OR jsonb_typeof(data) <> 'object'`;
    for (const row of invalid) errors.push(`Invalid legacy record: ${row.id}`);
    const metadataMismatches = await sql`
      SELECT id, type, slug, status, sort_order, data
      FROM content_records
      WHERE jsonb_typeof(data) <> 'object'
         OR COALESCE(data->>'id', '') <> id
         OR COALESCE(data->>'status', '') <> status
         OR (type <> 'page' AND COALESCE(data->>'sortOrder', '') <> sort_order::text)
         OR (slug IS NOT NULL AND COALESCE(data->>'slug', '') <> slug)
      ORDER BY type, sort_order, id
    `;
    if (metadataMismatches.length) {
      const sample = metadataMismatches.slice(0, 12).map((row) => `${row.type}:${row.id}`).join(", ");
      errors.push(`Content JSON metadata mismatch in ${metadataMismatches.length} record(s): ${sample}${metadataMismatches.length > 12 ? ", …" : ""}. Run Database — Repair Records.`);
    } else {
      console.log("Content JSON metadata matches authoritative database columns.");
    }

    const seed = JSON.parse(await readFile(resolve(process.cwd(), "scripts/db-seed-data.json"), "utf8"));
    const baselineById = new Map(seed.records.map((record) => [record.id, record]));
    const rowsForShape = await sql`SELECT id, type, data FROM content_records ORDER BY type, id`;
    const incomplete = [];
    for (const row of rowsForShape) {
      const baseline = baselineById.get(row.id);
      if (!baseline || !row.data || typeof row.data !== "object" || Array.isArray(row.data)) continue;
      const missing = Object.keys(baseline.data).filter((key) => !(key in row.data));
      if (missing.length) incomplete.push(`${row.type}:${row.id}[${missing.join(",")}]`);
    }
    if (incomplete.length) {
      errors.push(`Canonical content fields missing in ${incomplete.length} record(s): ${incomplete.slice(0, 10).join(", ")}${incomplete.length > 10 ? ", …" : ""}. Run Database — Repair Records.`);
    } else {
      console.log("Canonical top-level content fields are present in all baseline records.");
    }
  }

  if (errors.length) {
    for (const error of errors) console.error(`ERROR: ${error}`);
    process.exitCode = 1;
  } else {
    console.log("Database verification passed.");
  }

  if (/^(1|true|yes)$/i.test(process.env.REQUIRE_BASELINE_PUBLISHED ?? "")) {
    const seed = JSON.parse(await readFile(resolve(process.cwd(), "scripts/db-seed-data.json"), "utf8"));
    const expectedIds = seed.records.filter((record) => record.status === "published").map((record) => record.id);
    const unpublished = await sql`
      SELECT id, type, status
      FROM content_records
      WHERE id = ANY(${expectedIds}) AND status <> 'published'
      ORDER BY type, id
    `;
    if (unpublished.length) {
      throw new Error(`Baseline publication verification failed: ${unpublished.map((row) => `${row.type}:${row.id}=${row.status}`).join(", ")}`);
    }
    console.log(`Baseline publication state verified for ${expectedIds.length} canonical public record(s).`);
  }

} finally {
  await sql.end({ timeout: 5 });
}
