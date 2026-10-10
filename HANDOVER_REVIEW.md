# 2.10.2 correction — custom media without baseline

Baseline: main commit `39668f13d4ba7699e7edab7f44ae4446609984e7`, deployment `dpl_Dw37qdd7Rj8cY7bP4hca4KytH79A` (2.10.1). Current runtime logs show `The image has no supported local asset or canonical fallback.` Thus 2.10.1 still failed when neither media source was supported. Exact production record IDs/values remain unverified due database access limits.

2.10.2 retains valid editorial media first, then a matching approved canonical asset, then a bundled neutral star placeholder. It never substitutes another artist's portrait. Placeholder alternative text accurately announces that the photograph is unavailable. Existing text/status/order and stored bytes remain unchanged; unsupported uploaded/external media still requires editorial correction before strict studio save. Artist/gallery cache generations are advanced. This corrects the previous overly strict failure path rather than relaxing the external-image policy.

A custom-artist fixture with no canonical entry now exercises the built database-mode homepage, its own artist route and the placeholder, in addition to the known baseline record and sitemap/social preview. The isolated HTTP fixture uses DATABASE_POOL_MAX=1 because PGlite cannot reliably multiplex the application’s concurrent protocol connections. The application exposes that bounded setting (1–10); Production retains the default pool of 3 unless explicitly configured. This addresses an emulation protocol limitation, not the live image failure.

Verification: eight unit tests, types, static/runtime audits, lint (four existing warnings) and production build passed. Database-mode HTTP checks passed homepage, known artist, custom artist with no canonical entry, sitemap and PNG social preview. The earlier review and checks below are historical; real PostgreSQL concurrency, browser/mobile and production acceptance remain required. No deployment or production data change was performed by this correction.

---

# 2.10.1 correction — 10 October 2026

Production advanced to commit `5aabe8bc00be389f6bb4a12bfab6f3b249fc3620`, deployment `dpl_EGVa69DTyqCifPUorPXGjiuUFLkN`, after the 2.10.0 ZIP was supplied. The runtime logs now confirm `/` throws `[admin content] artist.image must be a local image path.` The new strict validator introduced a compatibility regression against existing database media values. Exact saved paths could not be inspected because direct database DNS access remained unavailable; do not claim a specific legacy path format was observed.

2.10.1 fixes the public read boundary: valid local media still wins; unsupported legacy media on a known canonical artist/gallery record uses that same record's approved local image. Editorial text, status, order and all stored database bytes remain unchanged. The studio still shows the saved value and strict save validation prevents reintroducing unsupported media. Unknown records without a supported local image/canonical fallback still fail explicitly; this is not a blanket local-content fallback. A warning identifies records requiring image-path review. Artist/gallery cache generations are bumped.

The isolated database-mode reproduction also exposed a maintenance JSON binding defect: raw PostgreSQL scripts passed pre-stringified JSON into a JSONB parameter, which produced a JSON string rather than an object. Seed, repair and alignment now use the driver’s explicit `tx.json` parameter wrapper for data, snapshots and audit payloads. This fixes the typed JSONB write path instead of weakening the object constraint.

A separate `/opengraph-image` log showed failed dynamic font download for the star glyph. The existing icon path now renders as inline SVG, avoiding external glyph fetching. This change preserves the established star identity.

A regression test covers unsupported string/object/null legacy paths, preserved editorial values, valid current local and static-import media, unchanged stored input and failure without an approved fallback. The updated candidate requires deployment by the owner; this review has not deployed or edited production data. The handover gates in the original review below still apply. Baseline for this correction is deployed 2.10.0; earlier 2.9.4 audit details remain historical.

Verification for 2.10.1: eight unit tests, types, lint/static/runtime/release checks and production build passed. SQL subset: six passed, three skipped; the CLI seed/repair/alignment test now passes. Database-mode HTTP regression using legacy media values passed homepage, artist, sitemap and editorial-text preservation. Social preview returned a valid PNG without the dynamic-glyph font error. Chromium/WebKit and the actual production database remain unverified. This package is not yet deployed.

---

# Shams frontend/backend handover review — candidate 2.10.0

Review date: 10 October 2026. **The revised code is buildable and prepared for owner review; final production handover is conditional on the explicit gates below.** No commit, push, deployment, production migration, login attempt or editorial write was made by this review.

## Baseline and scope

| Item | Confirmed baseline |
|---|---|
| Vercel project | shams — prj_N18qYOfCHhbvFHs0Taqj5enh1ovd |
| Repository | https://github.com/izakjonathan/Shams |
| Branch/commit | main — a86a8912f36978d200cb1d331a4765b3307d99f0 |
| Baseline release | 2.9.4; commit message “Replace project with latest ZIP build” |
| Production deployment | dpl_Dr1jbU9Cxi1Yt7sLNJnLj7hyRFPS; READY; same SHA |
| Public alias inspected | https://shams-nine-rho.vercel.app |
| Vercel runtime/region | Node 24.x; iad1 |
| Delivered candidate | 2.10.0; not deployed |

The supplied project-structure ZIP was read and mapped to the implementation. Review covered the checked-in source, package/build configuration, Vercel project/deployment/environment scopes, live public frontend, migrations and database administration workflows, auth/session/preview boundaries, content validation/publication/cache/history, accessibility/motion implementation and tests. Database credentials were not included in any deliverable. Direct production SQL read access failed at DNS resolution, so live row counts, applied migration ledger, constraints, grants, backups and recovery status are **unverified**, not inferred from a successful page render.

## Priority findings and disposition

| Priority | Finding and consequence | Candidate action / remaining requirement |
|---|---|---|
| High | Preview and Production DATABASE_URL share a target. Preview writes can alter live content. | Preview content writes blocked by default; isolate a Neon branch and credentials before enabling. Login throttle still writes storage, so this is not full isolation. |
| High | Existing save/restore flow could separate content, recovery history and audit operations; competing edits risk stale writes. | One transaction, FOR UPDATE, strict expected version, validated snapshot and atomic audit. True concurrency and injected failure tests require real PostgreSQL before sign-off. |
| High | Baseline dependency audit included critical/high runtime advisories. | Next 16.4.0, Drizzle ORM 0.45.4 and lockfile; runtime audit now zero. Full development audit still has 9 advisory entries. |
| High | Production currently publishes test FAQ copy. | Confirmed live; cleanup must be done editorially, preserving chosen content, not by reseeding. |
| High | No verified production backup/restore/schema evidence. | Owner must supply backup/restore rehearsal and run read-only db:verify on the target after migration rehearsal. |
| Medium | Sessions needed stronger parsing, expiry/identity and credential-rotation handling. | Fixed-length credential/signature comparisons, exact token structure, 8-hour expiry, configured identity and rotation invalidation; secure HttpOnly SameSite cookie retained. |
| Medium | Login protection needed shared storage across serverless instances. | PostgreSQL-backed HMAC IP counters: 10 attempts / 15-minute window, bounded cleanup, fail closed on production storage error. Distributed attacks/MFA remain outside this single-admin design. |
| Medium | Server actions are externally reachable authorization boundaries. | Existing authorization retained in actions and preview handlers; server-owned original records replace hidden originalData; validation and safe inline errors added. |
| Medium | Mutation cache tags using stale-while-revalidate can show previous publication state. | updateTag expires authenticated mutation tags immediately; public TTL added for maintenance recovery. CLI operations still require redeploy/cache verification. |
| Medium | Archived information pages could fall back into visibility; static metadata could advertise unpublished artists/tickets. | Database page missing result now 404; published-only sitemap and runtime event JSON-LD. Explicit local-fallback still can surface baseline content and must be understood. |
| Medium | Draft Mode cookie alone should not expose drafts after session expiry. | Draft reads and banner require a valid admin session; logout clears both session and preview. Test live expired-session/indexing behaviour before sign-off. |
| Medium | CLI repair/alignment originally selected data before transaction, risking stale maintenance snapshots. | Selection and updates moved into one transaction with row locks; bounded timeouts. Real PostgreSQL maintenance regression test added, not locally certified. |
| Medium | Migrations needed race protection/checksum guarantees; content columns lacked integrity checks. | Advisory transaction lock, atomic ledger/DDL, new additive 0003 checks/index/throttle table. Original 0001/0002 bytes preserved. NOT VALID legacy rows require audit. |
| Medium | Baseline studio seeding could overwrite reviewed content. | Studio inserts missing records only. CLI initial seed refuses existing data; explicit refresh captures revisions but remains intentionally destructive and unsuitable for routine deployment. |
| Medium | No committed lockfile despite CI requiring one; Node engine mismatch. | npm lockfile supplied, Node 24 aligned with Vercel, workflows use npm ci. |
| Medium | Studio cards counted local baseline rather than actual database content. | Aggregated database counts now shown; missing DB gives explicit read-only local counts. |
| Medium | Unsafe URL/media/nested data or duplicated metadata can reach rendering. | HTTPS external links, local image path constraints, integer/range checks, nested statuses/IDs, canonical validation and authoritative column metadata enforced. |
| Medium | Moving source without removing root app silently runs old code. | Full source archive plus deletion manifest and prominent application instructions. |
| Medium | Autoplay gallery needed an accessible stop control. | Added pause/resume control and focus/touch treatment; reduced-motion/background/viewport behaviour retained. Mobile/keyboard validation remains required. |
| Medium | Tickets/newsletter unavailable, organizer/venue/contact/legal copy unfinished. | Preserve honest disabled UI; owner must choose providers, approve copy and configure public settings before launch. No provider backend invented. |
| Low | Four unoptimized-image ESLint warnings in admin previews. | Retained as non-blocking warnings; no lint errors. Do not claim zero-warning lint. |
| Low | Existing OG Edge runtime deprecated by updated Next. | Retained for baseline visual/runtime compatibility; schedule a tested Node migration. |
| Low | Earlier README/reports referenced old versions and commands. | New required docs, decisions and three-day plan; old reports marked historical. |

## Backend analysis

### Data model and publication invariants
The six editable domains are artists, gallery, programme, tickets, FAQs and information/contact pages. `content_records` stores stable IDs, type, optional unique slug, status, sort order, JSON data and timestamps. `content_revisions` stores recoverable content snapshots and `audit_logs` records actor/action changes. New `admin_login_attempts` is operational security state. The additive migration checks allowed type/status and JSON object shape and adds a partial published lookup index. Application validation remains necessary: SQL checks do not prove every JSON field, asset or relationship is valid.

Column metadata is authoritative and older missing JSON fields are completed from canonical content without overwriting existing editorial values. This compatibility layer is not permission to silently approve incomplete content: invalid existing values still fail validation. Legacy schema checks are NOT VALID specifically to preserve data; run db:verify, investigate failures and validate constraints after cleanup. Application snapshots preserve the exact prior editable payload/metadata rather than replacing it with completed defaults. They are not a full database backup and do not restore grants, tables or every timestamp.

A public record is selected by its top-level published status, ordered deterministically. Draft/archive sections within published pages are excluded; canonical placeholder sections remain visible as in the baseline. Draft preview bypasses the public cache but requires both the Draft Mode cookie and current administrator session. The admin list can contain drafts/archives. Stable ID/type cannot change in normal editing. Explicit CLI refresh remains an operator maintenance escape hatch and must not be used as deployment initialization on an existing database.

### Transaction correctness and recovery
Save reads the row under FOR UPDATE, requires the editor's expected updatedAt, validates the submitted content, inserts the original revision, updates the record and writes its audit log within a single transaction. Missing version cannot bypass stale protection. New creates use inserts so a race cannot silently overwrite an existing stable ID. The database handles slug uniqueness. Timestamps advance even for closely spaced saves; continuous publication retains the first publication timestamp. Unpublishing clears publishedAt; republishing assigns a new one.

Restore verifies revision metadata and current version, locks the current row, records the state being replaced and writes restored content and audit atomically. The UI exposes safe validation/concurrency feedback and pending status. Internal SQL/connection details are not echoed to the editor. Audit/history reads are bounded; content lists are small-site, unpaginated reads. Establish expected content volume before scaling this into a general-purpose CMS. There are no delete/upload/user-management APIs in this scoped studio; archival is the public-removal mechanism.

Migration runner serializes concurrent executions with a transaction-scoped advisory lock that is appropriate for transaction pooling; checksum mismatch aborts instead of rewriting history. New migrations and their ledger entries commit together. CLI seed uses a table lock and rechecks emptiness inside the transaction. Repair and publication alignment select locked rows in the same transaction. Alignment promotes only placeholders; intentional drafts/archives are preserved. The workflow's optional “all baseline published” verification was removed because it contradicted those intentional states. None of these operational paths has been run on production by this review.

### Authentication and threat boundaries
Credentials remain an environment-managed single administrator, not a hosted identity provider. The password is not stored in the content database. Credential comparison hashes both strings to fixed-length digests before timingSafeEqual; this is a comparison safeguard, not password-storage hashing. Session tokens are HMAC signed using configuration-bound inputs, size/segment/identity/expiry checked, with an 8-hour maximum age. Email/password/secret rotation invalidates old tokens. Cookie flags are HttpOnly, Secure in production and SameSite=Lax. Every content action resolves the admin identity before service mutation. Administrative route/layout protection is defense in depth, not a substitute for action authorization.

Shared throttling uses a keyed hash of the trusted Vercel forwarded address rather than storing raw IPs. The first ten attempts in a 15-minute window are allowed; later attempts are denied, including correct credentials until reset. Production without available database throttle storage fails closed. Preview writes being disabled does not disable this operational security write. This limits ordinary per-address brute force, but does not provide account/global distributed rate limits, MFA, per-user permissions, personal accounts, automatic security alerts or per-session revocation. Agree those requirements with the receiving owner; if the handover requires multiple editors, this scope is insufficient.

Submitted hidden JSON is not trusted as the original record. Type/status/slug/IDs/order, URLs, media and structured fields are validated at the server boundary. SQL values are parameterized and database identifiers are fixed in normal queries. Rendering uses React text escaping rather than arbitrary editorial HTML. Preview destinations must remain same-origin. Next's normal Server Action origin protection is retained; no broad allowedOrigins bypass introduced. Keep deployment credentials and connection URLs out of browser bundles, logs, screenshots and commit packages.

### Caching, failure and connection handling
Published reads are cached per domain; normal editing uses immediate updateTag expiration. A 60-second request-driven revalidation interval prevents indefinite dependence on CLI cache invalidation, but can serve a stale response during background refresh. For urgent unpublication performed through CLI, redeploy/verify cache behaviour rather than promising a hard TTL purge. Sitemap explicitly uses published artists and does not consult Draft Mode. Homepage event JSON-LD consumes the same current content lists. Root site branding/date/home copy and OG content remain checked-in; these are not yet database-editable.

CONTENT_SOURCE explicitly selects local or database. CONTENT_DATABASE_FAILURE=error fails visibly; local-fallback can preserve availability but display old checked-in content, including material unpublished in the database. This is an explicit operational tradeoff. Query failures log a generic message without leaking connection details. A malformed published record can still fail that domain/page: prevention through validation and a read-only legacy audit are essential. Cached reads can mask a database outage temporarily; do not infer database health from the homepage alone.

Postgres.js uses a reused process-local pool, max 3 connections, prepared statements disabled and bounded timeouts. This is compatible with the existing adapter and does not imply only three connections across all Vercel instances. Confirm Neon pooled URL, connection budget, actual database region versus Vercel iad1 and cold-start behaviour with the provider. Vercel's attachDatabasePool documentation currently lists supported adapters; it was not applied blindly to an unsupported existing driver. Production database ownership/role privileges, TLS/provider settings, retention, storage size and connection metrics were not verified through SQL.

### Observability, backup and operational access
The production deployment was READY at the same repository SHA. A 30-minute runtime error/fatal query returned an empty grouped result; it is a narrow observation, not a reliability certificate or a substitute for request-status/error monitoring. The initial 1-hour query was rejected by retention limits. Firewall configuration lookup returned “Seawall Config not found”; this does not prove all Vercel platform protections are absent and no custom WAF configuration was certified.

Public homepage/navigation and the information-page alias were reachable without using an admin session. Project SSO deployment protection was configured as all_except_custom_domains; explicitly retest the intended launch URL in an independent logged-out browser and agree protection rules for previews. No custom-domain ownership or production monitoring/alerts/restore plan was certified. Shared environment scopes need separation, and owner access must be checked across GitHub, Vercel and Neon independently.

Audit/revision tables are append-only in application behaviour, but the database owner can change them. They are not tamper-evident regulatory audit trails. No retention policy or scheduled cleanup for editorial history was introduced. Handover requires a provider backup with a restore rehearsal and recovery objectives, not merely revision buttons. Roll back application code separately from data; an older deployment does not undo content edits.

## Frontend and launch review

Desktop live homepage and artist navigation were inspected; the yellow/black design, serif identity, images and route curtain were retained in the code. Existing responsive viewport/motion controllers, splash behaviour, return anchors, information routes and public API paths were preserved. Client Components remain for browser state/interaction; content/auth/database logic stays on the server. Gallery now has a pause/resume button. Admin forms show pending state and accessible error feedback. No claim of full WCAG certification or cross-device visual equivalence is made without the missing browser gates.

The live page contained FAQ text including “This is a test izak”, “Test test test”, and the question “Why is this not seem” with answer “Because it’s broken”. This demonstrates database-backed editorial data reaching the public site, not necessarily a code bug. Clean these through review/publish/archive; do not refresh baseline content over all records. Event date was 6 September 2026, already past on the review date; venue/organizer and artist information still contained TBD/approval placeholders. Contact/legal information contained `.example` addresses. These require owner-approved facts and policy text.

Tickets and newsletter have explicit unavailable states until their public environment variables are set. A ticket URL is an external checkout link, not a built payment system. Newsletter is a direct external form submission, not a stored first-party subscriber service. Review consent, privacy wording, external form response/error experience and provider ownership when chosen. Do not say these flows work because the placeholder UI renders. Final canonical domain, indexing flag and social/artist destinations also require approval.

CSP retains the baseline unsafe-inline script/style allowance for splash/framework styles and JSON-LD. Object, base and frame restrictions and security headers remain. This is not strict nonce-based CSP; a separate nonce architecture change needs its own rendering/performance testing. Admin preview images produce four lint warnings. OG Edge runtime emits a deprecation warning. Neither was hidden by falsely reporting a clean log.

## Compliance with the attached structure prompt

| Requirement | Implementation/evidence |
|---|---|
| Latest confirmed working baseline | Vercel and GitHub SHA matched; baseline build run before changes |
| Inspect rather than recreate | Existing files moved and imports adjusted; typography/assets/controllers retained |
| Domain organization | src/features/admin, content and site; colocated actions/server/types/tests |
| src/app routing only | Route/layout/metadata/boundary/handler entrypoints; domain queries/transactions elsewhere |
| Shared only when reused | Cross-feature controls/icons/navigation primitives in src/components; DB and shared site primitives separate |
| Server by default | server-only auth/content/DB boundaries; browser interactions retain client components |
| Preserve public APIs/design | Existing routes/design/assets kept; only targeted validation, feedback and pause control changes |
| Safe database changes | Additive 0003, immutable existing SQL, transaction locks, revisions and tests; no production mutations |
| Required documentation | AGENTS, README, CHANGELOG, architecture/testing/workflow, decisions and handover plan included |
| Required commands | lint/typecheck/unit/build executed and passed; SQL/browser limitations stated |
| Recoverability | Baseline SHA retained, deletion manifest/application instructions, revision and deployment rollback guidance |
| Honest final delivery | Candidate/version, concrete changes, evidence and unverified gates reported |

## Validation record and limitations

Passed: release validation, static architecture, runtime boundaries, typecheck, lint (0 errors/4 warnings), seven unit tests, production build and local production HTTP smoke. HTTP checks covered nine public/login/metadata routes plus four unauthenticated admin/preview redirects and nosniff headers. Isolated PGlite checks passed migrations/idempotency, save/history/publication, missing-only seed preservation, stale restore/history and shared throttle: **5 passed, 4 skipped** in the final SQL subset. The real PostgreSQL tests remain enabled for simultaneous editing, injected audit failure rollback, SQL error/uniqueness/state protection and locked maintenance CLI preservation. Earlier emulation attempts hung on SQL error handling or closed the locked CLI connection; those are test-environment failures and do not constitute passing production evidence.

Chromium/WebKit browser download attempts failed; automated browser/mobile/visual suites were not run. CI installs both browser engines and runs functional E2E plus PostgreSQL 17 tests. Existing browser tests mainly use local mode; perform the additional authenticated database-mode acceptance in docs/testing.md. Full production backup/schema/grants/performance/restore evidence is missing because direct database DNS access was unavailable. No load test, payment/newsletter transaction, multi-user permission certification, legal-policy review or comprehensive live accessibility audit was completed.

A fresh lockfile install (`npm ci --ignore-scripts --no-audit --no-fund`) succeeded and the production build passed again afterward. ESLint 9 is deprecated upstream; it was retained because the current Next lint plugin peer ranges rejected ESLint 10. Treat the lint-tool migration as a follow-up compatibility gate, not a runtime fix.

Runtime npm audit is zero known advisories at review time. Full audit is **9 development-only entries (5 high, 4 moderate)** from braces/micromatch/fast-glob/Next ESLint and esbuild/Drizzle tooling chains. npm suggested old major tooling versions; those were not applied as blind downgrades. Do not expose development/database tooling servers. Recheck advisories before signing off, especially if organizational policy requires zero development findings.

## Final handover gates

1. Apply the full snapshot on a branch, remove old root app, review diff and run all CI, including real PostgreSQL and Chromium/WebKit. Visual snapshots need human review.
2. Provision isolated Preview data/secrets and prove preview content cannot affect Production. Establish the single-admin scope or explicitly commission managed identity/multi-editor requirements.
3. Produce a backup and restore rehearsal; verify migration/legacy data on an isolated copy, then run the approved production migration and db:verify. Do not reseed.
4. Approve live editorial content/date/venue/legal/contact/links, configure any in-scope providers and final domain/indexing. Perform authenticated save/publish/unpublish/restore and cache/indexing checks on the actual database deployment.
5. Transfer owner access, rotate admin/session credentials, document monitoring/support/backup responsibilities and rehearse rollback. Only then sign the frontend/backend handover.

A practical three-day schedule is supplied in docs/plans/handover.md. Code remediation is included; the remaining owner/provider/data/browser gates cannot honestly be replaced by a ZIP.

## Primary research used

- [Next.js data security](https://nextjs.org/docs/app/guides/data-security): Server Actions need explicit authorization and server-owned validation.
- [Next.js authentication](https://nextjs.org/docs/app/guides/authentication): keep sensitive data access/authorization at the server boundary.
- [Next.js updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag): immediate mutation expiration versus stale-while-revalidate cache behaviour.
- [PostgreSQL explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html): row locks and transaction-scoped advisory locks informed edit/migration serialization.
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) and [Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html): throttle/session lifecycle and cookie controls.
- [Vercel database pool guidance](https://vercel.com/kb/guide/efficiently-manage-database-connection-pools-with-fluid-compute): instance scaling/pool lifecycle; do not assume driver compatibility.
- [Next OG advisory GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j): patched dependencies; original fixed-content Edge OG did not match the Node/user-controlled SVG prerequisite, so exploitability was not alleged.
- [Drizzle advisory GHSA-gpj5-g38j-94v9](https://github.com/advisories/GHSA-gpj5-g38j-94v9): identifier escaping vulnerability; baseline normal query identifiers were fixed, and runtime dependency was patched.
- Development audit references: [braces GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) and [esbuild GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99).

Sources informed implementation decisions; code/test results and live observations above are the review's own evidence. This is a technical handover assessment, not a claim that external legal text or unavailable integrations have been certified.
