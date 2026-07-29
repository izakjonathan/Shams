# v2.0.0 Typed Content Architecture Audit

## Completed

1. Removed the legacy `app/lib/content` directory and all imports pointing to it.
2. Established one canonical model layer for every editable content family.
3. Added stable repository methods so page components no longer depend on storage format.
4. Added runtime validation at the repository boundary.
5. Added uniqueness checks for IDs, slugs, and sort positions.
6. Added format checks for programme and artist times, ISO event dates, ticket prices, and content statuses.
7. Moved Privacy, Terms, Accessibility, Contact, navigation, and primary homepage editorial copy out of route components.
8. Updated artist pages, metadata, sitemap, manifest, JSON-LD, header, footer, FAQ, programme, and tickets to consume typed repository data.
9. Kept a separate lightweight navigation repository so the client header does not need the full artist/media dataset.
10. Preserved all v1.9.0 visual, transition, Safari canvas, splash, footer, and accessibility behavior.

## Backend readiness

The public frontend now depends on a repository contract rather than local arrays. A future database adapter can replace the local data modules without changing the visual components. The same models and validation rules can be reused by Server Actions, API routes, and the admin interface.

## Remaining external limitation

A reproducible package lock and full production build still need to be generated in an environment with access to all pinned npm packages.
