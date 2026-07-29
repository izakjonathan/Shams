import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { contentRepository } from "../../content";
import { getDatabase, isDatabaseConfigured } from "../../db/client";
import { auditLogs, contentRecords } from "../../db/schema";

export type AdminContentType = "artist" | "programme" | "ticket" | "faq" | "page";

export interface AdminRecord {
  id: string;
  type: AdminContentType;
  slug: string | null;
  status: string;
  sortOrder: number;
  data: Record<string, unknown>;
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
  }));
}

export async function listAdminRecords(type: AdminContentType) {
  if (!isDatabaseConfigured()) return { source: "local" as const, records: localAdminRecords(type) };
  const db = getDatabase();
  const rows = await db.select().from(contentRecords).where(eq(contentRecords.type, type)).orderBy(asc(contentRecords.sortOrder));
  return { source: "database" as const, records: rows.map((row) => ({ ...row, type: row.type as AdminContentType, data: row.data as Record<string, unknown> })) };
}

export async function getAdminRecord(type: AdminContentType, id: string) {
  if (!isDatabaseConfigured()) return localAdminRecords(type).find((record) => record.id === id) ?? null;
  const [row] = await getDatabase().select().from(contentRecords).where(and(eq(contentRecords.type, type), eq(contentRecords.id, id))).limit(1);
  return row ? { ...row, type: row.type as AdminContentType, data: row.data as Record<string, unknown> } : null;
}

export async function seedDatabase(actor: string) {
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured.");
  const db = getDatabase();
  const allTypes: AdminContentType[] = ["artist", "programme", "ticket", "faq", "page"];
  for (const type of allTypes) {
    for (const record of localAdminRecords(type)) {
      await db.insert(contentRecords).values({ ...record, data: record.data, updatedAt: new Date() }).onConflictDoUpdate({
        target: contentRecords.id,
        set: { slug: record.slug, status: record.status, sortOrder: record.sortOrder, data: record.data, updatedAt: new Date() },
      });
    }
  }
  await db.insert(auditLogs).values({ id: randomUUID(), actor, action: "seed", recordType: "all", recordId: "local-content", after: { version: "2.1.5" } });
}

export async function saveAdminRecord(actor: string, record: AdminRecord) {
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL is not configured.");
  const db = getDatabase();
  const before = await getAdminRecord(record.type, record.id);
  await db.insert(contentRecords).values({ ...record, data: record.data, updatedAt: new Date(), publishedAt: record.status === "published" ? new Date() : null }).onConflictDoUpdate({
    target: contentRecords.id,
    set: { slug: record.slug, status: record.status, sortOrder: record.sortOrder, data: record.data, updatedAt: new Date(), publishedAt: record.status === "published" ? new Date() : null },
  });
  await db.insert(auditLogs).values({ id: randomUUID(), actor, action: before ? "update" : "create", recordType: record.type, recordId: record.id, before: before?.data, after: record.data });
}
