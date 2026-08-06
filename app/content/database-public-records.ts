import "server-only";

import { unstable_cache } from "next/cache";
import { and, asc, eq } from "drizzle-orm";
import { getDatabase, isDatabaseConfigured } from "../db/client";
import { contentRecords } from "../db/schema";
import { validateAdminRecord, type AdminContentType } from "./admin-validation";
import type { ContentStatus } from "./models";
import { CONTENT_TAGS } from "./cache-tags";

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

  return rows.map((row) =>
    validateAdminRecord(row.data, {
      id: row.id,
      type: row.type as AdminContentType,
      slug: row.slug,
      status: row.status as ContentStatus,
      sortOrder: row.sortOrder,
    }),
  );
}

const cachedPublishedReaders: Record<
  PublicContentType,
  () => Promise<unknown[]>
> = {
  artist: unstable_cache(
    () => queryDatabase("artist", false),
    ["public-artists-v2"],
    { tags: [CONTENT_TAGS.artist] },
  ),
  gallery: unstable_cache(
    () => queryDatabase("gallery", false),
    ["public-gallery-v1"],
    { tags: [CONTENT_TAGS.gallery] },
  ),
  programme: unstable_cache(
    () => queryDatabase("programme", false),
    ["public-programme-v2"],
    { tags: [CONTENT_TAGS.programme] },
  ),
  ticket: unstable_cache(
    () => queryDatabase("ticket", false),
    ["public-tickets-v2"],
    { tags: [CONTENT_TAGS.ticket] },
  ),
  faq: unstable_cache(
    () => queryDatabase("faq", false),
    ["public-faqs-v2"],
    { tags: [CONTENT_TAGS.faq] },
  ),
  page: unstable_cache(
    () => queryDatabase("page", false),
    ["public-pages-v2"],
    { tags: [CONTENT_TAGS.page] },
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
