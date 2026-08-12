# v2.9.1 database administration audit

This release adds database operations only. Public rendering and admin content-editing behavior are intentionally unchanged.

## Verified source architecture

- Database workflows are `workflow_dispatch` only.
- Migrate, Verify, and Seed share a GitHub concurrency group so destructive operations cannot overlap.
- Database credentials are accepted only through `secrets.DATABASE_URL`.
- Migration files are applied in lexical numeric order.
- Applied migration names and SHA-256 checksums are stored in `shams_migrations`.
- An applied migration with a changed checksum fails rather than silently re-running.
- Verification is read-only and checks tables, columns, indexes, migration registration, checksums, and content counts.
- Initial seeding fails if content already exists unless `refresh_existing=true` is explicitly selected.
- Seed operations are transactional and append an audit-log record with the GitHub actor.
- Database workflows install only pinned `postgres@3.4.7`, avoiding Next.js, Playwright, and unrelated dependencies entirely.

## Production invariants preserved

- No public layout or CSS changes.
- No splash, Safari, footer, gradient, gallery, reveal, menu, or route-curtain changes.
- No automatic migration during Vercel build or application startup.
- No database-maintenance controls added to `/admin`.
- `CONTENT_SOURCE` remains an explicit Vercel setting.
