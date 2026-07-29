# Shams for Humanity v1.8.0 — Restored Hero + Simple Gradient Controls

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

## v1.8.0 hero restoration and safe controls

- Restores the complete approved v1.7.7 hero gradient implementation and geometry.
- Removes the over-centralized v1.7.8/v1.7.9 layer, shape, rotation, and hero-token systems.
- Exposes only two controls at the top of `app/styles/gradients.css`:
  - `--gradient-size`: visually enlarges or reduces gradient artwork only.
  - `--gradient-strength`: adjusts gradient visibility only.
- Neither control changes section height, width, spacing, typography, content positioning, or page scale.
- Section-specific placement remains exactly as designed, so changing the two master controls cannot rearrange the composition.
- The hero wash and all section washes are isolated in pseudo-elements so strength can be adjusted without changing layout.

Use `1` for the approved original appearance. For example, `1.1` makes the glow artwork 10% larger; `0.8` makes all gradients 20% weaker.
