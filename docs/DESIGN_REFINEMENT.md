# Design refinement — 2.10.17

Implemented the user's selected ideas from the 17 October design review.

| Item | Result |
| --- | --- |
| 1 | Date and city accompany the hero title and ticket action. |
| 2 | Larger supporting typography for labels, controls, event details and reading text. |
| 4 | Shared ticket benefits, compact cards and the featured tier first in reading/tab order. |
| 5 | Explicit light/dark/photo header tones; opaque light surface; no blend mode. |
| 6 | Artist name and arrow form one large link, with type/stage shown on mobile. |
| 7 | Stronger programme time/stage hierarchy and readable descriptions. |
| 12 | Programme destination and prominent Tickets action in the menu; grouped event details. |
| 13 | Consistent 44px icon/filter targets, centred FAQ icons and visible keyboard focus. |
| 14 | Content-sized footer with grouped identity, event details and compact links. |
| 15 | One sun-mark arrival, shorter mobile reveals, menu-link arrivals, route curtain and gallery fade; reduced motion retained. |

## Implementation

`useHeaderTone` observes a one-pixel viewport strip behind the header midpoint. It reads geometry only on intersection/resize callbacks, disconnects on route transitions and cleans up on unmount. The public header falls back to readable dark text on an opaque paper surface. Menu-open styling overrides the observed tone. This does not change the black document canvas or theme-color.

The existing shared Hero/About paper glow surface remains intact. No image selection, gradient recipe, general section-spacing system or filter-layout redesign is included. Artist edit links remain separate from public artist links. Ticket availability and configured purchase URLs retain their existing behaviour; common access benefits move to the section intro while tier-specific benefits stay on each card. The static footer audit now checks content sizing and safe-area padding instead of the superseded full-viewport requirement.

## Review and validation

Reviewed component boundaries, serializable props, hook cleanup, stable record keys, DOM/tab ordering, keyboard controls, server content and reduced motion using the React best-practices checklist. No new library, broad client boundary or scroll listener is introduced. See BUILD_VERIFICATION.md for test results and limits.

Research informing the approved review:
- https://designsystem.digital.gov/components/typography/
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://web.dev/articles/animations-guide
- https://web.dev/articles/prefers-reduced-motion
- https://baxterandbailey.co.uk/work/london-soundtrack-festival-website/
