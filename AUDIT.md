# v1.6.4 artist morph audit

## Corrections made

- Removed the full `route.cloneNode(true)` snapshot. The controller now clones only visible top-level page blocks that intersect the viewport plus 96 px overscan.
- Each snapshot block is positioned using its measured viewport rectangle, so removing off-screen sections does not collapse the visible layout.
- Added a solid paper background to the fixed snapshot layer to prevent Safari compositor backing colours from showing through transparent safe-area or gradient regions.
- The source title is marked temporarily before cloning, allowing only the selected title to be hidden in the snapshot. Adjacent artist names remain visible.
- Replaced non-uniform `scaleX/scaleY` title animation with interpolation of `left`, `top`, `width`, `height`, `font-size`, `line-height` and `letter-spacing`.
- Lowered the floating title below the fixed header while retaining it above route content.
- Stored source typography as plain values rather than retaining a live `CSSStyleDeclaration` from a route that may unmount.
- Added a bounded 180 ms destination portrait decode wait before the existing font and stable-frame checks.
- Added focus hardening for non-focusable artist row destinations.
- Strengthened the static audit to reject whole-route cloning and require viewport pruning.

## Validation

- `node scripts/validate-release.mjs`: passed.
- `node scripts/audit-static.mjs`: passed.
- `npm install --package-lock-only` timed out in the execution environment, so a fresh lockfile, full typecheck and production build could not be completed here.
