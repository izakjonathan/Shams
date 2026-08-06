# v2.7.1 reveal and gallery cadence audit

- Confirmed hero has no reveal markers.
- Confirmed About is the first section with reveal markers.
- Confirmed initial pre-reveal threshold is below one visual viewport.
- Confirmed one IntersectionObserver remains the sole reveal owner.
- Confirmed gallery remains opacity-only and visibility-aware.
- Confirmed gallery cadence is 3600 ms with a 900 ms crossfade.
- Confirmed reduced-motion users receive static visible content.
- Confirmed no startup scroll manipulation, gradient transforms, or hero blur were restored.
