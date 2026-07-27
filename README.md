# Shams for Humanity — v1.1.0

Mobile-first Next.js festival website.

## v1.1.0 — Artist editorial system and information pages

- Rebuilt every artist route as a complete editorial page with placeholder biography, origin, genre, pronouns, performance details, quote, highlights, links and next-artist navigation.
- Added a responsive placeholder-artwork system that can later be replaced with approved artist photography.
- Added lightweight Privacy, Terms, Accessibility and Contact pages with editable draft text.
- Added the information pages to the shared footer and sitemap.
- Moved editable content into focused files under `app/lib/content/` while preserving a compatibility barrel.
- Promoted the footer to a shared layout component so it appears on every route.
- Added responsive, keyboard-visible and reduced-motion-compatible polish without changing the homepage ticket or newsletter integrations.
- Ticket work, final newsletter integration and final social links remain deferred as requested.

## Important draft-content note

The legal, contact and artist copy is intentionally provisional. Replace placeholder email addresses, organizer details, artist-approved biographies, imagery and external links before launch. The legal pages are practical first drafts, not a substitute for professional legal review.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run release:validate
npm run release:check
```
