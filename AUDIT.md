# v2.3.0 admin publishing workflow audit

- Public splash, hero, gradients, Safari canvas, footer, menu, curtain, typography, and accessibility systems are unchanged.
- Admin writes continue through canonical type-specific validation.
- Publishing status is controlled by explicit server-action intent rather than client-only state.
- Existing records carry an `updatedAt` token; stale editor submissions are rejected.
- Slugs are checked for conflicts before database writes.
- FAQ and page editor links now resolve to `/admin/faqs` and `/admin/pages`.
- Preview and audit routes require the existing signed admin session.
- Audit records include metadata and status transitions rather than data alone.
- No database migration is required because the existing schema already contains status, timestamps, and audit tables.

Outstanding verification: full dependency-backed build, PostgreSQL migration/seed/write test, and deployed admin workflow QA.
