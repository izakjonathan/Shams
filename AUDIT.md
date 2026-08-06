# v2.6.2 visible lower-section reveal audit

- Built from the stable v2.6.1 baseline.
- Removed the blanket iOS WebKit bypass that made the effect invisible on the user’s device.
- Hero and About have no reveal markers and cannot be concealed.
- Server-rendered content remains visible by default.
- Pending classes are assigned in a pre-paint layout effect only to elements below 1.08 visual viewports.
- One IntersectionObserver owns the reveal lifecycle.
- Reveal uses opacity plus a 28 px translate over 760 ms with a maximum five-step stagger.
- Reduced-motion and unsupported browsers receive static visible content.
- Observer, classes, and custom delay values are removed on cleanup.
- No startup scroll guard, initial scrollTo, transform-scaled gradients, or hero blur was restored.
