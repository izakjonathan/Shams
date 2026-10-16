## 2.10.6 — Multiple admin logins

## 2.10.12 — Richer opening gradients

Hero and About retain their single seamless background, now using the same fully saturated yellow centres and multi-stop soft falloff as the other paper-section glows. The palette, layout, motion, compact Event Info cards and gallery without its playback button remain. Only the opening background's colour-stop recipe changes.

## 2.10.11 — Gallery button removed

Removed the visible Pause/Resume gallery button and its unused styles. The automatic slideshow, slide count, three-image window, off-screen/hidden-tab suspension and Reduce Motion behaviour remain. Editor-link focus pauses playback until focus leaves.

## 2.10.10 — Seamless hero / About background

Hero and About now sit on one shared, static gradient surface. Their individual background layers no longer restart at the section boundary, so the yellow/paper artwork flows continuously through the join. Palette, typography, content, anchors and animations are preserved. The shared wash uses the existing gradient size/strength controls and introduces no animation or scroll listener.

## 2.10.9 — Compact mobile Event Info

Removed the 270px minimum card height below 760px, reduced heading margins to 14px above / 12px below, and kept 24px of space after the description. Cards size naturally to their content. Desktop/tablet cards retain their existing minimum height and heading spacing. Motion and the black browser canvas are unchanged.

## 2.10.8 — Mobile motion refinement

Faster splash and route transitions, smaller one-shot scroll reveals, staged menu links and CSS icon, hero title entrances, FAQ icon motion and short programme-result transitions. Gallery playback uses at most three mounted slides and follows live motion preferences/page visibility. Black browser canvas retained. Research, design choices and source links are in `docs/MOTION_REVIEW.md`.

## 2.10.7 — Black browser canvas

The viewport theme colour and html/body canvas stay #000000 during initial load, splash handoff, repeat visits, scrolling and admin navigation. Removed DocumentCanvasTone and its scroll sampling/conditional footer underlay. Visible page section colours and layout are unchanged. Safari controls its final native toolbar appearance.

The owner sees an Admins section in the single-page editor. Add an email/password account, reset a password, disable or re-enable access. The existing Vercel-configured login stays the owner and cannot be modified through these forms. Added admins have full content editing access but cannot manage admin accounts. All account actions authorize the owner on the server, enforce the existing preview write policy, normalize emails, validate passwords (15–256 characters), and store unique salted scrypt hashes (N=32768/r=8/p=3) rather than plaintext. Hashes/session-binding data are never selected for UI or written to audit logs.

Database account sessions use the same secure cookie/8-hour duration, with signatures bound to the stored password hash and session version. Every protected request checks the account; password reset, disable and enable invalidate prior sessions. Re-enabling requires a fresh login. Login throttling runs before expensive password hashing. Credentials are rechecked against the account snapshot used to issue the session, closing password-reset races. Account creation/change and safe audit entries commit in one transaction.

New additive migration: 0004_admin_accounts.sql. For a simple first use, an authenticated owner Add admin action can initialize only this security table, under the same advisory lock and with identical DDL as the migration. It does not apply other migrations or modify the migration ledger. Run the normal migration workflow to record 0004; it remains safe after first-use setup. A restricted DB role without CREATE permission requires an operator to apply 0004 before adding accounts. Existing content/audit tables and earlier migrations remain prerequisites. No production deployment or data changes have been performed.

Password parameter source: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

## 2.10.5 — Simple single-page content editor

Admin now opens a compact, mobile-oriented list of expandable sections. Homepage copy, artists, gallery, programme, tickets, FAQs and contact/information pages have inline forms. Save returns to the edited section with confirmation. New collection entries save as drafts and have an explicit Publish button. Published record saves retain publication. Status actions and revision history are in More options. Reordering locks the collection and atomically writes changed positions, recovery snapshots and audit entries; tied positions are normalized. Contact and legal page editing uses labelled fields instead of JSON.

Homepage copy is a validated `page` record with stable ID `page-home` and no slug. Existing databases need no new SQL type or migration for it. Until this record is first saved/published, the existing canonical homepage copy renders. Its first save uses the standard authenticated atomic writer and creates a published record; existing homepage edits use strict versions. Database-mode public reads consume published homepage copy and page cache invalidation. Local mode remains canonical/read-only. Other event date/location details, fixed ticket section copy and navigation remain code/config managed. Images use existing local media paths; uploads are not introduced.


## 2.10.4 — Frontend editing view

The admin landing page renders the shared public homepage with section controls and direct record edit links. Gallery controls follow the current slide; FAQs and programme filters remain interactive. Navigation uses the public paper colour and typography. Drafts and archives remain available in collection editors, while the landing preview shows published content. Homepage hero/about/mission/event/newsletter copy remains code-managed; this release does not add database fields for that copy. Save, publication, authorization, revisions and concurrency checks are unchanged.
# Architecture
`src/app` contains route/layout/metadata/HTTP boundary entrypoints. `src/features/site` owns public presentation and interactive motion; `src/features/content` owns canonical content, models, validation, public reads, publication tags and structured data; `src/features/admin` owns studio components/actions, authorization, session policy, preview paths, transactions and tests. `src/components` contains presentation actually reused across features. `src/db` contains the PostgreSQL adapter, schema and immutable migrations; `src/lib` contains shared site/motion/viewport/theme primitives; `src/styles` owns the public design system. Empty config/types directories are intentionally omitted.

Route → authorized server action → validated domain service → PostgreSQL transaction. A save locks the existing row, checks its precise version, validates data, records the original revision, updates the record and writes its audit event together. Restore locks/checks the current version and captures the state being replaced. New records use insert, not overwrite-on-conflict. Stable ID/type cannot change. The unique slug index is authoritative.

Public routes → public repository → local canonical source OR dynamic PostgreSQL adapter. In database mode only top-level published records appear publicly; nested draft/archive page sections are excluded. Authenticated Draft Mode reads bypass the public cache. Public readers have per-domain tags and a 60-second revalidation interval; authenticated mutations immediately expire their tag with updateTag. CLI maintenance requires an explicit post-maintenance redeploy/cache verification: time revalidation is background/request-driven, not a guaranteed 60-second purge. Sitemap and event structured data use published content rather than hardcoded artist/ticket lists.

Postgres.js is reused per process with default max 3 connections (DATABASE_POOL_MAX optionally sets 1–10), prepared statements off, 10-second connection, 15-second statement and 5-second lock timeouts. This is not a global fleet connection ceiling. Keep database capacity/region/pooler compatible with Vercel scaling. Migration execution uses a transaction-scoped advisory lock plus an immutable checksum ledger, with bounded lock/statement waits. Migration 0003 adds future-write checks and a published-read index; NOT VALID checks preserve legacy rows, which must be audited and validated separately.

The current scope is a small, single-admin event CMS. It has no multi-user invitations, RBAC, MFA, uploads, payment processing, newsletter storage, webhooks or cron. Media paths reference checked-in local assets. Tickets link to a configured external provider; newsletter posts directly to its provider. Never represent these unavailable integrations as completed backend capabilities.
