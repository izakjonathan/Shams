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

## Current implementation — v0.1.55

- Full-screen splash with an animated entrance, hold, and exit.
- Paper-colored root canvas during the splash; black root canvas after the splash completes.
- Runtime theme color changes from paper to black at the completed-splash boundary.
- `viewport-fit=cover` is enabled.
- Mobile menu mounts only when opened, animates with the original vertical transform, and unmounts after closing.
- Body scrolling is locked only while the splash or mobile menu is active.
- Fixed header uses the original difference-blend treatment.
- Strengthened yellow gradients and glows remain part of the visual design.
- No tint sentinels, edge curtains, overscroll controllers, visual-viewport listeners, backdrop-filter sampling hacks, safe-area CSS, or hidden permanently mounted menu remain.
- `app/globals.css` is fully expanded, consistently formatted, and organized with a numbered table of contents and section dividers.
- Multi-selector rules, transitions, and layered gradients are laid out across readable lines for easier editing.

Set `NEXT_PUBLIC_SITE_URL` in Vercel to the production domain so canonical, social-preview, sitemap, and structured-data URLs are correct.


## v0.1.57 — Stable Safari tint baseline

- Keeps the document canvas paper-colored during the splash, then directly sets both `html` and `body` to `#090909` when the splash is fully complete.
- Keeps the runtime `theme-color` synchronized with that paper-to-black transition.
- Makes `.siteShell` transparent so the black root canvas remains the true browser-area fallback instead of being covered by a permanent paper wrapper.
- Retains explicit backgrounds on all visible page sections.
- Retains a directly black full-screen menu with no sampling-exclusion filters.
- Retains the smooth menu enter/exit animation and fully removes the fixed menu from the DOM after closing.


## v0.1.57 — menu-local scroll lock test

- Removed all menu-time mutation of `document.body.style.overflow`.
- The root scrolling container is left untouched while the menu opens and closes.
- Scroll gestures are blocked only on the mounted full-screen menu using non-passive `touchmove` and `wheel` listeners.
- Scroll keys are blocked only while the menu is mounted, without interfering with editable controls.
- Added `overscroll-behavior: none` and `touch-action: none` to the menu itself.
- Confirmed the fixed header has no background or backdrop-filter.
- Retained `viewport-fit=cover`, the post-splash black root canvas, direct black menu background, and menu unmount after its exit transition.
