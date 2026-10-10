## Current validation — 2.10.5

Clean production build, explicit typecheck, lint (four existing image warnings), ten unit tests, static architecture audit, runtime boundary audit and release validation passed. Isolated built-server HTTP tests passed for homepage first-save/public rendering, inline FAQ saves, draft creation, publishing, labelled contact-field saves, authentication, login storage recovery and rate limits, legacy media, and social image PNG. Seven isolated SQL tests passed, including atomic reorder/tied positions/stale versions; three real PostgreSQL concurrency/error-protocol cases remain skipped locally and are covered by the existing CI configuration. Desktop/iPhone browser visual and interaction checks were not executed because browser binaries are unavailable. A local Turbopack cache panic cleared after removing generated .next and rebuilding successfully; no source workaround was required. No production mutation, push or deployment occurred.

## 2.10.5 — Simple single-page content editor

Admin now opens a compact, mobile-oriented list of expandable sections. Homepage copy, artists, gallery, programme, tickets, FAQs and contact/information pages have inline forms. Save returns to the edited section with confirmation. New collection entries save as drafts and have an explicit Publish button. Published record saves retain publication. Status actions and revision history are in More options. Reordering locks the collection and atomically writes changed positions, recovery snapshots and audit entries; tied positions are normalized. Contact and legal page editing uses labelled fields instead of JSON.

Homepage copy is a validated `page` record with stable ID `page-home` and no slug. Existing databases need no new SQL type or migration for it. Until this record is first saved/published, the existing canonical homepage copy renders. Its first save uses the standard authenticated atomic writer and creates a published record; existing homepage edits use strict versions. Database-mode public reads consume published homepage copy and page cache invalidation. Local mode remains canonical/read-only. Other event date/location details, fixed ticket section copy and navigation remain code/config managed. Images use existing local media paths; uploads are not introduced.


Validation for 2.10.4: production build, explicit type checking, lint (four existing image warnings), nine unit tests, architecture and runtime boundary audits passed. Isolated built-server HTTP checks passed for authenticated site rendering, record edit destinations, no public edit controls, login credential/storage/rate-limit behaviour, legacy media and social images. Desktop/iPhone visual browser checks were not run because browser binaries are unavailable in this environment; verify button placement and carousel/accordion interaction before handover. No production data or deployment changed.

## 2.10.4 — Frontend editing view

The admin landing page renders the shared public homepage with section controls and direct record edit links. Gallery controls follow the current slide; FAQs and programme filters remain interactive. Navigation uses the public paper colour and typography. Drafts and archives remain available in collection editors, while the landing preview shows published content. Homepage hero/about/mission/event/newsletter copy remains code-managed; this release does not add database fields for that copy. Save, publication, authorization, revisions and concurrency checks are unchanged.
# 2.10.3 login verification

Nine unit tests, TypeScript, static/runtime audits, lint (four existing warnings) and production build pass. The database-mode built-server fixture drops only its isolated login-counter table and uses synthetic credentials. Real form POSTs verify normal wrong-password feedback, correct-password setup/session creation, wrong-password feedback after setup and genuine rate limiting. Storage-outage/failed-setup decisions are unit tested and remain fail-closed. This is a local PostgreSQL-compatible server test, not production database/MFA/browser certification.

---

# 2.10.2 custom-record verification

Eight unit tests, types, lint/static/runtime checks and production build pass. The built server's database-mode fixture includes custom artist and gallery records without baseline images. It validates homepage, existing/custom artist pages, visible custom text and neutral placeholder, sitemap and the social-preview PNG. Set DATABASE_POOL_MAX=1 only in the PGlite fixture to avoid the emulator's multi-connection protocol collision; default application pool remains 3, configurable between 1 and 10. Actual production data and full browser/real-PostgreSQL gates remain unverified.

---

# 2.10.1 regression verification

Passed: eight unit tests, TypeScript, static/runtime audits, lint (four unchanged admin-image warnings), release validation and production build. The isolated SQL suite now passes six tests, including the actual seed/repair/alignment CLIs; three real-PostgreSQL concurrency/error cases remain skipped in PGlite. The earlier CLI failure was traced to JSONB parameter encoding and fixed with tx.json; it is no longer treated as an emulation limitation.

`node scripts/test-public-media-local.mjs` runs an isolated PostgreSQL-compatible fixture and the built Next server in database mode. With unsupported legacy media values on artists/gallery, homepage, Nour's artist page and sitemap returned 200 without the error boundary; edited artist text remained visible. The social-preview endpoint returned a valid PNG with no dynamic star-glyph download error. This is a server HTTP regression check, not a full mobile-browser or production-data certification. Run it after `npm run build`; it never uses production credentials.

The original 2.10.0 record below is historical; browser/production gates still apply.

---

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
