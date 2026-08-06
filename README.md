# Shams for Humanity v2.4.1

Server/client content-boundary fix for the v2.4.0 database-backed public-content release.

## What changed

- `app/content/index.ts` is now strictly client-safe and no longer re-exports database or Draft Mode code.
- `app/content/server.ts` is the explicit server-only entry for `publicContentRepository`.
- Server pages import database-backed content only through that server entry.
- `SiteHeader`, manifest, Open Graph image generation, layout, sitemap, and other client/Edge consumers retain only local client-safe content imports.
- Cache tags have one canonical definition in `app/content/cache-tags.ts`.

This prevents `next/headers`, `server-only`, Drizzle, and the Node PostgreSQL driver from entering client or Edge bundles. The public design, admin workflow, preview system, Safari handling, splash, menu, and route curtain are unchanged.
