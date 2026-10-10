# Shams for Humanity — 2.10.0
A Next.js festival website with a single-administrator PostgreSQL content studio. This handover candidate extends the deployed 2.9.4 code, preserves its visual system and relocates implementation into feature domains.

**Start with [APPLY_CHANGES.md](APPLY_CHANGES.md) when applying the ZIP. Remove the old root `app/` directory; Next.js otherwise ignores `src/app`.**

Use Node 24 and `npm ci`. Copy `.env.example` to a local environment file, set only development credentials, then `npm run dev`. Public content defaults to the checked-in local baseline. Database mode is selected explicitly with `CONTENT_SOURCE=database`; it requires migrated PostgreSQL and reviewed published records. Database content does not control event dates, home copy, navigation or deployment integrations: these remain checked-in configuration.

Admin requires ADMIN_EMAIL, ADMIN_PASSWORD and a random ADMIN_SESSION_SECRET of at least 32 characters. Configure DATABASE_URL, run `npm run db:migrate`, then `npm run db:verify`. CLI initial seeding refuses a populated database; the authenticated studio Seed button inserts missing records without overwriting edits. Do not refresh production from the baseline. Preview content writes are disabled unless an isolated database is provisioned and ALLOW_PREVIEW_DATABASE_WRITES=true.

Validation: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`; install browsers with `npx playwright install --with-deps chromium webkit`, then `npm run test:e2e`. Database regression tests require an isolated loopback database named shams_test and DATABASE_TEST_URL; run `npm run test:db`. `node scripts/test-db-local.mjs` offers a partial PGlite check, not concurrency/rollback certification. `npm run verify` runs the release and browser gates.

See [HANDOVER_REVIEW.md](HANDOVER_REVIEW.md) for findings, evidence, remaining gates and sources; [architecture](docs/architecture.md), [testing](docs/testing.md), [workflow](docs/development-workflow.md), [handover plan](docs/plans/handover.md), and [decisions](docs/decisions/001-handover.md). Earlier release reports are historical and do not certify this candidate.
