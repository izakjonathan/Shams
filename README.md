# Shams for Humanity v1.5.0

Production-oriented Next.js App Router site for Shams for Humanity.

## v1.5.0 — Immediate editorial navigation

The route transition system has been redesigned around a fixed compositor-friendly veil rather than holding a native View Transition open while Next.js waits for a route commit.

- Immediate visual response on every internal navigation
- Shorter close transitions than open transitions
- Destination scroll positioning while fully covered
- Route prefetching on pointer, focus and touch intent
- Stable fixed header above the transition layer
- No blur, directional slide or prolonged DOM lock
- Reduced-motion bypass and bounded watchdog recovery

## Commands

```bash
npm install
npm run typecheck
npm run build
npm run release:check
```
