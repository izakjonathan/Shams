import type { MetadataRoute } from "next";
import { siteTheme } from "./lib/theme";
import { event } from "./lib/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: event.name,
    short_name: "Shams",
    description: event.tagline,
    start_url: "/",
    display: "standalone",
    background_color: siteTheme.paper,
    theme_color: siteTheme.paper,
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
