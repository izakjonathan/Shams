## Current validation — 2.10.6

## 2.10.16 verification

Lint (four existing admin image warnings), TypeScript, all 12 unit tests, static/runtime audits and production build passed. Browser checks at 390px and 1280px confirm exact computed-style parity between the opening and Programme for wash images/opacity and all three glow images, opacity, dimensions and transforms. Hero/About edges coincide and neither viewport has horizontal overflow. Visually inspected the mobile hero, join and Programme comparison. The shared surface uses static CSS, with three decorative aria-hidden glow elements and no new dependency or runtime listener.

## 2.10.15 verification

Lint (four existing admin image warnings), TypeScript, all 12 unit tests, static/runtime audits and a clean production build passed. The initial build encountered a stale Turbopack persistence-cache error; rebuilding after removing generated .next output succeeded. Rendered the production build at 390px and 1280px: the shared wash computes to 72% opacity, Hero/About edges coincide and neither viewport has horizontal overflow. Visually inspected the mobile hero and section join. No new layer, animation, dependency or runtime listener was added.

## 2.10.14 verification

Production build, TypeScript, static/runtime audits and all 12 unit tests passed; ESLint has no errors and four existing admin image warnings. Inspected the mobile hero and checked layout at 390px and 1280px. The same mobile rich-yellow pixel comparison used for 2.10.13 now measures 63.0% coverage, down from 83.8%, restoring more cream space. Both layouts preserve the seamless join and have no horizontal overflow; the adjacent-row join difference is at most 2/255 per channel on mobile and 1/255 on desktop. No runtime dependency, animation, filter, database or authentication change.

## 2.10.13 verification

Production build, TypeScript, static/runtime audits and all 12 unit tests passed. ESLint has no errors and four existing admin image warnings. Rendered the final build at 390px and 1280px; inspected the mobile hero. Both layouts retain coincident Hero/About edges and no horizontal overflow. The mobile rich-yellow area increases from 50.3% to 83.8% of the viewport when compared with the previous recipe under identical rendering (pixel threshold R>235, 170<G<220, B<115; a design-comparison measure, not a performance score). Adjacent rows at the section join differ by at most 2/255 per channel on mobile and 0/255 on desktop. No new dependency, animation, filter or database change. Physical iPhone frame rate and native toolbar tint were not measured.

## 2.10.12 verification

Production build, TypeScript, static/runtime audits and all 12 unit tests passed. ESLint has no errors and four existing admin image warnings. Inspected stronger opening gradients at mobile and desktop sizes (390px and 1280px); both keep transparent child sections above one continuous background, matching edges and no horizontal overflow. Saturated centres now use the same colour-stop values as the shared paper-orb recipe. No new blur, animation, runtime listener, image or dependency was added.

## 2.10.11 verification

Production build, TypeScript, static/runtime audits and all 12 unit tests passed. ESLint has no errors and four existing admin image warnings. Targeted iPhone-sized WebKit checks passed: there is no gallery playback button, automatic image advancement still works, incoming photos are loaded before switching, and live Reduce Motion stops playback. The three-slide limit remains.

## 2.10.10 verification

Production build, TypeScript, static/runtime audits and all 12 unit tests passed; ESLint has no errors and four existing admin image warnings. Inspected the hero/About join at 390px and 1280px widths. Both sections now have transparent backgrounds above one shared gradient; their adjacent edges coincide exactly and neither layout overflows horizontally. Adjacent screenshot rows across the join differ by at most 2 (mobile) / 3 (desktop) levels per 8-bit colour channel, consistent with a smooth gradient rather than a section colour reset. Previous mobile Event Info spacing and motion features remain included. No database or authentication code changed.

## 2.10.9 verification

Production build, TypeScript, static/runtime audits and all 12 unit tests passed. ESLint has no errors and four existing admin image warnings. Browser layout checks at 360px and 390px confirmed each Event Info card is now approximately 189px high (previous minimum 270px), with 24px of bottom padding and 14px above the heading. At 1280px the original desktop minimum height and heading spacing remain. Inspected the updated mobile screenshot. This change is scoped to two CSS files plus release metadata/documentation; no database or authentication code changed.

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

Clean production build and explicit typecheck passed. Lint passed with four pre-existing image warnings; static architecture, runtime boundaries and release configuration checks passed. Twelve unit tests passed, including password salt/verification/input limits and account session invalidation. Seven isolated SQL tests passed and three real PostgreSQL concurrency/rollback cases remain skipped locally. Built-app HTTP/form checks passed for first-use account table initialization, account creation, normalized duplicate email rejection, wrong/new login, additional-admin content save, direct non-owner management rejection, password reset and old-password/session rejection, disabling, re-enabling without session revival, and existing homepage/draft/publish/contact/media/login/OG flows. No browser visual/iPhone checks were executed; browser binaries are unavailable. A local Turbopack persistence-cache panic cleared on a clean rebuild, as in the prior release.

## 2.10.6 — Multiple admin logins

The owner sees an Admins section in the single-page editor. Add an email/password account, reset a password, disable or re-enable access. The existing Vercel-configured login stays the owner and cannot be modified through these forms. Added admins have full content editing access but cannot manage admin accounts. All account actions authorize the owner on the server, enforce the existing preview write policy, normalize emails, validate passwords (15–256 characters), and store unique salted scrypt hashes (N=32768/r=8/p=3) rather than plaintext. Hashes/session-binding data are never selected for UI or written to audit logs.

Database account sessions use the same secure cookie/8-hour duration, with signatures bound to the stored password hash and session version. Every protected request checks the account; password reset, disable and enable invalidate prior sessions. Re-enabling requires a fresh login. Login throttling runs before expensive password hashing. Credentials are rechecked against the account snapshot used to issue the session, closing password-reset races. Account creation/change and safe audit entries commit in one transaction.

New additive migration: 0004_admin_accounts.sql. For a simple first use, an authenticated owner Add admin action can initialize only this security table, under the same advisory lock and with identical DDL as the migration. It does not apply other migrations or modify the migration ledger. Run the normal migration workflow to record 0004; it remains safe after first-use setup. A restricted DB role without CREATE permission requires an operator to apply 0004 before adding accounts. Existing content/audit tables and earlier migrations remain prerequisites. No production deployment or data changes have been performed.

Password parameter source: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

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

## 2.10.7 verification

Passed: production build, TypeScript, 12 unit tests, static architecture audit, runtime-boundary audit and release configuration validation. ESLint completed with no errors and four existing next/no-img-element warnings. No database change; SQL checks were not needed. Physical iPhone/Safari toolbar tint and browser interaction checks were not available in this environment; follow APPLY_CHANGES.md for device checks. Reviewed the changed React components for hook dependencies, accessibility, hydration and render behaviour; no new interaction or fetching was introduced.
