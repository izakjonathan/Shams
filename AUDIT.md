# v1.9.0 Cleanup and Stability Audit

This release applies the highest-priority findings from the complete v1.8.4 audit without changing the approved visual design.

## Resolved contradictions

1. Footer destination calculations and Safari canvas sampling now share visual-viewport-aware geometry.
2. The route curtain and mobile menu can no longer be opened at the same time through the header; the header is inert during route transitions.
3. Splash interruption cleanup now restores every temporary class, the document canvas, the runway, scroll position, and shell accessibility state through one idempotent restoration path.
4. The route-target storage value is consumed once instead of leaking into later homepage mounts.
5. Dead route transition markers and unused canvas data attributes were removed.
6. Footer ownership was moved out of homepage/information styles into one global stylesheet.
7. Splash blur and scale animation layers were removed to reduce Safari compositor load.
8. Content models now expose stable IDs, ordering, and status fields in preparation for the future admin backend.

## Remaining external limitation

The package lock and full production build still need to be generated in an environment with access to the pinned npm packages. The source remains pinned to the approved framework versions and has not been silently downgraded.
