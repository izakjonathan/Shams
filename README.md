# Shams for Humanity v2.1.1

This release adds the database and protected-admin foundation without changing the approved public frontend.

## Public site

The public site still reads from the validated local content repository in `app/content/`. This keeps production behaviour deterministic while the admin/database layer is configured and tested.

## Admin foundation

- Protected `/admin` area using an HTTP-only signed session cookie.
- Environment-based initial administrator credentials.
- Overview plus Artists, Programme, Tickets, FAQs and Pages workspaces.
- Local read-only preview when no database is connected.
- PostgreSQL-backed JSON record editing when `DATABASE_URL` is configured.
- Draft, placeholder, published and archived statuses.
- Stable IDs, slugs and sort order.
- Database seeding from the canonical local content baseline.
- Audit log entries for seeds and record changes.

## Database

The Drizzle schema is in `app/db/schema.ts`. The initial SQL migration is in `app/db/migrations/0001_content_admin.sql`.

Commands:

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

Required environment variables are documented in `.env.example`.

## Current boundary

The admin database is intentionally not yet the public site's live content source. The next release should add a validated database repository adapter, media storage, structured field editors and protected draft preview after the database deployment has been verified.
