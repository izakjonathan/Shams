import "server-only";

import { unstable_cache } from "next/cache";
import { and, asc, eq } from "drizzle-orm";
import { getDatabase, isDatabaseConfigured } from "../../db/client";
import { contentRecords } from "../../db/schema";
import { normalizeAdminRecordData, validateAdminRecord, type AdminContentType } from "./admin-validation";
import type { ContentStatus } from "./models";
import { CONTENT_TAGS } from "./cache-tags";
import { isLocalMedia, publicImageOrBaseline } from "./media-path";
import { canonicalImageForRecord, completeRecordFromCanonicalBaseline } from "./canonical-record-completion";

export type PublicContentType = keyof typeof CONTENT_TAGS;

async function queryDatabase(type: PublicContentType, includeDrafts: boolean) {
  if (!isDatabaseConfigured()) {
    throw new Error("CONTENT_SOURCE=database requires DATABASE_URL.");
  }

  const db = getDatabase();
  const rows = includeDrafts
    ? await db
        .select()
        .from(contentRecords)
        .where(eq(contentRecords.type, type))
        .orderBy(asc(contentRecords.sortOrder), asc(contentRecords.id))
    : await db
        .select()
        .from(contentRecords)
        .where(
          and(
            eq(contentRecords.type, type),
            eq(contentRecords.status, "published"),
          ),
        )
        .orderBy(asc(contentRecords.sortOrder), asc(contentRecords.id));

  return rows.map((row) => {
    const metadata = {
      id: row.id,
      type: row.type as AdminContentType,
      slug: row.slug,
      status: row.status as ContentStatus,
      sortOrder: row.sortOrder,
    };
    const completed = completeRecordFromCanonicalBaseline(metadata.type, metadata.id, row.data);
    const normalized = normalizeAdminRecordData(completed, metadata);
    if ((metadata.type === "artist" || metadata.type === "gallery") && !isLocalMedia(normalized.image)) {
      // Legacy records were accepted before strict image-path validation. Keep
      // all editorial fields and DB bytes; use only this same record's canonical
      // asset for rendering, never an arbitrary external URL or another artist.
      normalized.image = publicImageOrBaseline(normalized.image, canonicalImageForRecord(metadata.type, metadata.id));
      console.warn(`[public content] Using canonical media for ${metadata.type}:${metadata.id}. Review the saved image path in the studio.`);
    }
    const data = validateAdminRecord(normalized, metadata);
    if (!includeDrafts && metadata.type === "page") {
      for (const key of ["sections", "routes"]) {
        if (Array.isArray(data[key])) data[key] = data[key].filter((item: { status?: string }) => item.status === "published" || item.status === "placeholder");
      }
    }
    return data;
  });
}

const cachedPublishedReaders: Record<
  PublicContentType,
  () => Promise<unknown[]>
> = {
  artist: unstable_cache(
    () => queryDatabase("artist", false),
    ["public-artists-v4"],
    { revalidate: 60, tags: [CONTENT_TAGS.artist] },
  ),
  gallery: unstable_cache(
    () => queryDatabase("gallery", false),
    ["public-gallery-v3"],
    { revalidate: 60, tags: [CONTENT_TAGS.gallery] },
  ),
  programme: unstable_cache(
    () => queryDatabase("programme", false),
    ["public-programme-v3"],
    { revalidate: 60, tags: [CONTENT_TAGS.programme] },
  ),
  ticket: unstable_cache(
    () => queryDatabase("ticket", false),
    ["public-tickets-v3"],
    { revalidate: 60, tags: [CONTENT_TAGS.ticket] },
  ),
  faq: unstable_cache(
    () => queryDatabase("faq", false),
    ["public-faqs-v3"],
    { revalidate: 60, tags: [CONTENT_TAGS.faq] },
  ),
  page: unstable_cache(
    () => queryDatabase("page", false),
    ["public-pages-v3"],
    { revalidate: 60, tags: [CONTENT_TAGS.page] },
  ),
};

export async function readDatabasePublicRecords(
  type: PublicContentType,
  includeDrafts: boolean,
) {
  return includeDrafts
    ? queryDatabase(type, true)
    : cachedPublishedReaders[type]();
}
