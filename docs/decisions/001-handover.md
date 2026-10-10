# Decision 001 — Preserve the baseline while strengthening the handover
Accepted for candidate 2.10.0, 10 October 2026.

Relocate the existing implementation rather than recreate the site. Retain typography, colors, motion controllers, CSS boundaries and URLs. Domain implementation goes under features; route files remain entrypoints. The server-only PostgreSQL adapter stays lazy on the public local-content path. Metadata sitemap is allowed a published-content read; other static metadata stays database independent.

Keep the existing single-admin environment credential model for this scoped handover, but harden HMAC tokens, constant-length comparisons, expiry, credential rotation and shared login limits. Managed identity/MFA is a future scope decision, not a pretend feature. PostgreSQL row locks plus optimistic version checks protect edits; revisions and audit records commit in the same transaction. Audit tables are append-only by application convention, not cryptographically immutable or protected against a database-owner modification.

Disable preview content writes by default because the observed environment scopes share a database. Only enable with isolation. Keep explicit outage policy: local-fallback is operator-controlled and may surface baseline content, so error is the safer publication-governance default.

Keep CSP's existing unsafe-inline allowance while retaining the splash/static layout. It is a documented security tradeoff rather than full strict-CSP compliance. Preserve the existing Edge OG image for this release despite Next's deprecation warning; it has fixed content and no user-controlled SVG. Revisit it separately with visual/runtime tests.

Use NOT VALID checks to avoid deleting/rejecting legacy rows during migration. New writes are checked immediately. Audit legacy rows with db:verify and application validators before `VALIDATE CONSTRAINT`. Do not treat schema presence as proof of a clean database.

Keep patched runtime dependencies and reproducible lockfile. Do not apply npm audit's suggested major downgrade of Next/Drizzle tooling merely to quiet development-only advisories. Avoid exposing development/tooling servers and reassess those advisory chains before final sign-off.
