# Shams for Humanity v2.1.9

## Constitution alignment — phase one

This release applies the smallest safe improvements identified by the Project Development Constitution alignment audit. It deliberately preserves the approved Shams visual language, splash, hero, Safari canvas handling, menu, editorial curtain, footer-contact behaviour, typed content architecture, and admin foundation.

### Included

- Type-specific validation now runs before any admin database write.
- Admin statuses are constrained to the canonical content-status vocabulary.
- Database seed audit metadata derives from the package version rather than a stale hard-coded value.
- Same-page and cross-page focus restoration use one safe helper with temporary `tabindex` cleanup.
- Gradient strength `1.2` now has a visible effect through saturation and contrast rather than relying only on CSS opacity values that clamp at `1`.
- The unused previous splash JPEG has been removed.
- Node 22 is explicitly pinned for Vercel and clean development environments.
- A cumulative changelog and regression QA matrix have been added.

### Deliberately deferred

- `package-lock.json` and `npm ci`: the available package registry does not contain the pinned `@types/node@22.0.0`, so a trustworthy lockfile could not be generated here.
- Playwright/browser automation: this should be added only alongside a verified dependency install.
- Route-group layout separation, CSS ownership restructuring, and browser-back curtain changes remain test-led future work.

See `AUDIT.md`, `CHANGELOG.md`, and `QA_MATRIX.md` for the release evidence and remaining verification requirements.
