# Shams for Humanity v2.3.0

## Admin publishing and governance workflow

This release builds on v2.2.0 without changing the approved public experience. It strengthens the existing database-backed admin foundation with explicit publishing actions, protected record previews, stale-edit protection, slug conflict checks, corrected admin routing, and a persistent audit-log workspace.

### Included

- Save, publish, move-to-draft, and archive actions.
- Protected record previews under `/admin/preview/...`.
- Optimistic concurrency protection using each record's `updatedAt` value.
- Duplicate slug rejection within each content type.
- Audit-log workspace at `/admin/audit`.
- Correct plural routes for FAQ and information-page editors.
- Expanded audit metadata for status and content changes.

The public frontend continues to use the validated local repository. Enabling database content on the public site remains a deliberate later phase after a real database migration and preview deployment have passed QA.
