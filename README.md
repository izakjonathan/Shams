# Shams for Humanity — v1.1.7

Production-oriented, mobile-first Next.js festival website.

## Current release

v1.1.7 is a repository-quality hardening release. It preserves the approved visual design while improving maintainability, accessibility, testing, security policy, and release validation.

### Included

- Shared responsive homepage, artist pages, information pages, footer, menu and error states.
- Session-only splash screen with repeat-paint suppression.
- Stable statically generated artist routes and responsive static image imports.
- Preview-safe metadata and search-indexing controls.
- Modular CSS files imported in the original cascade order.
- ESLint configuration and Playwright smoke journeys.
- Stronger launch validation for placeholder public information.
- Scrollable mobile menu with inert background regions.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm run test:e2e:chromium
npm run release:check
```

## Reproducible installs

This archive does not include a generated `package-lock.json` because the package registry was unavailable in the build environment. Generate and commit the lockfile in a networked environment:

```bash
npm install --package-lock-only
```

After the lockfile is committed, change Vercel's install command to:

```bash
npm ci --no-audit --no-fund
```

## Production configuration

Copy `.env.example` and configure production values in Vercel. Search indexing remains disabled unless explicitly enabled.

See `RELEASE_CHECKLIST.md` and `AUDIT.md` before launch.
