# v2.4.1 server/client content-boundary audit

## Root cause confirmed from the Vercel build

`app/content/index.ts` re-exported `publicContentRepository`. `SiteHeader.tsx`, an explicit Client Component, imported `navigationRepository` from that same barrel. Turbopack therefore followed every barrel export and pulled the server-only public repository into the client graph. That transitively imported `next/headers`, `server-only`, Drizzle, and the Node `postgres` driver, causing the `fs`, `net`, `tls`, and `perf_hooks` resolution failures.

## Corrections

- Removed the server repository export from the shared content barrel.
- Added an explicit `app/content/server.ts` boundary guarded by `server-only`.
- Updated all public Server Components that need database content to import from the server entry.
- Kept local repositories, navigation data, and model types in the client-safe barrel.
- Kept manifest and Edge Open Graph generation on canonical local content so Node database modules cannot enter Edge routes.
- Consolidated cache-tag ownership into one leaf module.
- Added static guards that reject a future server-repository re-export from the client-safe barrel.

## Verification

- Theme generation passed.
- Static architecture audit passed.
- Release validation passed.
- Full local dependency-backed build could not run because the available internal registry does not contain `@playwright/test@1.62.0`.
