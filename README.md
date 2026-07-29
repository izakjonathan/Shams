# Shams for Humanity v2.0.0

Typed content architecture release based on v1.9.0. The approved frontend design, Safari viewport system, splash, menu, editorial curtain, and page layouts are unchanged.

## Content architecture

All editable site content now lives under `app/content/`:

- `models.ts` — canonical TypeScript models for event, artists, programme, tickets, FAQ, information pages, contact routes, navigation, and homepage content.
- `data/` — local content-source adapters used until a database or CMS is connected.
- `validation.ts` — runtime validation for IDs, statuses, ordering, slugs, times, dates, ticket values, and required fields.
- `repository.ts` — the only public read interface used by server-rendered pages and metadata.
- `navigation-repository.ts` — a lightweight client-safe interface for the interactive header.

Components and routes no longer import raw content arrays. They call repository methods such as `getEvent()`, `getArtists()`, `getProgramme()`, `getInformationPage()`, and `getContactPage()`.

## Backend migration path

The files in `app/content/data/` can later be replaced with database or CMS adapters while keeping the repository API and frontend components stable. The runtime validator remains between external data and the presentation layer.

## Validation

- Release configuration validation: passed.
- Static architecture audit: passed.
- CSS brace validation: passed.
- Validation-script syntax checks: passed.
- ZIP integrity: passed.
- Full dependency-based Next.js build was not run because the environment has no installed dependencies or reproducible package lock.
