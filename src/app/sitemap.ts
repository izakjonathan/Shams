import type { MetadataRoute } from "next";
import { publicContentRepository } from "../features/content/server";
import { siteUrl } from "../lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const artists = await publicContentRepository.getPublishedArtists();
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...["privacy", "terms", "accessibility", "contact"].map((route) => ({
      url: `${siteUrl}/${route}`,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
    ...artists.map((artist) => ({
      url: `${siteUrl}/artists/${artist.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
