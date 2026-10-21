# Shams 2.10.22 — Production hardening and handover notes

Source: 2.10.21 public-read hotfix ZIP. This release **does not modify production** until deployed.

## 1. Production stability / 2. Error resilience

- Retains the 2.10.21 hotfix: legacy records are shape-checked on reads without new write-size limits.
- Public record readers now isolate invalid rows; a malformed artist, gallery image, FAQ, etc. no longer aborts the entire collection. Invalid rows are logged with record type/ID (not the record JSON) for targeted repair.
- Database connection failures now use best-effort last-good data within a running server instance. When there is no last-good data, non-transactional content falls back to the bundled baseline. Ticket data fails **closed** (no price/availability/checkout card) rather than reverting to potentially obsolete prices.
- `CONTENT_DATABASE_FAILURE=error` remains a supported strict mode for teams that prefer fail-fast behavior. Set `CONTENT_DATABASE_FAILURE=local-fallback` in Vercel production to enable the resilient mode. (The default is now local-fallback when unset.) Draft previews still fail rather than silently showing public/local content.
- `getPublishedArtists` now uses the same error boundary as other public content.
- Important limitation: the last-good cache is per server instance, not a shared durable snapshot. Consider shared last-known-good content snapshots for strict availability SLAs.

## 3. Dedicated image storage

- Optional Cloudflare R2 integration using AWS Signature V4 (no new package dependency).
- Set `MEDIA_STORAGE=r2`, `R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY` **together** on Vercel. Create a private bucket; only the server needs credentials. Use a scoped R2 API token that can read/write objects in that bucket. Never use a public write token.
- New uploads use R2 when enabled, keeping the existing `/api/media/<uuid>` paths. The media route reads R2 first, then legacy PostgreSQL for missing R2 objects. Old URLs therefore remain valid.
- One-time copy/verification: `npm run media:migrate:r2` (run with database credentials and R2 credentials). This copies legacy objects to R2 with the same IDs, checks SHA-256 of the downloaded objects, and **does not delete** PostgreSQL originals. The script is resumable.
- Uploads enforce 12 MB maximum (including bounded multipart input), allowed image magic bytes and MIME, authenticated admin, write policy, and same-origin checks. Only images over 8 MB are offered browser-side optimisation.
- Before enabling R2, ensure the R2 bucket is provisioned and credentials configured. Without them, leave `MEDIA_STORAGE=database`; this is a backwards-compatible mode, not the intended long-term storage.
- Follow-up: after an observed migration and retention period, arrange a separate, audited deletion of old PostgreSQL image bytes to reduce DB size. Do **not** delete the legacy table as part of this release.

## 4. Backend simplification

- Reuses the existing pooled SQL connection for legacy media instead of opening and closing a PostgreSQL connection on every image request.
- Centralizes per-row public-read isolation in `mapValidPublicRecords`.
- Keeps write-side validation, session revocation, and stable-order reordering from 2.10.21 unchanged.

## 5. Admin usability

- Upload progress indicator, clear success/failure messages, and a guard preventing save/publish while an image is still uploading.
- Published/draft/archived state shown prominently in the simple and full record editors, along with last-saved timestamp.
- Clearer save-button language for published content, and a controlled unavailable state for tickets when price data cannot be safely loaded.

## Release procedure

1. Back up the production database and confirm the current Vercel deployment ID; preserve a known-good rollback.
2. Provision R2 and set secrets, or keep `MEDIA_STORAGE=database` until it is ready. Never commit actual credentials.
3. Set `CONTENT_DATABASE_FAILURE=local-fallback` for production (unless strict behavior is deliberately required).
4. Run `npm ci`, `npm run typecheck`, `npm test`, `npm run test:db`, `npm run build`, and browser checks against a staging database. Validate upload, published gallery, draft preview, and all public pages.
5. Deploy this source via the existing GitHub/Vercel pipeline. Watch runtime logs and verify the production URL. If public pages regress, roll back to the previous known-good deployment.
6. With R2 enabled, run `npm run media:migrate:r2` from a secure environment. Keep PostgreSQL originals during the migration period.

## Verification in this environment

- Passed: static architecture audit; runtime-boundary audit; TypeScript/TSX syntax transpilation (116 files at initial check).
- Not verified: full typecheck, dependency-based unit/integration tests, Next.js build, live R2 access, database migration, production deployment. `npm ci` could not complete due to network/dependency access in this environment.
- Production logs previously confirmed the 2.10.20 regression `[admin content] A content object exceeds 250 fields.`; 2.10.21 fixes the underlying read/write validation separation and this version retains it.

## Outstanding recommendations

- Test R2 object signing against a real bucket before switching the live storage mode.
- Consider server-side image transformation if uploading from browsers that cannot optimise large images.
- Add shared durable stale-content snapshots and metrics/alerting for persistent database outages.
- Review R2 egress costs, backup/retention policies, and database cleanup only after migration is verified.
