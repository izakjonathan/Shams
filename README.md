# Shams for Humanity v1.7.3 — Programme Data + Full-bleed Splash

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


### v1.7.3 programme and splash preparation

- Programme rows render their editable `time` values rather than generated ordinal numbers.
- Programme records now have stable IDs and explicit sort order for future CMS/API mapping.
- Rendered rows expose content ID and status data attributes for admin-preview integration.
- The supplied humanity artwork is the new full-bleed splash image.
- Splash and document canvases remain transparent through the safe areas, with no legacy gradient overlays.
