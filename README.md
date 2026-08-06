# Shams for Humanity v2.6.1

Safe lower-section scroll reveal built from the confirmed stable v2.6.0 baseline.

## Included
- Hero and About always render in their final visible state.
- Reveal is limited to selected lower-page content.
- iOS WebKit, reduced-motion users and browsers without IntersectionObserver receive fully visible static content.
- Concealment is applied only after hydration and only to elements safely below the initial viewport.
- No startup scroll manipulation, gradient transform scaling or hero blur was reintroduced.

The public design, stable splash dissolve, gradients, Safari canvas handling, route curtain, menu and admin system remain unchanged.
