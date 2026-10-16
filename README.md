## 2.10.6 — Multiple admin logins

## 2.10.7 — Black browser canvas

The viewport theme colour and html/body canvas stay #000000 during initial load, splash handoff, repeat visits, scrolling and admin navigation. Removed DocumentCanvasTone and its scroll sampling/conditional footer underlay. Visible page section colours and layout are unchanged. Safari controls its final native toolbar appearance.

The owner sees an Admins section in the single-page editor. Add an email/password account, reset a password, disable or re-enable access. The existing Vercel-configured login stays the owner and cannot be modified through these forms. Added admins have full content editing access but cannot manage admin accounts. All account actions authorize the owner on the server, enforce the existing preview write policy, normalize emails, validate passwords (15–256 characters), and store unique salted scrypt hashes (N=32768/r=8/p=3) rather than plaintext. Hashes/session-binding data are never selected for UI or written to audit logs.

Database account sessions use the same secure cookie/8-hour duration, with signatures bound to the stored password hash and session version. Every protected request checks the account; password reset, disable and enable invalidate prior sessions. Re-enabling requires a fresh login. Login throttling runs before expensive password hashing. Credentials are rechecked against the account snapshot used to issue the session, closing password-reset races. Account creation/change and safe audit entries commit in one transaction.

New additive migration: 0004_admin_accounts.sql. For a simple first use, an authenticated owner Add admin action can initialize only this security table, under the same advisory lock and with identical DDL as the migration. It does not apply other migrations or modify the migration ledger. Run the normal migration workflow to record 0004; it remains safe after first-use setup. A restricted DB role without CREATE permission requires an operator to apply 0004 before adding accounts. Existing content/audit tables and earlier migrations remain prerequisites. No production deployment or data changes have been performed.

Password parameter source: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

## 2.10.6 — Simple single-page content editor

Admin now opens a compact, mobile-oriented list of expandable sections. Homepage copy, artists, gallery, programme, tickets, FAQs and contact/information pages have inline forms. Save returns to the edited section with confirmation. New collection entries save as drafts and have an explicit Publish button. Published record saves retain publication. Status actions and revision history are in More options. Reordering locks the collection and atomically writes changed positions, recovery snapshots and audit entries; tied positions are normalized. Contact and legal page editing uses labelled fields instead of JSON.

Homepage copy is a validated `page` record with stable ID `page-home` and no slug. Existing databases need no new SQL type or migration for it. Until this record is first saved/published, the existing canonical homepage copy renders. Its first save uses the standard authenticated atomic writer and creates a published record; existing homepage edits use strict versions. Database-mode public reads consume published homepage copy and page cache invalidation. Local mode remains canonical/read-only. Other event date/location details, fixed ticket section copy and navigation remain code/config managed. Images use existing local media paths; uploads are not introduced.


## 2.10.6 — Frontend editing view

The admin landing page renders the shared public homepage with section controls and direct record edit links. Gallery controls follow the current slide; FAQs and programme filters remain interactive. Navigation uses the public paper colour and typography. Drafts and archives remain available in collection editors, while the landing preview shows published content. Homepage hero/about/mission/event/newsletter copy remains code-managed; this release does not add database fields for that copy. Save, publication, authorization, revisions and concurrency checks are unchanged.
# Shams for Humanity — 2.10.6
Admin login now distinguishes storage/setup errors from genuine attempt limits and can initialize only missing login-counter storage after configured credentials verify.

A Next.js festival website with a single-administrator PostgreSQL content studio. This handover candidate corrects the deployed 2.10.0 media-validation regression and extends the original 2.9.4 code, preserves its visual system and relocates implementation into feature domains.

**Start with [APPLY_CHANGES.md](APPLY_CHANGES.md) when applying the ZIP. Remove the old root `app/` directory; Next.js otherwise ignores `src/app`.**

Use Node 24 and `npm ci`. Copy `.env.example` to a local environment file, set only development credentials, then `npm run dev`. Public content defaults to the checked-in local baseline. Database mode is selected explicitly with `CONTENT_SOURCE=database`; it requires migrated PostgreSQL and reviewed published records. Database content does not control event dates, home copy, navigation or deployment integrations: these remain checked-in configuration.

Admin requires ADMIN_EMAIL, ADMIN_PASSWORD and a random ADMIN_SESSION_SECRET of at least 32 characters. Configure DATABASE_URL, run `npm run db:migrate`, then `npm run db:verify`. CLI initial seeding refuses a populated database; the authenticated studio Seed button inserts missing records without overwriting edits. Do not refresh production from the baseline. Preview content writes are disabled unless an isolated database is provisioned and ALLOW_PREVIEW_DATABASE_WRITES=true.

Validation: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`; install browsers with `npx playwright install --with-deps chromium webkit`, then `npm run test:e2e`. Database regression tests require an isolated loopback database named shams_test and DATABASE_TEST_URL; run `npm run test:db`. `node scripts/test-db-local.mjs` offers a partial PGlite check, not concurrency/rollback certification. `npm run verify` runs the release and browser gates.

See [HANDOVER_REVIEW.md](HANDOVER_REVIEW.md) for findings, evidence, remaining gates and sources; [architecture](docs/architecture.md), [testing](docs/testing.md), [workflow](docs/development-workflow.md), [handover plan](docs/plans/handover.md), and [decisions](docs/decisions/001-handover.md). Earlier release reports are historical and do not certify this candidate.
