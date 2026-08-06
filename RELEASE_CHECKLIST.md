# v2.9.0 release checklist

- [x] Built from v2.8.0
- [x] Added `content_revisions` migration and Drizzle schema
- [x] Capture previous state before database writes
- [x] Added global and record-specific revision pages
- [x] Added validated, stale-safe restore action
- [x] Preserve current state before every restore
- [x] Add audit and cache invalidation on restore
- [x] Preserve public design and runtime behavior
- [x] Static architecture audit passes
- [x] Release validation passes
- [ ] Run migration against production PostgreSQL
- [ ] Verify save → revise → restore with a deployed preview
- [ ] Run dependency-backed TypeScript and Next.js build
