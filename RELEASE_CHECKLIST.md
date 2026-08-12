# v2.9.1 release checklist

- [x] Built from the confirmed v2.9.0 revision-history baseline.
- [x] Added manual GitHub Actions for migrate, verify, and seed.
- [x] Added deterministic migration registry and migration checksum protection.
- [x] Added schema/table/column/index/migration verification.
- [x] Added safe initial seed protection and explicit refresh opt-in.
- [x] Added canonical seed snapshot for the v2.9.1 baseline.
- [x] Database workflows install runtime dependencies only and do not require Playwright.
- [x] Vercel content source remains unchanged by database workflows.
- [x] Static architecture audit passes.
- [x] Release configuration validation passes.
- [ ] Run Database — Migrate against the connected Neon database.
- [ ] Run Database — Verify against Neon.
- [ ] Run Database — Seed with refresh_existing=false.
- [ ] Verify `/admin` against the seeded database.
- [ ] Switch CONTENT_SOURCE only after database QA passes.
