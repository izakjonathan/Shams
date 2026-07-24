# Shams for Humanity

Next.js event website prepared for deployment on Vercel.

## Run locally

```bash
npm install
npm run dev
```

## Production check

```bash
npm run lint
npm run build
```

## Current implementation — v0.1.54

- Full-screen splash with an animated entrance, hold, and exit.
- Paper-colored root canvas during the splash; black root canvas after the splash completes.
- Runtime theme color changes from paper to black at the completed-splash boundary.
- `viewport-fit=cover` is enabled.
- Mobile menu mounts only when opened, animates with the original vertical transform, and unmounts after closing.
- Body scrolling is locked only while the splash or mobile menu is active.
- Fixed header uses the original difference-blend treatment.
- Strengthened yellow gradients and glows remain part of the visual design.
- No tint sentinels, edge curtains, overscroll controllers, visual-viewport listeners, backdrop-filter sampling hacks, safe-area CSS, or hidden permanently mounted menu remain.

Set `NEXT_PUBLIC_SITE_URL` in Vercel to the production domain so canonical, social-preview, sitemap, and structured-data URLs are correct.
