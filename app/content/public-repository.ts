import "server-only";

import { draftMode } from "next/headers";
import { contentRepository } from "./repository";
import type {
  Artist,
  ContactPageContent,
  FaqEntry,
  InformationPageContent,
  ProgrammeEntry,
  TicketTier,
} from "./models";
import type { PublicContentType } from "./database-public-records";

type FailurePolicy = "error" | "local-fallback";

function sourceMode() {
  return process.env.CONTENT_SOURCE?.trim().toLowerCase() === "database"
    ? "database"
    : "local";
}

function failurePolicy(): FailurePolicy {
  return process.env.CONTENT_DATABASE_FAILURE?.trim().toLowerCase() ===
    "local-fallback"
    ? "local-fallback"
    : "error";
}

function localFor(type: PublicContentType): unknown[] {
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

async function records(type: PublicContentType) {
  // Keep the normal local-content path static and independent of request APIs,
  // PostgreSQL, Drizzle, and the Node runtime.
  if (sourceMode() === "local") return localFor(type);

  const preview = (await draftMode()).isEnabled;

  try {
    // Load the Node/PostgreSQL adapter only when database mode is selected.
    // This prevents local mode and client-safe metadata routes from acquiring
    // the database driver's Node-core dependency graph.
    const { readDatabasePublicRecords } = await import(
      "./database-public-records"
    );
    return await readDatabasePublicRecords(type, preview);
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
  getArtistBySlug: async (slug: string) =>
    (await records("artist") as Artist[]).find((item) => item.slug === slug),
  getProgramme: async () => records("programme") as Promise<ProgrammeEntry[]>,
  getTickets: async () => records("ticket") as Promise<TicketTier[]>,
  getFaqs: async () => records("faq") as Promise<FaqEntry[]>,
  getInformationPage: async (slug: InformationPageContent["slug"]) =>
    (await records("page") as InformationPageContent[]).find(
      (item) => item.slug === slug,
    ),
  getContactPage: async () =>
    (await records("page") as Array<
      InformationPageContent | ContactPageContent
    >).find((item) => "routes" in item) as ContactPageContent | undefined,
} as const;
