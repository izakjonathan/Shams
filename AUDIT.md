# v2.6.1 safe lower-section reveal audit

- Built from the stable v2.6.0 baseline.
- The legacy ScrollReveal implementation remains deleted.
- Hero and About have no reveal markers and cannot be concealed during hydration.
- Server-rendered content is visible by default.
- Only marked lower-page elements can become pending after hydration.
- Elements within 1.35 visual viewports are pre-revealed before concealment is enabled.
- iOS WebKit is deliberately excluded pending dedicated real-device validation.
- Reduced-motion and unsupported browsers receive static visible content.
- One IntersectionObserver owns lower-section reveal lifecycle and is fully disconnected on cleanup.
- No startup scroll guard, initial scrollTo, transform-scaled gradients or hero blur was restored.
