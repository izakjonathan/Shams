# v2.4.3 production runtime-boundary audit

## Scope

This release addresses the remaining production-build risk after v2.4.1 separated the client-safe content barrel from the server repository.

## Findings and corrections

### Eager PostgreSQL ownership

The public repository still imported Drizzle, the database client, schema, and cache implementation at module evaluation time. Although the module was server-only, that made every consumer of the repository acquire the full PostgreSQL graph.

The database query and cache implementation now lives in `app/content/database-public-records.ts`. It is loaded with a dynamic server import only after `CONTENT_SOURCE=database` has been selected. Local mode returns before request APIs or database code are loaded.

### Runtime ambiguity

Public pages using database-backed content, admin routes, and preview routes now declare `runtime = "nodejs"`. Edge Open Graph generation, manifest, sitemap, root metadata, and client components continue to use only canonical local content.

### PostgreSQL bundling

`next.config.ts` now declares `serverExternalPackages: ["postgres"]`, preventing Turbopack from attempting to browser-bundle the Node-only driver.

### Regression protection

A dedicated `scripts/check-runtime-boundaries.mjs` audit rejects:

- server-only imports in Client Components;
- server exports from the shared content barrel;
- database imports from metadata or Edge routes;
- missing Node runtime declarations;
- removal of PostgreSQL externalization.

The boundary audit runs during `prebuild` and `npm run verify`.

## Verification completed

- Theme generation passed.
- Runtime-boundary audit passed.
- Static architecture audit passed.
- Release validation passed.
- JavaScript syntax checks passed.
- CSS brace validation passed.
- ZIP integrity passed.

## Still requiring external verification

A new lockfile and full dependency-backed build could not be generated in this environment because its npm proxy does not provide `@playwright/test@1.62.0`, while direct public-registry resolution timed out. A Vercel preview build, PostgreSQL migration/read/write test, and real-iPhone regression pass remain required.
