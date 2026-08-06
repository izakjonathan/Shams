# Shams for Humanity v2.4.2

Production runtime-boundary hardening for the v2.4 database-backed public-content architecture.

## What changed

- Database public reads now live in a dedicated `server-only` adapter.
- The public repository loads that adapter dynamically only when `CONTENT_SOURCE=database`.
- Local content mode remains independent of PostgreSQL, Drizzle, Draft Mode database reads, and Node-core driver modules.
- All database-backed public pages, admin routes, and preview routes explicitly use the Node.js runtime.
- The `postgres` driver is externalized from Next.js server bundles.
- Client components, layout metadata, manifest, sitemap, and Edge Open Graph generation remain database-free.
- A dedicated runtime-boundary audit runs during `prebuild` and the complete verification workflow.
- Vercel automatically uses `npm ci` once a committed lockfile exists, while retaining `npm install` as a temporary fallback for this package.

The approved public design, splash, Safari canvas handling, footer-contact behavior, menu, editorial curtain, admin governance, Draft Mode preview, and content-source controls are unchanged.
