import type { MetadataRoute } from "next";
import { artists } from "./lib/content";
import { siteUrl } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
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
