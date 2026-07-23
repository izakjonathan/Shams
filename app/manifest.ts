import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shams for Humanity",
    short_name: "Shams",
    description: "A gathering of music, art and collective care. Copenhagen, 06 September 2026.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f2eb",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
