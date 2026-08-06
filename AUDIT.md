# v2.4.6 initial-load determinism audit

The persistent jump was caused by two architecture-level startup mutations: the splash runway changed real document scroll during hydration, and ScrollReveal introduced hidden states after server paint. Both systems are removed rather than retuned. The splash remains fixed and fully covers the visual viewport, while the homepage renders its final content state from the first visible frame.
