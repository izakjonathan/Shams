# v1.6.1 artist transition audit

## Root cause

The site deliberately makes `html` and `body` transparent after the splash screen to improve Safari browser-chrome tinting. v1.6.0 then animated both `::view-transition-old(root)` and `::view-transition-new(root)` toward opacity zero. In Safari, the transparent interval exposed the compositor backing surface, which is black. The transition therefore appeared as a black screen rather than a morph.

A second issue was that the artist portrait was assigned a transition name during home-to-artist and artist-to-home navigation even though it existed on only one side. This created a large one-sided snapshot layer and increased Safari compositor instability without contributing to a true morph.

## Corrections

- Apply an opaque paper canvas only while `artistMorphActive` is present.
- Keep the old root snapshot fully opaque.
- Fade the new root over the old root; never make both transparent.
- Remove scale transforms from root snapshots.
- Remove forced 100% width/height from title pseudo-elements.
- Match the portrait only for artist-to-artist transitions.
- Keep the fixed header in a non-animated named layer.
- Preserve the v1.5.1 menu-style fallback for unsupported browsers and reduced motion.
