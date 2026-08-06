# v2.4.0 database public-content audit

- Public components retain their existing presentation and receive data through a new server-only repository.
- Normal database mode returns published records only.
- Authenticated Draft Mode bypasses the published cache and includes draft records.
- Local mode remains the default and rollback source.
- Database failure behavior is explicit rather than silently inferred.
- Admin saves invalidate only the affected content tag.
- Preview routes are authenticated, private, no-store, visibly labelled, and noindex.
- Event, homepage, and navigation remain local because no corresponding database record types exist yet.
- Full PostgreSQL, build, and browser verification still require external credentials and installed dependencies.
