import type { MetadataRoute } from "next";
import { event } from "./lib/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: event.name,
    short_name: "Shams",
    description: event.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#f5f2eb",
    theme_color: "#f5f2eb",
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
