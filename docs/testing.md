# Testing and evidence
Review date: 10 October 2026. Commands were executed against candidate 2.10.0; no tests wrote to production.

| Check | Result |
|---|---|
| Baseline production build | Passed before changes |
| Release configuration validation | Passed with expected unconfigured integration warnings |
| Static architecture and runtime boundaries | Passed |
| TypeScript | Passed |
| ESLint | Passed: 0 errors, 4 existing plain-image warnings in admin media previews |
| Unit tests | 7 passed: session expiry/tampering/rotation, preview redirect, canonical/unsafe content validation |
| Production build | Passed on Next.js 16.4.0; existing Edge OG runtime deprecation remains |
| Isolated PGlite SQL checks | See HANDOVER_REVIEW.md for final count; real PostgreSQL required for 4 skipped cases |
| Local production HTTP smoke | 9 public/login/metadata routes returned 200 with nosniff; 4 unauthenticated admin/preview probes redirected to login |
| Live deployed site | Desktop homepage and artist navigation inspected; public database FAQ edits visible |
| npm audit --omit=dev | Zero known runtime advisories at review time |
| Full dependency audit | 9 development-only entries: 5 high, 4 moderate; braces/esbuild chains; not a clean full audit |
| Playwright Chromium/WebKit and visual snapshots | Not executed: browser downloads failed in this environment; CI is configured to install/run functional suite |
| Production schema/backup/restore | Not verified: direct database DNS access failed; no production writes performed |

Run `npm run verify` for source/build/browser gates. CI additionally provisions PostgreSQL 17 and runs `npm run test:db` before verify. Tests refuse non-loopback targets and any database name other than shams_test, then DROP its public schema: use a dedicated disposable database. PGlite is single-engine and cannot establish true parallel row-lock correctness; its socket error handling also cannot reliably exercise injected SQL exception rollback or the locked CLI seed. Those cases remain enabled on real PostgreSQL, not deleted or treated as passes.

Before sign-off test authenticated create/edit/publish/unpublish/restore, simultaneous editors, failed audit rollback, disabled preview writes, expired preview session, logout, unsafe redirects/links, private response caching, database-mode published sitemap/JSON-LD, provider ticket/newsletter behaviour, keyboard focus, reduced motion, mobile menu/viewport, gallery pause and route curtain return anchors. Existing browser tests mostly exercise local content and do not certify live database admin workflows. Review visual snapshots separately; do not automatically approve new screenshots.
