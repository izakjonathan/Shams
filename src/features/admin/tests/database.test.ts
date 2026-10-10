import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { saveRecord, restoreRecord, seedMissingRecords } from "../server/record-writer";
import { consumeAttempt } from "../server/login-attempts";
import type { AdminRecord } from "../types";

const target = process.env.DATABASE_TEST_URL;
if (!target) throw new Error("DATABASE_TEST_URL is required; use an isolated local shams_test database.");
const url = new URL(target);
if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || url.pathname !== "/shams_test") throw new Error("Database tests refuse non-local targets or any database other than shams_test.");
const client = postgres(target, { prepare: false, max: process.env.PGLITE_TEST === "true" ? 1 : 3, connect_timeout: 10 });
const db = drizzle(client);
const record: AdminRecord = { id: "test-faq", type: "faq", slug: null, status: "published", sortOrder: 1, updatedAt: null, data: { id: "test-faq", status: "published", sortOrder: 1, question: "Original?", answer: "Original answer" } };
async function reset() { await client`TRUNCATE content_records, content_revisions, audit_logs, admin_login_attempts`; }
async function current() { const [row] = await client`SELECT * FROM content_records WHERE id='test-faq'`; return row; }
function edit(question: string): AdminRecord { return { ...record, data: { ...record.data, question } }; }
before(async () => {
  await client.unsafe("DROP SCHEMA public CASCADE; CREATE SCHEMA public");
  for (let n = 0; n < 2; n++) execFileSync(process.execPath, ["scripts/db-migrate.mjs"], { env: { ...process.env, DATABASE_URL: target }, stdio: "pipe" });
});
after(async () => { await client.end({ timeout: 5 }); });
test("all migrations apply once, including constraints and throttle storage", async () => {
  const ledger = await client`SELECT name FROM shams_migrations ORDER BY name`;
  assert.equal(ledger.length, 3);
  assert.equal((await client`SELECT count(*)::int count FROM pg_constraint WHERE conrelid='content_records'::regclass AND contype='c'`)[0].count, 3);
});
test("save records exact recovery snapshots and preserves first publication timestamp", async () => {
  await reset(); await saveRecord(db, "test", record, null);
  const initial = await current();
  await saveRecord(db, "test", edit("Edited?"), new Date(initial.updated_at).toISOString());
  const row = await current();
  assert.equal(row.data.question, "Edited?");
  assert.equal(new Date(row.published_at).toISOString(), new Date(initial.published_at).toISOString());
  const [revision] = await client`SELECT snapshot FROM content_revisions`;
  assert.equal(revision.snapshot.data.question, "Original?");
  assert.equal((await client`SELECT count(*)::int count FROM audit_logs`)[0].count, 2);
});
test("simultaneous edits with the same version have exactly one winner", { skip: process.env.PGLITE_TEST === "true" ? "Requires a real multi-connection PostgreSQL server; CI exercises this test." : false }, async () => {
  await reset(); await saveRecord(db, "test", record, null);
  const expected = new Date((await current()).updated_at).toISOString();
  const outcomes = await Promise.allSettled([saveRecord(db, "editor-a", edit("A?"), expected), saveRecord(db, "editor-b", edit("B?"), expected)]);
  assert.equal(outcomes.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal((await client`SELECT count(*)::int count FROM content_revisions`)[0].count, 1);
  await assert.rejects(saveRecord(db, "test", edit("Missing version?"), null), /Reload/);
});
test("failure writing audit rolls content and recovery snapshot back", { skip: process.env.PGLITE_TEST === "true" ? "PGlite socket error handling hangs on injected SQL exceptions; real PostgreSQL CI is required." : false }, async () => {
  await reset(); await saveRecord(db, "test", record, null);
  const initial = await current();
  await client.unsafe("CREATE OR REPLACE FUNCTION test_audit_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.actor = 'fail' THEN RAISE EXCEPTION 'injected audit failure'; END IF; RETURN NEW; END; $$; CREATE TRIGGER test_audit_failure BEFORE INSERT ON audit_logs FOR EACH ROW EXECUTE FUNCTION test_audit_failure()");
  try {
    await assert.rejects(saveRecord(db, "fail", edit("Must roll back?"), new Date(initial.updated_at).toISOString()));
    assert.equal((await current()).data.question, "Original?");
    assert.equal((await client`SELECT count(*)::int count FROM content_revisions`)[0].count, 0);
  } finally { await client.unsafe("DROP TRIGGER test_audit_failure ON audit_logs; DROP FUNCTION test_audit_failure()"); }
});
test("seed is repeatable and preserves edited records and publication states", async () => {
  await reset(); await seedMissingRecords(db, "test", [record], "test");
  const initial = await current();
  await saveRecord(db, "test", { ...edit("Keep edit?"), status: "draft", data: { ...edit("Keep edit?").data, status: "draft" } }, new Date(initial.updated_at).toISOString());
  await seedMissingRecords(db, "test", [record], "test");
  assert.equal((await current()).data.question, "Keep edit?");
  assert.equal((await current()).status, "draft");
});
test("restore is atomic, rejects stale versions and is itself recoverable", async () => {
  await reset(); await saveRecord(db, "test", record, null);
  const original = await current();
  await saveRecord(db, "test", edit("Edited?"), new Date(original.updated_at).toISOString());
  const [revision] = await client`SELECT id FROM content_revisions`;
  await assert.rejects(restoreRecord(db, "test", revision.id, new Date(original.updated_at).toISOString(), (r) => r.data), /Reload/);
  await restoreRecord(db, "test", revision.id, new Date((await current()).updated_at).toISOString(), (r) => r.data);
  assert.equal((await current()).data.question, "Original?");
  assert.equal((await client`SELECT count(*)::int count FROM content_revisions`)[0].count, 2);
});
test("database rejects duplicate slugs, invalid states and cross-type stable IDs", { skip: process.env.PGLITE_TEST === "true" ? "Requires real PostgreSQL error/rollback protocol; CI exercises this test." : false }, async () => {
  await reset(); await saveRecord(db, "test", { ...record, slug: "same" }, null);
  await assert.rejects(saveRecord(db, "test", { ...record, id: "other", slug: "same", data: { ...record.data, id: "other" } }, null));
  await assert.rejects(client`UPDATE content_records SET status='invalid' WHERE id='test-faq'`);
  await assert.rejects(saveRecord(db, "test", { ...record, type: "gallery" }, new Date((await current()).updated_at).toISOString()), /content type/);
  assert.equal((await client`SELECT count(*)::int count FROM content_records`)[0].count, 1);
});
test("shared login counter caps attempts and expired windows reset", async () => {
  await client`INSERT INTO admin_login_attempts (key, attempts, window_start) VALUES ('test', 10, now() - interval '16 minutes')`;
  assert.equal(await consumeAttempt(db, "test"), true);
  for (let n = 1; n < 10; n++) assert.equal(await consumeAttempt(db, "test"), true);
  assert.equal(await consumeAttempt(db, "test"), false);
  assert.equal(await consumeAttempt(db, "test"), false);
});
test("maintenance CLIs preserve editorial values and intentional draft states", { skip: process.env.PGLITE_TEST === "true" ? "PGlite socket could not execute the locked CLI seed; real PostgreSQL CI is required." : false }, async () => {
  await reset();
  const run = (file: string, extra: Record<string, string> = {}) => execFileSync(process.execPath, [file], { env: { ...process.env, DATABASE_URL: target, ...extra }, timeout: 30000, stdio: "pipe" });
  run("scripts/db-seed.mjs");
  const [faq] = await client`SELECT id FROM content_records WHERE type='faq' ORDER BY id LIMIT 1`;
  await client`UPDATE content_records SET status='draft', data=(data - 'id') || '{"question":"Keep my editorial question?","status":"draft"}'::jsonb WHERE id=${faq.id}`;
  run("scripts/db-repair-records.mjs", { REPAIR_CONFIRMATION: "REPAIR" });
  run("scripts/db-align-publication.mjs");
  const [row] = await client`SELECT status, data FROM content_records WHERE id=${faq.id}`;
  assert.equal(row.status, "draft"); assert.equal(row.data.id, faq.id); assert.equal(row.data.question, "Keep my editorial question?");
  assert.throws(() => run("scripts/db-seed.mjs"));
});
