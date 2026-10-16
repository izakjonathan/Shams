> Historical reference retained from the baseline. For 2.10.0, use HANDOVER_REVIEW.md and docs/development-workflow.md; previous check results and runtime versions do not certify this candidate.

# v2.4.2 production verification guide

## Required local/Vercel gates

Run with Node 22 and the committed lockfile:

```bash
npm ci
npm run audit:boundaries
npm run typecheck
npm run build
npm run test:e2e
```

## Environment matrix

### Local repository mode

```env
CONTENT_SOURCE=local
DATABASE_URL=
```

Expected: the public build succeeds without loading PostgreSQL. Admin database mutations remain unavailable until `DATABASE_URL` is configured.

### Database repository mode

```env
CONTENT_SOURCE=database
CONTENT_DATABASE_FAILURE=error
DATABASE_URL=postgres://...
```

Expected: public pages read published records only. Draft Mode reads draft and published records for authenticated admins.

### Controlled rollback mode

```env
CONTENT_SOURCE=database
CONTENT_DATABASE_FAILURE=local-fallback
DATABASE_URL=postgres://...
```

Expected: database read failures are logged and canonical local content is served. Use only as an explicit operational fallback.

## Import-graph acceptance criteria

The Vercel log must not show a Client or Edge import trace containing:

- `src/features/content/server.ts`
- `src/features/content/public-repository.ts`
- `src/features/content/database-public-records.ts`
- `src/db/client.ts`
- `postgres`
- `next/headers`

The public database pages, admin, and preview routes must report the Node.js runtime. Open Graph remains Edge-compatible and database-independent.

## Database acceptance test

1. Apply the migration.
2. Seed canonical content.
3. Publish one draft record.
4. Confirm its content tag is invalidated.
5. Confirm the public page changes.
6. Move it back to draft and confirm it disappears publicly.
7. Confirm authenticated preview still displays it.
8. Confirm the audit log records both status changes.

## 2.10.7 verification

Passed: production build, TypeScript, 12 unit tests, static architecture audit, runtime-boundary audit and release configuration validation. ESLint completed with no errors and four existing next/no-img-element warnings. No database change; SQL checks were not needed. Physical iPhone/Safari toolbar tint and browser interaction checks were not available in this environment; follow APPLY_CHANGES.md for device checks. Reviewed the changed React components for hook dependencies, accessibility, hydration and render behaviour; no new interaction or fetching was introduced.
