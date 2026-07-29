# Shams for Humanity v1.7.0 — Editorial Curtain

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
