import { requireContentWritable } from "./write-policy";
import "server-only";
import { and, asc, count, desc, eq } from "drizzle-orm";
import { contentRepository } from "../../content";
import { normalizeAdminRecordData, validateAdminRecord } from "../../content/admin-validation";
import { completeRecordFromCanonicalBaseline } from "../../content/canonical-record-completion";
import type { ContentStatus } from "../../content/models";
import packageJson from "../../../../package.json";
import { getDatabase, isDatabaseConfigured } from "../../../db/client";
import { auditLogs, contentRecords, contentRevisions } from "../../../db/schema";

import type { AdminContentType, AdminRecord } from "../types";
export type { AdminContentType, AdminRecord } from "../types";
import { saveRecord, restoreRecord, seedMissingRecords } from "./record-writer";
export interface AdminRevision {
  id: string;
  recordType: AdminContentType;
  recordId: string;
  actor: string;
  reason: string;
  snapshot: AdminRecord;
  createdAt: string;
}

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    const source = value as Record<string, unknown>;
    if ("src" in source && typeof source.src === "string") return source.src;
    return Object.fromEntries(Object.entries(source).map(([key, item]) => [key, normalize(item)]));
  }
  return value;
}

export function localAdminRecords(type: AdminContentType): AdminRecord[] {
  const records = type === "artist" ? contentRepository.getArtists()
    : type === "gallery" ? contentRepository.getGallery()
    : type === "programme" ? contentRepository.getProgramme()
      : type === "ticket" ? contentRepository.getTickets()
        : type === "faq" ? contentRepository.getFaqs()
          : [contentRepository.getInformationPage("privacy"), contentRepository.getInformationPage("terms"), contentRepository.getInformationPage("accessibility"), contentRepository.getContactPage()];
  return records.map((record) => ({
    id: record.id,
    type,
    slug: "slug" in record && typeof record.slug === "string" ? record.slug : null,
    status: record.status,
    sortOrder: "sortOrder" in record && typeof record.sortOrder === "number" ? record.sortOrder : 0,
    data: normalize(record) as Record<string, unknown>,
    updatedAt: null,
  }));
}

export async function listAdminRecords(type: AdminContentType) {
  if (!isDatabaseConfigured()) return { source: "local" as const, records: localAdminRecords(type) };
  const db = getDatabase();
  const rows = await db.select().from(contentRecords).where(eq(contentRecords.type, type)).orderBy(asc(contentRecords.sortOrder));
  return { source: "database" as const, records: rows.map((row) => {
    const metadata = { id: row.id, type: row.type as AdminContentType, slug: row.slug, status: row.status as ContentStatus, sortOrder: row.sortOrder };
    return { ...row, type: metadata.type, status: metadata.status, data: normalizeAdminRecordData(completeRecordFromCanonicalBaseline(metadata.type, metadata.id, row.data), metadata), updatedAt: row.updatedAt.toISOString() };
  }) };
}

export async function getAdminRecord(type: AdminContentType, id: string) {
  if (!isDatabaseConfigured()) return localAdminRecords(type).find((record) => record.id === id) ?? null;
  const [row] = await getDatabase().select().from(contentRecords).where(and(eq(contentRecords.type, type), eq(contentRecords.id, id))).limit(1);
  if (!row) return null;
  const metadata = { id: row.id, type: row.type as AdminContentType, slug: row.slug, status: row.status as ContentStatus, sortOrder: row.sortOrder };
  return { ...row, type: metadata.type, status: metadata.status, data: normalizeAdminRecordData(completeRecordFromCanonicalBaseline(metadata.type, metadata.id, row.data), metadata), updatedAt: row.updatedAt.toISOString() };
}

export async function seedDatabase(actor: string) {
  requireContentWritable();
  const types: AdminContentType[] = ["artist", "gallery", "programme", "ticket", "faq", "page"];
  await seedMissingRecords(getDatabase(), actor, types.flatMap(localAdminRecords), packageJson.version);
}

export async function saveAdminRecord(actor: string, record: AdminRecord, expectedUpdatedAt: string | null) {
  requireContentWritable();
  await saveRecord(getDatabase(), actor, record, expectedUpdatedAt);
}

export async function listRecentRevisions(limit = 100): Promise<AdminRevision[]> {
  if (!isDatabaseConfigured()) return [];
  const rows = await getDatabase().select().from(contentRevisions)
    .orderBy(desc(contentRevisions.createdAt))
    .limit(Math.max(1, Math.min(limit, 250)));
  return rows.map((row) => ({
    id: row.id,
    recordType: row.recordType as AdminContentType,
    recordId: row.recordId,
    actor: row.actor,
    reason: row.reason,
    snapshot: row.snapshot as AdminRecord,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function listRecordRevisions(type: AdminContentType, id: string, limit = 50): Promise<AdminRevision[]> {
  if (!isDatabaseConfigured()) return [];
  const rows = await getDatabase().select().from(contentRevisions)
    .where(and(eq(contentRevisions.recordType, type), eq(contentRevisions.recordId, id)))
    .orderBy(desc(contentRevisions.createdAt))
    .limit(Math.max(1, Math.min(limit, 100)));
  return rows.map((row) => ({
    id: row.id,
    recordType: row.recordType as AdminContentType,
    recordId: row.recordId,
    actor: row.actor,
    reason: row.reason,
    snapshot: row.snapshot as AdminRecord,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function restoreAdminRevision(actor: string, revisionId: string, expectedUpdatedAt: string | null) {
  requireContentWritable();
  return restoreRecord(getDatabase(), actor, revisionId, expectedUpdatedAt, (snapshot) =>
    validateAdminRecord(normalizeAdminRecordData(completeRecordFromCanonicalBaseline(snapshot.type, snapshot.id, snapshot.data), snapshot), snapshot));
}

export async function listAuditEntries(limit = 100) {
  if (!isDatabaseConfigured()) return [];
  return getDatabase().select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(Math.max(1, Math.min(limit, 250)));
}

export async function adminRecordCounts(): Promise<Record<string, number>> {
  if (!isDatabaseConfigured()) return Object.fromEntries((["artist", "gallery", "programme", "ticket", "faq", "page"] as AdminContentType[]).map((type) => [type, localAdminRecords(type).length]));
  const rows = await getDatabase().select({ type: contentRecords.type, total: count() }).from(contentRecords).groupBy(contentRecords.type);
  return Object.fromEntries(rows.map((row) => [row.type, row.total]));
}
