import "server-only";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { getDatabase } from "../../../db/client";
import { auditLogs, contentRecords, contentRevisions } from "../../../db/schema";
import { validateAdminRecord } from "../../content/admin-validation";
import type { AdminRecord } from "../types";

type Database = ReturnType<typeof getDatabase>;
type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
type Row = typeof contentRecords.$inferSelect;
function snapshot(row: Row): AdminRecord {
  return { id: row.id, type: row.type as AdminRecord["type"], slug: row.slug, status: row.status as AdminRecord["status"], sortOrder: row.sortOrder, data: row.data as Record<string, unknown>, updatedAt: row.updatedAt.toISOString() };
}
async function lockedRecord(tx: Transaction, id: string) {
  const [row] = await tx.select().from(contentRecords).where(eq(contentRecords.id, id)).for("update");
  return row;
}
function checkVersion(row: Row, type: AdminRecord["type"], expected: string | null) {
  if (row.type !== type) throw new Error("A stable ID cannot be moved to another content type.");
  if (!expected || row.updatedAt.toISOString() !== expected) throw new Error("This record changed after you opened it. Reload the editor before saving.");
}
async function write(tx: Transaction, actor: string, record: AdminRecord, before: Row | undefined, reason?: string) {
  const previous = before ? snapshot(before) : null;
  const now = new Date(Math.max(Date.now(), (before?.updatedAt.getTime() ?? 0) + 1));
  const data = validateAdminRecord(record.data, record);
  if (previous) await tx.insert(contentRevisions).values({ id: randomUUID(), recordType: previous.type, recordId: previous.id, actor,
    reason: reason ? `before:${reason}` : previous.status === record.status ? "before:update" : `before:status:${previous.status}->${record.status}`, snapshot: previous });
  const fields = { slug: record.slug, status: record.status, sortOrder: record.sortOrder, data, updatedAt: now,
    publishedAt: record.status === "published" ? before?.publishedAt ?? now : null };
  if (before) await tx.update(contentRecords).set(fields).where(and(eq(contentRecords.id, record.id), eq(contentRecords.type, record.type)));
  else await tx.insert(contentRecords).values({ id: record.id, type: record.type, ...fields });
  await tx.insert(auditLogs).values({ id: randomUUID(), actor, action: reason ?? (previous ? previous.status === record.status ? "update" : `status:${previous.status}->${record.status}` : "create"),
    recordType: record.type, recordId: record.id, before: previous, after: { ...record, data, updatedAt: now.toISOString() } });
}
export async function saveRecord(db: Database, actor: string, record: AdminRecord, expected: string | null) {
  // Each state change, its recovery snapshot and audit entry commit together.
  await db.transaction(async (tx) => {
    const before = await lockedRecord(tx, record.id);
    if (before) checkVersion(before, record.type, expected);
    else if (expected) throw new Error("The record no longer exists. Reload the editor.");
    await write(tx, actor, record, before);
  });
}
export async function restoreRecord(db: Database, actor: string, revisionId: string, expected: string | null,
  prepare: (record: AdminRecord) => Record<string, unknown>) {
  return db.transaction(async (tx) => {
    const [revision] = await tx.select().from(contentRevisions).where(eq(contentRevisions.id, revisionId)).limit(1);
    if (!revision) throw new Error("Revision not found.");
    const record = revision.snapshot as AdminRecord;
    if (record.id !== revision.recordId || record.type !== revision.recordType) throw new Error("Revision metadata is inconsistent.");
    const current = await lockedRecord(tx, record.id);
    if (!current) throw new Error("The current record no longer exists.");
    checkVersion(current, record.type, expected);
    await write(tx, actor, { ...record, data: prepare(record) }, current, `restore:${revisionId}`);
    return { type: record.type, id: record.id };
  });
}
export async function seedMissingRecords(db: Database, actor: string, records: AdminRecord[], version: string) {
  await db.transaction(async (tx) => {
    let inserted = 0;
    for (const record of records) {
      const status = record.status === "placeholder" ? "published" : record.status;
      const data = validateAdminRecord({ ...record.data, status }, { ...record, status });
      const added = await tx.insert(contentRecords).values({ id: record.id, type: record.type, slug: record.slug, status, sortOrder: record.sortOrder, data, publishedAt: status === "published" ? new Date() : null }).onConflictDoNothing().returning({ id: contentRecords.id });
      inserted += added.length;
    }
    if (inserted) await tx.insert(auditLogs).values({ id: randomUUID(), actor, action: "seed:missing", recordType: "all", recordId: "local-content", after: { version, inserted } });
  });
}
