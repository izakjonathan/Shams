# Shams for Humanity v2.4.5

Initial-load determinism release built from v2.4.4.

## Changes

- Removed progressive ScrollReveal from the public homepage. Public content now paints in its final visible state with no hydration conceal/reveal cycle.
- Removed the splash scroll runway and every related class, variable, and scroll mutation.
- Splash is fixed to the visual viewport and retains top/bottom artwork bleed plus explicit Safari fallback colour.
- First-session splash loads set manual scroll restoration and top position before hydration; the splash component itself never changes document scroll.
- Existing public design, gradients, menu, route curtain, Safari canvas controller, footer handling, database content source, preview mode, and admin workflows are unchanged.

## Verification

Static architecture, runtime-boundary, release configuration, JavaScript syntax, CSS structure, and ZIP integrity checks pass. A dependency-backed Next.js build could not run in this environment because the configured npm proxy does not contain `@playwright/test@1.62.0`.
