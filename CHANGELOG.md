# Changelog

## 2.5.0 — Stable visual restoration

- Restored the approved stronger gradient presence from the stable v2.4.9 baseline.
- Set gradient size to 1.5 and strength to 1.2.
- Replaced runtime scale enlargement with direct gradient-layer geometry and wash overscan.
- Kept startup scroll mutation, hero blur, and splash-entry transforms removed.
- Preserved the stable opacity-only splash handoff and all public/admin architecture.

## 2.4.9 — Diagnostic initial-paint isolation

- Removed the startup scroll guard and all initial-load scroll mutation.
- Temporarily restored gradient size to 1 and removed global transform enlargement.
- Disabled hero blur.
- Simplified splash animation to a single opacity dissolve.

# Changelog

## 2.4.6 — Deterministic startup scroll guard

- Installs a pre-hydration head script that pins direct loads and reloads to `scrollY = 0` until startup is complete.
- Preserves native browser back/forward restoration and direct hash navigation.
- Prevents Safari's delayed native scroll restoration from racing the splash handoff.
- Disables scroll anchoring only while the startup guard is active.

## 2.4.5 — Production runtime-boundary hardening

- Moved database public reads into a dedicated server-only adapter.
- Lazy-loads PostgreSQL and Drizzle only when database content mode is selected.
- Added explicit Node runtimes for public database pages, admin, and Draft Mode preview routes.
- Externalized the Node-only `postgres` driver from Next.js server bundles.
- Added runtime-boundary audits to prebuild and release verification.
- Added conditional Vercel `npm ci` support once a lockfile is committed.
- Preserved all approved public, Safari, transition, preview, and admin behavior.

## 2.4.1 — Server/client content-boundary fix

- Removed the server-only public repository from the shared content barrel imported by Client Components.
- Added an explicit `app/content/server.ts` entry for database-backed public content.
- Prevented `next/headers`, Drizzle, and the Node PostgreSQL driver from entering client and Edge bundles.
- Consolidated cache tags and added regression audit guards.
- Preserved the v2.4.0 public-content source switch, Draft Mode preview, and targeted revalidation.

## 2.3.0 — Admin publishing and governance workflow

- Added explicit save, publish, draft, and archive actions.
- Added protected record previews and a database audit-log workspace.
- Added stale-edit and duplicate-slug protection.
- Fixed FAQ and information-page admin routing.
- Preserved the public frontend and verification foundation.

## 2.2.0 — Verification and regression foundation

- Added Playwright smoke projects for Chromium and mobile WebKit.
- Added first/repeat splash lifecycle tests.
- Added menu, artist navigation, legal footer return, programme, reduced-motion, contact, and admin-route smoke coverage.
- Added an opt-in visual regression harness for approved public surfaces.
- Added a unified release verification command.
- Added a GitHub Actions quality gate with traces and report artifacts.
- Added deployment, preview verification, real-device, and rollback documentation.
- Preserved all approved visual, Safari, transition, content, and admin systems.

## 2.1.9 — Constitution alignment phase one

- Added type-specific validation before admin database writes.
- Constrained admin status values to canonical content statuses.
- Reused one safe focus-restoration helper for same-route and cross-route navigation.
- Corrected gradient strength above 1 using bounded opacity plus saturation/contrast.
- Derived seed audit metadata from the package version.
- Removed the unused previous splash JPEG.
- Pinned Node 22.
- Added a documented regression QA matrix.
- Corrected release-documentation drift.

## 2.1.8 — Splash refresh and gradient update

- Replaced the splash artwork.
- Set global gradient size to 1.5 and strength to 1.2.
- Updated the splash session key for the new artwork.

## 2.1.7 — Permanent footer canvas fix

- Replaced exact-document-bottom-only detection with visual-viewport footer-contact detection.
- Added a conditional non-layout black underlay at footer contact.
