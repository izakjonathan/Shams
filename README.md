# Shams for Humanity — v0.9.1

Mobile-first Next.js festival website and release candidate.

## v0.9.1 — Production hardening

- Added recoverable route-level and root-level error boundaries.
- Added `npm run release:validate` for environment and release-file validation.
- Strengthened public URL validation: production integrations require HTTPS, localhost may use HTTP, and embedded credentials are rejected.
- Preview/noindex deployments no longer advertise a sitemap from `robots.txt`.
- Preserved the current design, gradients, menu, splash lifecycle, artist routes and Safari behavior.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run release:validate
npm run release:check
```

See `RELEASE_CHECKLIST.md` for v1.0 sign-off requirements.
