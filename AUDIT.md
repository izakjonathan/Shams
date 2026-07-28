# Shams for Humanity v1.4.0 — Release Audit

## Scope

This release upgrades the route-transition layer without changing the approved page designs or placeholder-content strategy.

## Transition architecture

- Site-controlled internal navigation is routed through `FadeLink` and `RouteFade`.
- Supported browsers use `document.startViewTransition`.
- Unsupported browsers use the hardened scale-and-opacity fallback.
- Transition kinds distinguish artist opening, artist closing, artist switching, information-page opening, information-page closing and page switching.
- The fixed header is assigned its own transition name so it remains visually stable.
- Artist names use stable per-slug transition names on both the homepage lineup and detail pages.
- Artist portraits use a separate named transition.
- Destination scroll positioning happens before the native new snapshot is released.
- Keyboard-triggered navigation restores focus on the destination.
- Reduced-motion users bypass meaningful animation.

## Contradiction review

- No global smooth scrolling is active for cross-page routes.
- No document-level click interceptor competes with Next.js links.
- No route loading skeleton creates a second page transition.
- Mobile-menu navigation unmounts the menu before route navigation.
- The obsolete artist-card system is absent.
- View-transition CSS is imported after other motion styles and before final responsive overrides.
- Native and fallback engines share one transition controller and one navigation lock.

## Known platform boundary

Interactive browser gestures, particularly Safari swipe-back, are browser-owned. They cannot be guaranteed to use the site’s custom exit animation. Normal site controls use the editorial transition system.

## Validation

- release configuration validator passed
- static architecture audit passed
- source syntax transpilation passed
- CSS and JSON structural checks passed
- archive structure is flat
- generated build folders and dependency folders are excluded

A dependency-backed `next build` was not completed in this environment because registry installation timed out.
