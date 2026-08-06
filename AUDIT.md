# v2.2.0 verification-foundation audit

## Scope

This is a verification release, not a redesign. No intentional Shams visual behaviour, Safari workaround, route-curtain behaviour, menu behaviour, content model, or admin architecture was removed or broadly refactored.

## Added controls

- Chromium and mobile-WebKit smoke projects.
- Trace-on-first-retry, failure screenshots, retained failure video, and HTML reports.
- A separate visual-regression project so missing screenshot baselines do not block ordinary smoke tests.
- Tests for first/repeat splash visits, menu lifecycle, artist open/close, information-page footer return, programme filtering, reduced motion, contact mail links, and admin route isolation.
- A deterministic verification script and CI workflow.
- CI enforcement of a committed lockfile and `npm ci`.
- Deployment, preview verification, and rollback documentation.

## Evidence available here

Theme generation, static source checks, release validation, script parsing, CSS structure, and archive integrity pass.

## Evidence not available here

The environment could not resolve the complete npm dependency graph, so no trustworthy lockfile, dependency-backed TypeScript check, Next.js production build, Playwright browser run, screenshot baseline, live PostgreSQL test, deployed preview, or real-iPhone test is claimed.
