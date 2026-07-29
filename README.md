# Shams for Humanity v1.8.4

This release hardens the site for iOS 26 Safari Liquid Glass while preserving the approved v1.8.2 visual design, editorial curtain, menu, hero, gradients, content, and navigation.

## Safari viewport system

- `html` and `body` always have an explicit document-canvas colour.
- The server-rendered fallback is the site paper colour.
- During the splash, Safari receives a sampled blue fallback colour instead of a transparent root or root background image.
- The splash artwork bleeds above and below the visual viewport using dedicated top and bottom guard bands.
- A 62 px scroll runway is enabled only on touch mobile Safari, then removed while the splash is still opaque.
- The normal homepage and all route coordinates remain unchanged; there is no global runway.
- The site shell becomes inert and `aria-hidden` while the splash is active, then is restored before the dissolve.
- The document is not locked with `body { overflow: hidden; }`.

## Fixed-element tint isolation

- The editorial route curtain is mounted only while a route transition is active.
- The mobile menu remains conditionally mounted exactly as before.
- The fixed page-close wrapper is transparent and borderless; its visible circular border, cross, hover fill, and focus ring live on an absolutely positioned child.
- The fixed site header remains transparent with no backdrop filter.

## Splash handoff

The sampled blue canvas, scroll runway, and artwork remain active while the splash is opaque. During exit, the runway is removed, scroll is restored to zero, the document canvas switches to paper, the site shell is made interactive, two frames are painted, and only then does the artwork dissolve.

The splash session key is `shf-splash-seen-v1.8.4`.
