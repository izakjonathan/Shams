# Shams for Humanity v1.7.6 — Centralized Theme and Gradients

This release removes the complete artist morph system and replaces every cross-route navigation with one deterministic editorial curtain.

## Transition behaviour

- A solid black sheet enters from above immediately after activation.
- The fixed site header remains stable above the sheet.
- Next.js navigation begins only after the curtain fully covers the viewport.
- The destination scroll position is set while hidden.
- Fonts and two stable layout frames are awaited before reveal.
- The curtain exits upward; the live page never fades, scales, slides or blurs.
- Artist close and artist-to-artist actions use slightly faster timing than opening.
- Same-page hash navigation remains normal smooth scrolling.
- Reduced-motion users receive a near-instant cover/reveal.

The mobile menu implementation and animation are unchanged.

## Reliability

The controller uses `transitionend` as its primary lifecycle signal, with bounded timeout fallbacks and a global watchdog for Safari interruption recovery. Internal routes are prefetched on pointer, focus and touch intent.

### v1.7.2 typography system
Typography is centralized in `app/styles/typography.css` and uses semantic leading tokens from `app/design-system.css`. Adjust those tokens first for future site-wide typography refinements.


### v1.7.5 programme and splash preparation

- Programme rows render their editable `time` values rather than generated ordinal numbers.
- Programme records now have stable IDs and explicit sort order for future CMS/API mapping.
- Rendered rows expose content ID and status data attributes for admin-preview integration.
- The supplied humanity artwork is the new full-bleed splash image.
- Splash and document canvases remain transparent through the safe areas, with no legacy gradient overlays.


## v1.7.5 splash fix

- Restores unscoped first-visit `.splashScreen` geometry and stacking.
- Uses `100dvh` with `100svh`/`100vh` fallbacks for iOS viewport coverage.
- Keeps the site shell hidden until the splash exits.
- Uses a versioned session key and records it only after a completed sequence.
- Repeat visits are suppressed before hydration without affecting first visits.

### v1.7.5 splash canvas

During the first-visit splash, the supplied artwork is applied both to the full-screen overlay and the document canvas. This is required for iOS Safari's top status area and bottom toolbar area to visually continue the artwork. The temporary canvas class is removed when the splash finishes.

## v1.7.6 centralized visual system

- `app/theme.json` is the single editable source for the core palette.
- `scripts/generate-theme.mjs` generates `app/theme.generated.css`, including RGB channels, translucent derivatives and shared gradient colour recipes.
- `predev` and `prebuild` regenerate the CSS automatically.
- TypeScript-only renderers (manifest, Open Graph image and global error shell) import the same JSON through `app/lib/theme.ts`.
- `app/design-system.css` now contains typography, dimensions, spacing and motion only.
- `app/styles/gradients.css` contains every gradient definition and all gradient geometry/placement, including hero, homepage sections, artist pages, dark glows and small component fades.
- Homepage and artist component styles no longer contain direct gradient declarations.

To change the paper background everywhere, edit `paper` in `app/theme.json`. To change gradient colour globally, edit `accent`. To change gradient size, shape or position, edit `app/styles/gradients.css`.
