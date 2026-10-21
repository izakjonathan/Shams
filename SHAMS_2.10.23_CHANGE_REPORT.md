# Shams 2.10.23 — Vercel Blob integration

## Implemented

- Replaced the Cloudflare R2 **write** path with Vercel Blob **direct browser uploads** via `@vercel/blob@2.3.0`.
- Kept PostgreSQL as the default upload backend (`MEDIA_STORAGE=database`) until Vercel Blob is connected and activated.
- Added authenticated `/api/media/client` token route with same-origin checks, write policy, strict image path namespace, image MIME allowlist and 12 MB limit.
- Preserved the Gallery file picker, progress reporting, 8 MB large-image-only optimization, and save/publish behaviour.
- Extended public-content media allowlist, CSP and Next.js image host configuration for approved Vercel Blob URLs; arbitrary external URLs remain rejected.
- Preserved existing PostgreSQL media URLs and optional read-only R2 compatibility for any previously uploaded R2 objects. Removed the obsolete R2 migration command.
- Updated the dependency manifest and lockfile with the exact Blob SDK version and dependencies.

## Checks performed

- Static architecture audit: **passed**.
- Runtime boundary audit: **passed**.
- Release configuration validation: **passed** (expected warnings for unset optional environment variables).
- Parsed 116 TypeScript/TSX files using TypeScript transpilation diagnostics: **0 syntax errors**.
- Approved Vercel Blob URL acceptance / unapproved URL rejection: **passed** in isolated runtime smoke check.
- New lockfile dependency metadata consistency: **passed** in a structural check.

## Not verified

- `npm ci`, full TypeScript typecheck, Next.js production build, browser end-to-end tests and real Vercel Blob upload/download were **not run** because package registry access is unavailable here and no Blob store credentials were supplied.
- No GitHub commit, Vercel environment change, storage store creation or deployment was made.
- Existing PostgreSQL images were not migrated to Blob; they continue to be served by the legacy endpoint.

## Deployment recommendation

Create/connect a public Vercel Blob store to the Shams project, add `MEDIA_STORAGE=blob`, and deploy this version only after a full dependency install/build in CI. See `VERCEL_BLOB_SETUP.md`.
