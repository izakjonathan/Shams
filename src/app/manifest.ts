import type { MetadataRoute } from "next";
import { contentRepository } from "../features/content";

const event = contentRepository.getEvent();

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: event.name,
    short_name: "Shams",
    description: event.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
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
