import type { MetadataRoute } from "next";
import { artists, artistSlug } from "./lib/content";
import { siteUrl } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...artists.map((artist) => ({
      url: `${siteUrl}/artists/${artistSlug(artist.name)}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
