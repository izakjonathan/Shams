# v2.4.2 release checklist

- [x] Built from v2.4.1
- [x] Moved database public reads into a dedicated server-only adapter
- [x] Lazy-loaded the database adapter only in database mode
- [x] Kept local content mode independent of PostgreSQL and Drizzle
- [x] Declared Node runtime for database-backed pages, admin, and preview routes
- [x] Externalized the Node-only PostgreSQL driver
- [x] Kept client, metadata, manifest, sitemap, and Edge Open Graph graphs database-free
- [x] Added a dedicated runtime-boundary audit
- [x] Added boundary audit to prebuild and complete verification
- [x] Added conditional Vercel `npm ci` support for a future committed lockfile
- [x] Preserved public design, Safari systems, transitions, preview, and governance
- [x] Theme generation, source audits, release validation, syntax, CSS, and ZIP integrity
- [ ] Generate and commit `package-lock.json` on a network with all pinned packages
- [ ] Confirm complete Vercel production build
- [ ] Run live PostgreSQL migration/read/write/cache-invalidation test
- [ ] Run deployed preview and real-iPhone regression matrix
