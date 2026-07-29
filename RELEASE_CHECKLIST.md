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


## v1.7.5
- [x] Programme displays times 16:00–02:00 instead of 01–08.
- [x] Programme content has stable IDs and explicit editorial ordering for future admin data.
- [x] New supplied splash artwork is packaged locally and rendered full bleed.
- [x] Splash safe-area canvas is transparent and legacy overlays are removed.

- [x] Splash artwork is painted on the root document canvas while active.
- [x] Safari top and bottom browser UI can sample the artwork rather than a white fallback.
- [x] The temporary splash canvas is removed for repeat visits and after completion.


## v1.7.8 centralized theme and gradients
- [x] Core palette moved to one editable `app/theme.json` source.
- [x] Theme CSS is generated automatically before dev and build.
- [x] Manifest, Open Graph and global error use the same theme source.
- [x] Gradient colour recipes derive from shared RGB channels.
- [x] All gradient geometry and declarations are centralized in `app/styles/gradients.css`.
- [x] Homepage and artist styles contain no direct gradient declarations.
- [x] Static audit rejects palette duplication and gradient regressions.


## Programme filter rail

- [x] No right-edge white/paper gradient.
- [x] No visible horizontal scrollbar.
- [x] Horizontal touch scrolling remains available.
- [x] Vertical page scrolling does not reveal a filter scrollbar.

## v1.7.8 gradient system

- [x] One global light-gradient control block affects hero and all paper sections.
- [x] One global dark-gradient control block affects all dark sections.
- [x] No section-specific width, height, scale, opacity, or wash recipes remain.
- [x] Hero no longer uses a private radial-gradient definition.
- [x] Static audit passes.
