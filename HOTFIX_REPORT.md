# Shams 2.10.21 — Public site error hotfix

**Date:** 20 October 2026
**Based on:** Shams 2.10.20 Gallery Uploader source ZIP (including the previous backend fixes)
**Deployment status:** Not deployed by this update

## Confirmed production failure

Vercel runtime errors for project `shams` on the production domain `shams-nine-rho.vercel.app` show the exception:

`Error: [admin content] A content object exceeds 250 fields.`

The stack trace points to the content validation invoked from `src/features/content/database-public-records.ts`, affecting public reads for artists, tickets, programme and page records. The frontend error boundary displays “The sun slipped behind a cloud.”

## Root cause

The 2.10.19 content-budget guard was intended for incoming admin writes, but `validateAdminRecord()` was also called when reading existing database content. Legacy published records containing more than 250 fields consequently caused public page rendering to fail. The earlier review report's claim that old content was unaffected was incorrect.

## Implemented fix

- Split structural validation from write-budget validation in `src/features/content/admin-validation.ts`.
- `validateAdminRecord()` continues to enforce all size and complexity limits for writes.
- Added `validateStoredAdminRecord()` for reading existing database content; it retains structural checks, metadata checks, local-media restrictions and safe-link checks without enforcing new write-only budgets.
- Updated `src/features/content/database-public-records.ts` to use the read validator.
- Added a regression test ensuring oversized legacy content remains readable, cannot bypass write limits, and still fails invalid shape/media checks.
- No migration, data deletion, changes to published content, or upload-workflow changes.

## Verification

**Passed:**
- Read/write regression smoke test executed using the locally transpiled TypeScript validation module.
- All 40 canonical seed records pass read and write validation.
- A record with more than 250 keys passes stored-record read validation but fails write validation.
- Invalid name and external media URL still fail stored-record validation.
- Static architecture audit.
- Runtime-boundary audit.
- Release configuration validation (three environment-configuration warnings only).

**Not verified:**
- Complete unit test suite, full TypeScript project typecheck and production build (dependencies not installed; local Node 22 versus target Node 24).
- Browser end-to-end tests, live database reads against production, and post-deployment HTTP responses.
- Earlier backend-review caveats: full PostgreSQL concurrency testing and image-upload end-to-end verification.

## Release instructions

1. Commit/deploy the source from `shams-2.10.21-public-read-hotfix.zip` with the project's normal Git/Vercel process.
2. On Node.js 24 with dependencies available, run `npm ci`, `npm test`, `npm run typecheck`, `npm run build`, `npm run lint` and the browser checks.
3. Verify the home page and artist, programme, ticket, gallery and legal-page routes after deployment. Check runtime logs for the previous exception.
4. If the public site must be restored immediately before deploying the hotfix, consider rolling back to the last known-good deployment in Vercel; this may temporarily remove the latest admin/gallery features.
