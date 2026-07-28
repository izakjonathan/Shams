# Shams for Humanity — v1.3.4

Mobile-first Next.js festival website using placeholder content while the design and interaction system are developed.

## Current release

v1.3.4 is a transition, accessibility, and repository-consistency correction release.

### Navigation

- Site-controlled cross-page links fade out before navigation and fade in after the destination has been positioned.
- Same-page section links scroll explicitly; global smooth scrolling is disabled.
- Artist close controls return to the corresponding artist row without a visible route scroll.
- Mobile-menu navigation unmounts the menu before route fading begins.
- Native browser Back/Forward and Safari swipe gestures retain browser-controlled gesture behavior; the destination is normalised and faded in after the history route commits.

### Programme and artists

- Homepage artists use the compact list layout.
- Programme rows omit public time and development-status labels.
- Artist and ticket development-status fields have been removed from both the public interface and active content model.
- Programme filters include a visible mobile overflow affordance.

### Quality controls

```bash
npm install
npm run release:validate
npm run quality:check
npm run typecheck
npm run build
```

`quality:check` rejects reintroduction of removed artist-card code, public status-label code, the obsolete ticket boolean, and global CSS smooth scrolling.

## Environment

Copy `.env.example` to `.env.local` when integrations are ready. Preview deployments remain noindex by default.

## Deployment

The project currently uses `npm install` because a lockfile could not be generated in the offline build environment. Generate and commit `package-lock.json` in a networked environment, then switch Vercel to `npm ci --no-audit --no-fund`.
