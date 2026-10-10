## 2.10.6 — Multiple admin logins

The owner sees an Admins section in the single-page editor. Add an email/password account, reset a password, disable or re-enable access. The existing Vercel-configured login stays the owner and cannot be modified through these forms. Added admins have full content editing access but cannot manage admin accounts. All account actions authorize the owner on the server, enforce the existing preview write policy, normalize emails, validate passwords (15–256 characters), and store unique salted scrypt hashes (N=32768/r=8/p=3) rather than plaintext. Hashes/session-binding data are never selected for UI or written to audit logs.

Database account sessions use the same secure cookie/8-hour duration, with signatures bound to the stored password hash and session version. Every protected request checks the account; password reset, disable and enable invalidate prior sessions. Re-enabling requires a fresh login. Login throttling runs before expensive password hashing. Credentials are rechecked against the account snapshot used to issue the session, closing password-reset races. Account creation/change and safe audit entries commit in one transaction.

New additive migration: 0004_admin_accounts.sql. For a simple first use, an authenticated owner Add admin action can initialize only this security table, under the same advisory lock and with identical DDL as the migration. It does not apply other migrations or modify the migration ledger. Run the normal migration workflow to record 0004; it remains safe after first-use setup. A restricted DB role without CREATE permission requires an operator to apply 0004 before adding accounts. Existing content/audit tables and earlier migrations remain prerequisites. No production deployment or data changes have been performed.

Password parameter source: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

## 2.10.5 — Simple single-page content editor

Admin now opens a compact, mobile-oriented list of expandable sections. Homepage copy, artists, gallery, programme, tickets, FAQs and contact/information pages have inline forms. Save returns to the edited section with confirmation. New collection entries save as drafts and have an explicit Publish button. Published record saves retain publication. Status actions and revision history are in More options. Reordering locks the collection and atomically writes changed positions, recovery snapshots and audit entries; tied positions are normalized. Contact and legal page editing uses labelled fields instead of JSON.

Homepage copy is a validated `page` record with stable ID `page-home` and no slug. Existing databases need no new SQL type or migration for it. Until this record is first saved/published, the existing canonical homepage copy renders. Its first save uses the standard authenticated atomic writer and creates a published record; existing homepage edits use strict versions. Database-mode public reads consume published homepage copy and page cache invalidation. Local mode remains canonical/read-only. Other event date/location details, fixed ticket section copy and navigation remain code/config managed. Images use existing local media paths; uploads are not introduced.


## 2.10.4 — Frontend editing view

The admin landing page renders the shared public homepage with section controls and direct record edit links. Gallery controls follow the current slide; FAQs and programme filters remain interactive. Navigation uses the public paper colour and typography. Drafts and archives remain available in collection editors, while the landing preview shows published content. Homepage hero/about/mission/event/newsletter copy remains code-managed; this release does not add database fields for that copy. Save, publication, authorization, revisions and concurrency checks are unchanged.
# Changelog

## 2.10.3 — Admin login storage recovery

- Separates genuine login limits from unavailable security storage/configuration; database failures no longer tell users to wait 15 minutes.
- After credentials verify, a missing login-counter table can be provisioned transactionally under the migration lock. This touches only login security storage, not editorial records or the migration ledger. Other database/permission failures remain fail-closed.
- Uses typed counter RETURNING rows and rejects malformed responses as storage errors, instead of incorrectly blocking every login.
- Adds Vercel's overwritten forwarded-IP header fallback and built-server form-post tests for wrong credentials, missing-table recovery, session creation and actual attempt limiting.


## 2.10.2 — Custom record media fallback

- Corrects the remaining public-read failure when neither saved media nor a matching canonical asset is available. Such records now render a bundled neutral star placeholder with truthful alternative text; their content/publication/database values are preserved.
- Adds database-mode HTTP coverage for a custom artist without a canonical entry, plus unit checks for missing/invalid fallbacks.
- Advances artist/gallery cache generations.


## 2.10.1 — Production media compatibility fix

- Corrects the strict image-validation regression observed after deploying 2.10.0: existing unsupported artist/gallery media renders using the same record’s canonical local asset, retaining every editorial field and leaving stored data unchanged. Saves still reject unsupported media; records without a valid matching fallback still fail explicitly.
- Fixes CLI JSONB parameter encoding with explicit tx.json wrappers for content, revision and audit objects.
- Bumps artist/gallery cache generations and adds a legacy-media regression test.
- Renders the social-preview star with the existing icon SVG path, avoiding the failed external dynamic glyph download.


## 2.10.0 — Handover candidate

- Relocates baseline code into src/app and feature domains; adds required handover documentation.
- Adds reproducible lockfile, Node 24, patched Next/Drizzle, lint/unit/SQL quality gates.
- Hardens sessions, shared login throttle and default read-only previews.
- Makes save/restore revisions and audit writes atomic with locked version checks; missing-only studio seed preserves edits.
- Adds migration 0003, migration serialization, maintenance row locks and refreshed database verification.
- Uses published data for sitemap/event structured data, checks draft-preview identity, removes archived-page fallback and immediately expires publication cache tags.
- Adds bounded public cache revalidation, accurate studio database counts, safe action feedback, URL/media validation and gallery pause controls.
- Retains existing visual design and public routes. Runtime audit clean; development advisories and real PostgreSQL/browser/production gates remain documented.



## v2.9.4 — Canonical Database Shape Completion

- Completes only missing fields in older Neon JSON payloads from the current checked-in canonical baseline before validation.
- Existing database/editorial values always win; missing defaults no longer crash public rendering.
- Extends Database — Repair Records to permanently backfill missing canonical fields as well as authoritative metadata, with revision and audit protection.
- Extends Database — Verify to detect missing canonical top-level fields.
- Forces database-backed public routes to render at runtime so a live database inconsistency cannot fail the Vercel production build during prerender.
- Bumps public-content cache generations to prevent stale invalid records from surviving the repair.

## 2.9.4 — Database record normalization and repair

- Made database columns authoritative for record metadata at the public read boundary.
- Normalizes legacy/malformed JSON metadata before canonical validation.
- Normalizes database records when opened in admin and older revision snapshots when restored.
- Added manual **Database — Repair Records** GitHub Action for existing Neon data.
- Repair preserves editorial fields and status while recording revision snapshots and audit entries.
- Extended database verification to fail on JSON/database metadata drift.

## 2.9.2 — Seed publication alignment

- Baseline seed records now publish to match the currently visible local public site.
- Added safe status-only GitHub publication alignment for databases seeded before v2.9.2.
- Alignment preserves record content, drafts and archives, while recording revisions and audit entries.
- Added baseline publication verification mode.


## 2.9.1 — GitHub Actions database administration

- Added manual Migrate, Verify, and Seed database workflows for iPad-first operation.
- Added a deterministic migration registry with SHA-256 checksum protection.
- Added read-only schema, index, and migration verification.
- Added safe initial seeding with explicit opt-in before refreshing an existing database.
- Added a versioned canonical seed snapshot and GitHub actor attribution in the audit log.

## 2.9.0 — Revision history and rollback governance

- Added append-only content revision snapshots.
- Added global and record-specific revision history workspaces.
- Added stale-safe, validated one-click rollback.
- Preserves the current state before restoring an older revision.
- Revalidates public content and records audit attribution after restore.

## 2.8.0 — Gallery admin and publishing integration

- Added a dedicated admin gallery workspace with ordering, status, image path, alt text, and previews.
- Added gallery records to database seeding, validation, audit logging, Draft Mode, and targeted cache invalidation.
- Public database mode can now power the homepage gallery with published records.
- Extended the media QA workspace to include gallery assets.
- Preserved the approved public gallery animation and stable rendering architecture.


## 2.7.0 — Event atmosphere gallery

- Added a full-viewport gallery directly before the Artists section.
- Added all 14 supplied Day Tripping photographs as optimized WebP assets.
- Added smooth opacity-only crossfades and a centered yellow Agilera “Shams” overlay.
- Added viewport-aware playback, background-tab pausing, and reduced-motion fallback.
- Extended the typed content repository and validation for gallery records.

## 2.6.1

- Added a new lower-section-only scroll reveal controller.
- Kept Hero and About permanently visible.
- Disabled reveal on iOS WebKit and under reduced motion.
- Prevented hydration blinking by making concealment opt-in after initial viewport classification.
- Preserved the stable no-scroll-guard and compositor-safe gradient architecture.

## 2.6.0
- Added structured type-specific admin forms.
- Added artist media metadata previews and a media QA workspace.
- Preserved canonical validation and publishing governance.


## 2.5.0 — Stable visual restoration

- Restored the approved stronger gradient presence from the stable v2.4.9 baseline.
- Set gradient size to 1.5 and strength to 1.2.
- Replaced runtime scale enlargement with direct gradient-layer geometry and wash overscan.
- Kept startup scroll mutation, hero blur, and splash-entry transforms removed.
- Preserved the stable opacity-only splash handoff and all public/admin architecture.

## 2.4.9 — Diagnostic initial-paint isolation

- Removed the startup scroll guard and all initial-load scroll mutation.
- Temporarily restored gradient size to 1 and removed global transform enlargement.
- Disabled hero blur.
- Simplified splash animation to a single opacity dissolve.

# Changelog

## 2.9.1 — GitHub Actions database administration

- Added manual Migrate, Verify, and Seed database workflows for iPad-first operation.
- Added a deterministic migration registry with SHA-256 checksum protection.
- Added read-only schema, index, and migration verification.
- Added safe initial seeding with explicit opt-in before refreshing an existing database.
- Added a versioned canonical seed snapshot and GitHub actor attribution in the audit log.

## 2.4.6 — Deterministic startup scroll guard

- Installs a pre-hydration head script that pins direct loads and reloads to `scrollY = 0` until startup is complete.
- Preserves native browser back/forward restoration and direct hash navigation.
- Prevents Safari's delayed native scroll restoration from racing the splash handoff.
- Disables scroll anchoring only while the startup guard is active.

## 2.4.5 — Production runtime-boundary hardening

- Moved database public reads into a dedicated server-only adapter.
- Lazy-loads PostgreSQL and Drizzle only when database content mode is selected.
- Added explicit Node runtimes for public database pages, admin, and Draft Mode preview routes.
- Externalized the Node-only `postgres` driver from Next.js server bundles.
- Added runtime-boundary audits to prebuild and release verification.
- Added conditional Vercel `npm ci` support once a lockfile is committed.
- Preserved all approved public, Safari, transition, preview, and admin behavior.

## 2.4.1 — Server/client content-boundary fix

- Removed the server-only public repository from the shared content barrel imported by Client Components.
- Added an explicit `src/features/content/server.ts` entry for database-backed public content.
- Prevented `next/headers`, Drizzle, and the Node PostgreSQL driver from entering client and Edge bundles.
- Consolidated cache tags and added regression audit guards.
- Preserved the v2.4.0 public-content source switch, Draft Mode preview, and targeted revalidation.

## 2.3.0 — Admin publishing and governance workflow

- Added explicit save, publish, draft, and archive actions.
- Added protected record previews and a database audit-log workspace.
- Added stale-edit and duplicate-slug protection.
- Fixed FAQ and information-page admin routing.
- Preserved the public frontend and verification foundation.

## 2.2.0 — Verification and regression foundation

- Added Playwright smoke projects for Chromium and mobile WebKit.
- Added first/repeat splash lifecycle tests.
- Added menu, artist navigation, legal footer return, programme, reduced-motion, contact, and admin-route smoke coverage.
- Added an opt-in visual regression harness for approved public surfaces.
- Added a unified release verification command.
- Added a GitHub Actions quality gate with traces and report artifacts.
- Added deployment, preview verification, real-device, and rollback documentation.
- Preserved all approved visual, Safari, transition, content, and admin systems.

## 2.1.9 — Constitution alignment phase one

- Added type-specific validation before admin database writes.
- Constrained admin status values to canonical content statuses.
- Reused one safe focus-restoration helper for same-route and cross-route navigation.
- Corrected gradient strength above 1 using bounded opacity plus saturation/contrast.
- Derived seed audit metadata from the package version.
- Removed the unused previous splash JPEG.
- Pinned Node 22.
- Added a documented regression QA matrix.
- Corrected release-documentation drift.

## 2.1.8 — Splash refresh and gradient update

- Replaced the splash artwork.
- Set global gradient size to 1.5 and strength to 1.2.
- Updated the splash session key for the new artwork.

## 2.1.7 — Permanent footer canvas fix

- Replaced exact-document-bottom-only detection with visual-viewport footer-contact detection.
- Added a conditional non-layout black underlay at footer contact.
