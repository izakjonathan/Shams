# Shams for Humanity v1.9.0

Cleanup and stability release based on v1.8.4.

## Main changes

- Added one shared visual-viewport utility for bottom-of-document positioning.
- Route returns to the footer no longer use `window.innerHeight`.
- The fixed header remains visible but becomes inert during route transitions.
- Removed dead route-transition classes, phase class names, data attributes, and canvas-tone markers.
- Reduced the route watchdog from 7 seconds to 4.2 seconds.
- Temporary focus `tabindex` values are removed after focus leaves the destination.
- Splash cleanup is now idempotent and restores root classes, runway, canvas colour, scroll position, and shell accessibility state after normal completion or interruption.
- Splash animation is opacity-only; blur and scale compositor effects were removed.
- The document canvas variable is written on the root only and inherited by the body.
- The one-time artist return target is consumed and removed from session storage.
- Global footer styling now lives in `app/styles/footer.css`.
- `view-transitions.css` was renamed to `route-curtain.css`.
- Artists, tickets, FAQ entries, and event content now have stable backend-ready IDs, ordering, and status fields.
- Removed an unused motion token and an empty media query.

## Validation

- Release configuration validation: passed.
- Static architecture audit: passed.
- CSS brace validation: passed.
- JavaScript validation-script syntax checks: passed.
- Full Next.js build not run because the environment registry does not provide the pinned `@types/node@22.0.0`, so a lockfile could not be generated here.
