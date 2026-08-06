# v2.7.0 gallery integration audit

## Scope
A new event-vibe gallery was added immediately before the Artists section without changing the approved public architecture.

## Stability decisions
- Opacity-only image transitions avoid the transform/blur compositor problems previously isolated on iOS Safari.
- The gallery timer runs only while the section intersects the viewport.
- Background tabs do not advance the carousel.
- Reduced-motion users receive a static image.
- Images are decorative in the visual carousel; descriptive source metadata remains in the typed content layer.

## Asset handling
All 14 supplied JPEG files were converted to WebP with a maximum source dimension of 1800 pixels. The complete gallery asset set is approximately 1.4 MB.

## Preserved systems
Splash, stable gradient geometry, Safari canvas/footer handling, menu, editorial curtain, lower-section reveal, database source switching, Draft Mode, and admin workflows were not modified.
