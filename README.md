# Shams for Humanity v1.6.0

## v1.6.0 — Menu-style page transitions

This release continues from v1.5.0 and replaces the opacity veil with the same full-screen movement used by the mobile menu.

- A solid black panel enters from the top immediately after navigation is activated.
- The route commits while the panel fully covers the viewport.
- Destination scroll position is applied while covered.
- The panel exits back toward the top using the menu duration and easing.
- The live page is not faded, scaled, blurred or moved.
- The fixed header remains visually stable.
- Existing navigation locking, prefetching, reduced-motion handling and watchdog recovery remain.

Run `npm run release:check` before deployment once dependencies are installed.

## 1.6.0 — Artist morph transitions

Artist navigation now uses the browser View Transition API as a progressive enhancement. The selected lineup title is promoted into a matched compositor layer, moves and resizes into the artist-page heading, and returns to its exact lineup position when the page is closed. Artist-to-artist navigation morphs the title and portrait layers while the surrounding page crossfades. The fixed header remains stable. Information pages and unsupported/reduced-motion browsers retain the proven menu-style black curtain fallback.
