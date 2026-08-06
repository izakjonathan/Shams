# Shams for Humanity v2.4.0

Database-backed public content and authenticated Draft Mode preview, built from v2.3.0.

## Content source

- `CONTENT_SOURCE=local` keeps the canonical local repository as the public source.
- `CONTENT_SOURCE=database` reads published artists, programme, tickets, FAQs, and information pages from PostgreSQL.
- `CONTENT_DATABASE_FAILURE=error` fails visibly on database errors.
- `CONTENT_DATABASE_FAILURE=local-fallback` deliberately falls back to canonical local content.

Admin preview enables Next.js Draft Mode and renders database drafts through the real public components. Publish actions invalidate content-type cache tags. Public design and Safari behavior are unchanged.
