# v2.9.4 database record normalization audit

Root cause confirmed from Vercel runtime logs: existing `content_records` rows had authoritative metadata in database columns but some JSON `data` objects lacked matching `id`, `status`, `sortOrder`, or `slug` values. Canonical validation treated the duplicated JSON metadata as mandatory and crashed database-backed public rendering.

Corrections:

- Public reads construct canonical metadata from database columns before validation.
- Admin reads use the same normalization, preventing malformed legacy payloads from propagating.
- Revision restore normalizes historical snapshots before validation.
- Existing Neon records can be backfilled with a guarded, revisioned, audited GitHub Action.
- Database verification now reports metadata drift before a deployment is considered healthy.
- Repair does not change editorial content, order columns, slug columns, publication status, or timestamps other than `updated_at`.
- No public visual, Safari, transition, gallery, or motion behavior changed.
