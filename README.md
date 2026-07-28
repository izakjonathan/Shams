# Shams for Humanity v1.5.1

## v1.5.1 — Menu-style page transitions

This release continues from v1.5.0 and replaces the opacity veil with the same full-screen movement used by the mobile menu.

- A solid black panel enters from the top immediately after navigation is activated.
- The route commits while the panel fully covers the viewport.
- Destination scroll position is applied while covered.
- The panel exits back toward the top using the menu duration and easing.
- The live page is not faded, scaled, blurred or moved.
- The fixed header remains visually stable.
- Existing navigation locking, prefetching, reduced-motion handling and watchdog recovery remain.

Run `npm run release:check` before deployment once dependencies are installed.
