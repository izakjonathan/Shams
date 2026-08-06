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
