# v1.7.1 release checklist

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

## v1.7.2 typography
- [x] Global semantic heading controls use Agilera.
- [x] Wrapped headings use compact explicit line-height values.
- [x] Legal/information page typography and spacing are standardized.
- [x] Typography stylesheet is imported last to prevent legacy overrides.


## v1.7.4
- [x] Programme displays times 16:00–02:00 instead of 01–08.
- [x] Programme content has stable IDs and explicit editorial ordering for future admin data.
- [x] New supplied splash artwork is packaged locally and rendered full bleed.
- [x] Splash safe-area canvas is transparent and legacy overlays are removed.
