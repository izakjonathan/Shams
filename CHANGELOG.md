# Changelog

## 2.4.0 — Database-backed public content and preview mode

- Added a server-only public repository with local/database source switching.
- Database mode exposes only published records to normal visitors.
- Authenticated Draft Mode renders drafts through the real public site.
- Added tagged caching and targeted invalidation after admin writes.
- Added explicit error versus local-fallback database policy.


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
