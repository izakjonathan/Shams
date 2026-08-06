# v2.4.1 release checklist

- [x] Built from v2.4.0
- [x] Removed server-only exports from the client-safe content barrel
- [x] Added explicit server-only content entry
- [x] Updated public Server Component imports
- [x] Kept client and Edge routes free of PostgreSQL and `next/headers`
- [x] Consolidated content cache tags
- [x] Added regression audit guards for the import boundary
- [x] Preserved database source switching, Draft Mode preview, and cache invalidation
- [x] Preserved approved public design and Safari systems
- [x] Theme generation, static audit, and release validation
- [ ] Confirm full Vercel production build
- [ ] Live PostgreSQL migration/read/write test
- [ ] Deployed preview and real-iPhone regression pass
