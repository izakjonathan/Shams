import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { contentRepository } from "../../content";
import type { ContentStatus } from "../../content/models";
import packageJson from "../../../package.json";
import { getDatabase, isDatabaseConfigured } from "../../db/client";
import { auditLogs, contentRecords } from "../../db/schema";

export type AdminContentType = "artist" | "programme" | "ticket" | "faq" | "page";

export interface AdminRecord {
  id: string;
  type: AdminContentType;
  slug: string | null;
  status: ContentStatus;
  sortOrder: number;
  data: Record<string, unknown>;
  updatedAt: string | null;
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
  return { source: "database" as const, records: rows.map((row) => ({ ...row, type: row.type as AdminContentType, status: row.status as ContentStatus, data: row.data as Record<string, unknown>, updatedAt: row.updatedAt.toISOString() })) };
}

export async function getAdminRecord(type: AdminContentType, id: string) {
  if (!isDatabaseConfigured()) return localAdminRecords(type).find((record) => record.id === id) ?? null;
  const [row] = await getDatabase().select().from(contentRecords).where(and(eq(contentRecords.type, type), eq(contentRecords.id, id))).limit(1);
  return row ? { ...row, type: row.type as AdminContentType, status: row.status as ContentStatus, data: row.data as Record<string, unknown>, updatedAt: row.updatedAt.toISOString() } : null;
}

export async function seedDatabase(actor: string) {
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured.");
  const db = getDatabase();
  const allTypes: AdminContentType[] = ["artist", "programme", "ticket", "faq", "page"];
  for (const type of allTypes) {
    for (const record of localAdminRecords(type)) {
      await db.insert(contentRecords).values({ id: record.id, type: record.type, slug: record.slug, status: record.status, sortOrder: record.sortOrder, data: record.data, updatedAt: new Date() }).onConflictDoUpdate({
        target: contentRecords.id,
        set: { slug: record.slug, status: record.status, sortOrder: record.sortOrder, data: record.data, updatedAt: new Date() },
      });
    }
  }
  await db.insert(auditLogs).values({ id: randomUUID(), actor, action: "seed", recordType: "all", recordId: "local-content", after: { version: packageJson.version } });
}

export async function saveAdminRecord(actor: string, record: AdminRecord, expectedUpdatedAt: string | null) {
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured.");
  const db = getDatabase();
  const before = await getAdminRecord(record.type, record.id);

  if (before?.updatedAt && expectedUpdatedAt && before.updatedAt !== expectedUpdatedAt) {
    throw new Error("This record changed after you opened it. Reload the editor before saving.");
  }

  if (record.slug) {
    const [conflict] = await db.select({ id: contentRecords.id }).from(contentRecords)
      .where(and(eq(contentRecords.type, record.type), eq(contentRecords.slug, record.slug))).limit(1);
    if (conflict && conflict.id !== record.id) throw new Error(`Slug "${record.slug}" is already used by another ${record.type} record.`);
  }

  const now = new Date();
  const publishedAt = record.status === "published" ? now : null;
  await db.insert(contentRecords).values({ id: record.id, type: record.type, slug: record.slug, status: record.status, sortOrder: record.sortOrder, data: record.data, updatedAt: now, publishedAt }).onConflictDoUpdate({
    target: contentRecords.id,
    set: { slug: record.slug, status: record.status, sortOrder: record.sortOrder, data: record.data, updatedAt: now, publishedAt },
  });
  await db.insert(auditLogs).values({
    id: randomUUID(), actor,
    action: before ? (before.status === record.status ? "update" : `status:${before.status}->${record.status}`) : "create",
    recordType: record.type, recordId: record.id,
    before: before ? { slug: before.slug, status: before.status, sortOrder: before.sortOrder, data: before.data } : null,
    after: { slug: record.slug, status: record.status, sortOrder: record.sortOrder, data: record.data },
  });
}

export async function listAuditEntries(limit = 100) {
  if (!isDatabaseConfigured()) return [];
  return getDatabase().select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(Math.max(1, Math.min(limit, 250)));
}
