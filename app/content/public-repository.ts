import "server-only";
import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import { asc, eq, and } from "drizzle-orm";
import { getDatabase, isDatabaseConfigured } from "../db/client";
import { contentRecords } from "../db/schema";
import { validateAdminRecord, type AdminContentType } from "./admin-validation";
import { contentRepository } from "./repository";
import type { Artist, ContentStatus, FaqEntry, InformationPageContent, ContactPageContent, ProgrammeEntry, TicketTier } from "./models";
import { CONTENT_TAGS } from "./cache-tags";

type PublicType = keyof typeof CONTENT_TAGS;
type FailurePolicy = "error" | "local-fallback";

function sourceMode() {
  return process.env.CONTENT_SOURCE?.trim().toLowerCase() === "database" ? "database" : "local";
}

function failurePolicy(): FailurePolicy {
  return process.env.CONTENT_DATABASE_FAILURE?.trim().toLowerCase() === "local-fallback" ? "local-fallback" : "error";
}

function localFor(type: PublicType): unknown[] {
  if (type === "artist") return contentRepository.getArtists();
  if (type === "programme") return contentRepository.getProgramme();
  if (type === "ticket") return contentRepository.getTickets();
  if (type === "faq") return contentRepository.getFaqs();
  return [
    contentRepository.getInformationPage("privacy"),
    contentRepository.getInformationPage("terms"),
    contentRepository.getInformationPage("accessibility"),
    contentRepository.getContactPage(),
  ];
}

async function readDatabase(type: PublicType, includeDrafts: boolean) {
  if (!isDatabaseConfigured()) throw new Error("CONTENT_SOURCE=database requires DATABASE_URL.");
  const db = getDatabase();
  const rows = includeDrafts
    ? await db.select().from(contentRecords).where(eq(contentRecords.type, type)).orderBy(asc(contentRecords.sortOrder))
    : await db.select().from(contentRecords).where(and(eq(contentRecords.type, type), eq(contentRecords.status, "published"))).orderBy(asc(contentRecords.sortOrder));

  return rows.map((row) => validateAdminRecord(row.data, {
    id: row.id,
    type: row.type as AdminContentType,
    slug: row.slug,
    status: row.status as ContentStatus,
    sortOrder: row.sortOrder,
  }));
}

const cachedPublished = {
  artist: unstable_cache(() => readDatabase("artist", false), ["public-artists"], { tags: [CONTENT_TAGS.artist] }),
  programme: unstable_cache(() => readDatabase("programme", false), ["public-programme"], { tags: [CONTENT_TAGS.programme] }),
  ticket: unstable_cache(() => readDatabase("ticket", false), ["public-tickets"], { tags: [CONTENT_TAGS.ticket] }),
  faq: unstable_cache(() => readDatabase("faq", false), ["public-faqs"], { tags: [CONTENT_TAGS.faq] }),
  page: unstable_cache(() => readDatabase("page", false), ["public-pages"], { tags: [CONTENT_TAGS.page] }),
};

async function records(type: PublicType) {
  if (sourceMode() === "local") return localFor(type);
  const preview = (await draftMode()).isEnabled;
  try {
    return preview ? await readDatabase(type, true) : await cachedPublished[type]();
  } catch (error) {
    console.error(`[public content] Failed to read ${type} from database.`, error);
    if (failurePolicy() === "local-fallback") return localFor(type);
    throw error;
  }
}

export const publicContentRepository = {
  getEvent: () => contentRepository.getEvent(),
  getHome: () => contentRepository.getHome(),
  getPrimaryNavigation: () => contentRepository.getPrimaryNavigation(),
  getInformationNavigation: () => contentRepository.getInformationNavigation(),
  getArtists: async () => records("artist") as Promise<Artist[]>,
  getArtistBySlug: async (slug: string) => (await records("artist") as Artist[]).find((item) => item.slug === slug),
  getProgramme: async () => records("programme") as Promise<ProgrammeEntry[]>,
  getTickets: async () => records("ticket") as Promise<TicketTier[]>,
  getFaqs: async () => records("faq") as Promise<FaqEntry[]>,
  getInformationPage: async (slug: InformationPageContent["slug"]) => (await records("page") as InformationPageContent[]).find((item) => item.slug === slug),
  getContactPage: async () => (await records("page") as Array<InformationPageContent | ContactPageContent>).find((item) => "routes" in item) as ContactPageContent | undefined,
} as const;
