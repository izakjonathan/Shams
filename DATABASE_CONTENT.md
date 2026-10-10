> Historical reference retained from the baseline. For 2.10.0, use HANDOVER_REVIEW.md and docs/development-workflow.md; previous check results and runtime versions do not certify this candidate.

# Database content rollout and rollback

## Safe rollout

1. Keep `CONTENT_SOURCE=local` in production.
2. Configure `DATABASE_URL` and admin credentials on a protected Vercel preview.
3. Run the migration and seed canonical local records.
4. Verify every content workspace and audit entry in `/admin`.
5. Use “Preview in public design” to inspect drafts; Draft Mode never silently falls back to local content.
6. Publish one record of each type and verify only published records appear with `CONTENT_SOURCE=database` on preview.
7. Confirm artist, programme, ticket, FAQ, legal, and contact cache invalidation after publishing.
8. Switch production to `CONTENT_SOURCE=database` only after preview verification.

## Failure policy

- `CONTENT_DATABASE_FAILURE=error` exposes database failures and is recommended after rollout.
- `CONTENT_DATABASE_FAILURE=local` is an explicit operational fallback, not an automatic hidden recovery.

## Rollback

Set `CONTENT_SOURCE=local` and redeploy. The canonical typed local repository remains intact and does not depend on PostgreSQL. No frontend rollback or component changes are required.

## Revision history (v2.9.0)

Run `src/db/migrations/0002_content_revisions.sql` after the original content migration. Each database-backed save captures the previous canonical record in `content_revisions`. Restoring an older revision first captures the current state, then validates and applies the selected snapshot, writes an audit entry, and invalidates the affected public content cache tag.

## GitHub Actions database administration (v2.9.4)

Database schema operations are intentionally outside the public/admin runtime. Use the manual GitHub Actions in `.github/workflows/database-*.yml` and the instructions in `DATABASE_GITHUB_ACTIONS.md`. The canonical seed preserves local statuses; placeholder records must be explicitly published before switching `CONTENT_SOURCE=database`.


In v2.9.2 the seed snapshot treats the checked-in public baseline as published, because the same records are already rendered by local mode. Database public reads remain strictly published-only.


## Existing-record repair (v2.9.4)

If **Database — Verify** reports `Content JSON metadata mismatch`, run **Database — Repair Records** manually in GitHub Actions. Enter `REPAIR` when prompted. The workflow normalizes only duplicated JSON metadata from the authoritative database columns, records a revision and audit entry for every changed row, and runs verification automatically afterward. Do not reseed the database to fix this condition.
