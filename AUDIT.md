# v2.1.1 architecture audit

## Scope

The release was reviewed for separation between the approved public frontend and the new administration layer.

## Confirmed

- Public routes remain on the v2.0.0 validated local repository.
- `/admin` is excluded from indexing through route metadata.
- Admin sessions use HTTP-only, same-site cookies with HMAC signatures and an eight-hour expiry.
- Missing or weak admin configuration cannot authenticate a user.
- Database access is server-only and lazy; the public frontend does not require `DATABASE_URL`.
- PostgreSQL uses a generic JSONB content table with stable metadata and a separate append-only audit log.
- Local content is normalized before database seeding so Next.js `StaticImageData` objects become persistent image paths.
- Database writes are disabled in the UI until `DATABASE_URL` is configured.
- Stable IDs cannot be changed in the editor.
- The mobile menu, splash, Safari canvas controller, route curtain and public CSS were not rewritten.

## Known next-phase work

- Public database repository adapter and preview-mode data selection.
- Structured per-field editors replacing the foundation JSON editor.
- Image upload/storage integration.
- Database-side schema validation before writes.
- Role-based access, password rotation and optional identity-provider authentication.
- Revision restore UI and record deletion workflow.
- A reproducible lockfile and full production build.
