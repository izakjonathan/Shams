# Three-day handover plan
## Day 1 — Owner and staging
Apply candidate to a branch; get green quality CI including real PostgreSQL. Provision isolated Neon preview branch and separate credentials/session secret. Back up production and rehearse restoring the backup. Confirm provider plan retention/region/connection budget and repository/Vercel/Neon ownership. Complete legacy-data/schema verification.

## Day 2 — Content and end-to-end acceptance
Remove test FAQs through the studio; approve event date (currently 6 September 2026, already past on review date), venue, artists, programme, tickets and information pages. Replace `.example` contact addresses and organizer/TBD text. Decide whether tickets/newsletter are in scope and supply real providers. Run authenticated database-mode acceptance and Chromium/iPhone WebKit tests, keyboard/reduced-motion checks, gallery pause and visual review. Record failures rather than signing off by deadline alone.

## Day 3 — Controlled release and transfer
On green checks and accepted content, apply migration, verify, deploy the exact reviewed commit, verify public access outside Vercel login and complete authenticated save/publish/archive/restore smoke. Confirm canonical domain/indexing settings, monitor errors and teach the owner the editorial workflow and backup/rollback steps. Rotate/admin-transfer credentials, document support contacts and sign acceptance.

Acceptance requires: real SQL concurrency/rollback success; database backup/restore evidence; separated preview data; approved content; appropriate external integrations; mobile/browser accessibility evidence; successful production publishing/cache verification; owner access and rollback training. The ZIP alone does not satisfy these operational gates.
