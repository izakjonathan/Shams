# v1.7.0 release checklist

- [x] Artist morph system removed from TSX, CSS and link plumbing
- [x] Editorial curtain used for artist open, close and artist-to-artist navigation
- [x] Utility/information pages use the same coherent curtain system
- [x] Mobile menu implementation left unchanged
- [x] Fixed header remains above route curtain
- [x] No live-page opacity, scale, blur or directional movement
- [x] Route commits only while viewport is fully covered
- [x] Destination scroll is positioned before reveal
- [x] Fonts and stable layout frames awaited before reveal
- [x] `transitionend` lifecycle plus timeout fallback and watchdog
- [x] Duplicate-click lock and internal-route prefetching preserved
- [x] Reduced-motion bypass included
- [x] Static architecture audit updated to reject old morph code
