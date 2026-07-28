# Shams for Humanity — v1.1.9

Production-oriented, mobile-first Next.js festival website.

## v1.1.9 — Vercel deployment repair

- Removed ESLint and Playwright from the deployable dependency tree.
- Removed the stale v1.1.7 tooling requirements from release validation.
- Pinned TypeScript to 5.9.3.
- Removed the Node/npm engine override that conflicted with Vercel project settings.
- Restored Vercel's default npm installation behavior.
- Preserved all design improvements and runtime behavior from the attached build.


## Current release

v1.1.9 is a deployment-repair release built on the repository-quality hardening work. It preserves the approved visual design while improving maintainability, accessibility, testing, security policy, and release validation.

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
