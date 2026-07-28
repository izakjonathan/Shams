# v1.6.2 full artist-transition audit

## Root cause

The previous implementation tried to use the browser View Transition API as an asynchronous route loader. That architecture had three contradictory requirements:

1. The post-splash document canvas is intentionally transparent for Safari browser-chrome tinting.
2. The root View Transition snapshot requires a stable opaque compositor surface while old and new document snapshots overlap.
3. The transition callback remained open until a Next.js App Router pathname commit, so Safari owned and displayed the root compositor snapshot for the full, variable route-loading interval.

Changing the compositor background from transparent/black to paper only changed the symptom from a black interstitial to a white interstitial. It did not repair the architecture. The blank screen was the View Transition root layer itself, not missing page CSS.

## Additional contradictions found

- `::view-transition` and both root groups were forced to a paper background while the live site intentionally used a transparent `html`/`body` canvas.
- The full-page root snapshot was animated even though only the artist title needed to morph.
- A stable header was given a named View Transition layer despite remaining mounted outside the changing route subtree.
- Route completion was inferred from `usePathname()` rather than from an API that guarantees all destination imagery and layout are ready.
- A 4.2 second watchdog allowed the compositor-owned blank layer to remain visible for several seconds if the route lifecycle or snapshot setup failed.
- The prior fix attempted to solve a root-snapshot failure by changing opacity ordering; this could never remove the opaque compositor canvas placed beneath those snapshots.

## v1.6.2 solution

Artist navigation no longer invokes `document.startViewTransition()`.

Before navigation, the controller clones the currently visible route DOM into a fixed, non-interactive snapshot. It removes the selected title from that clone and creates a separate fixed title layer using the source element's computed typography and exact viewport rectangle. Next.js then navigates behind the retained old-page clone.

After the destination pathname commits, the controller positions the destination scroll, measures the destination title, hides the live destination title temporarily, fades the old DOM clone away, fades the live destination page in, and performs a FLIP transform from the source title rectangle to the destination title rectangle. The live title is restored at completion.

This keeps visible content on screen during route loading and does not expose Safari's compositor canvas. Information pages and the mobile menu continue using the existing black curtain.
