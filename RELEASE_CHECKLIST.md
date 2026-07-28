# Release checklist — v1.6.4

- [x] Version set to 1.6.4
- [x] Mobile-menu transition unchanged
- [x] Information-page black curtain unchanged
- [x] Artist routes avoid browser-native root snapshots
- [x] Artist routes avoid cloning the complete page
- [x] Snapshot includes only visible viewport blocks and overscan
- [x] Snapshot uses an opaque fallback canvas
- [x] Only the selected source title is hidden in the snapshot
- [x] Title morph avoids non-uniform transform stretching
- [x] Fixed header remains above snapshot and floating title
- [x] Destination fonts and layout are stabilized before measurement
- [x] Destination portrait decode has a bounded wait
- [x] Navigation lock has watchdog recovery
- [x] Reduced-motion fallback remains available
- [x] Release validation passes
- [x] Static architecture audit passes
- [ ] Full local typecheck and production build (dependencies unavailable in execution environment)
