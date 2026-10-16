> Historical reference retained from the baseline. For 2.10.0, use HANDOVER_REVIEW.md and docs/development-workflow.md; previous check results and runtime versions do not certify this candidate.

## 2.10.8 — Motion verification (16 October 2026)

| Check | Result |
| --- | --- |
| Production build | Passed; 14 static pages generated, public and admin routes built. A stale local Turbopack cache was moved aside after a cache panic; the clean build and subsequent build both passed. |
| TypeScript | Passed, including the final browser-test fixtures. |
| ESLint | No errors; four existing admin next/no-img-element warnings. |
| Unit tests | All 12 session/content tests passed. |
| Static architecture / runtime boundaries / release validation | Passed. Existing missing public ticket/newsletter/site URL notices are local configuration notices, not new requirements. |
| Chromium desktop and mobile emulation | 33 applicable checks passed; one mobile-menu-only check skipped on desktop. |
| WebKit with iPhone 13 viewport/touch emulation | All 17 applicable checks passed across the full run and the corrected motion-test rerun. One initial failure was a test comparing equivalent CSS number serialization (0.00001s versus 1e-05s); the final assertion compares duration numerically. |
| Screens inspected | 390 × 844 hero, menu, programme and ticket screens. Narrow overflow checks also passed at 360 × 740. |
| Database / production | No SQL or production checks needed for these presentation-only changes; no migration, credentials, production mutation or deployment. |

Browser evidence covers 50 distinct applicable test/project cases. The environment could not retrieve browsers matching the project's pinned Playwright version, so compatible Playwright 1.51.1 browser binaries and a temporary runner were used without changing project dependencies. WebKit ran against a temporary local HTTPS proxy because the existing production CSP upgrades subresources to HTTPS. Security headers were preserved.

Browser cases cover fresh/repeat splash startup, deferred page images, reduced-motion startup, live preference changes, gallery loading/automatic advancement/pause, three-slide bounds, keyboard reveal, observer fallback, no-JavaScript content, narrow overflow, menu closure, filters, FAQ controls, artist route returns and footer contact.

Limitations: Linux WebKit emulation is not a physical iPhone or the latest native Safari. Native toolbar tint, sustained device frame rate, GPU memory and battery use remain device checks. No 60fps, INP or battery improvement claim is made from desktop emulation. See docs/MOTION_REVIEW.md for research, design choices and tradeoffs.

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
