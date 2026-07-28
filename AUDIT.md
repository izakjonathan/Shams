# v1.6.0 transition architecture audit

- Uses one persistent route controller.
- Route feedback begins immediately through a compositor-friendly transform.
- Transition panel matches the mobile menu direction, duration and easing.
- Navigation occurs only after the viewport is covered.
- Destination scroll is positioned before reveal.
- No opacity, scale, blur, horizontal movement or native View Transition wait.
- Interaction lock has bounded cleanup and watchdog recovery.
- Reduced motion bypass is retained.

## v1.6.0 transition audit

- Artist open, close and artist-to-artist routes use a bounded native View Transition lifecycle.
- Route completion is resolved from the committed pathname rather than a guessed timeout.
- Destination scroll is positioned before the new snapshot is released.
- Matched names are applied only to the active artist title and portrait, avoiding duplicate-name failures.
- The site header is isolated as a stable View Transition layer.
- Utility routes and unsupported browsers keep the v1.5.1 menu-panel transition.
- A watchdog skips and releases any stalled native transition.
