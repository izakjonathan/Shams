# v2.1.2 full animation and runtime audit

## Scope

Audited 115 project files and approximately 7,750 lines across the public frontend, admin foundation, content repositories, database layer, CSS, release scripts, viewport handling and animation controllers. The review focused on execution cost, lifecycle overlap, stale code, Safari viewport behaviour, fallback timing, cleanup safety and CSS/JavaScript coordination.

## Research conclusions applied

- `visualViewport` is the correct browser API for changes to the visible viewport caused by mobile browser chrome; layout-viewport values alone are not stable during toolbar movement.
- Safari 26 introduced and later fixed several viewport-sized fixed-container and bottom-gap defects, but fixed/sticky edge elements and native toolbar compositing still require defensive page-canvas handling.
- Next.js App Router supports `scroll: false` and manual route prefetching, which remain the correct foundation for the editorial curtain.
- Compositor-friendly animations should stay on opacity and transform, with `will-change` applied only while the animated element exists or is actively moving.

## Contradictions and stale code found

1. Route transition state was duplicated in React and on global `<html>` data attributes. This unnecessarily coupled the curtain to unrelated root-level Safari state.
2. Route, menu and splash fallback durations were duplicated as JavaScript constants and CSS variables, making timing drift likely.
3. Route timeout IDs accumulated in an array even after firing.
4. `transitionKindRef` was assigned but never read.
5. The canvas controller scheduled two animation frames for every scroll/resize event and ran on engines that do not need the iOS WebKit workaround.
6. The canvas cleanup removed direct colours but could leave the inherited custom property at the previous dark value.
7. `AppShell` still cleaned obsolete splash class names that no longer existed and did not clean every current state.
8. The splash had three separate hand-written double-rAF sequences.
9. The menu had another independent double-rAF sequence and a hard-coded fallback timeout.
10. `scripts/audit-static.mjs` performed its fatal error check before later typed-content and admin checks, allowing failures in the lower part of the audit to be reported after an earlier pass boundary.
11. The audit used a broad `lib/content` string search that incorrectly matched the valid admin module `lib/content-admin`.
12. A stale `tsconfig.tsbuildinfo` build artifact was included in the release archive.
13. Motion durations were longer than necessary for repeated navigation and content reveals.

## Changes implemented

### Shared motion utilities

Added `app/lib/motion.ts` with:

- `prefersReducedMotion()`
- `cssTimeMs()`
- `afterPaint()`

Splash, menu and route curtain now share the same paint scheduling and read fallback durations from the CSS design tokens.

### Editorial curtain

- Removed global root dataset mutation.
- Scoped route phase and transition kind to the mounted live-route and curtain elements.
- Removed the unused transition-kind ref.
- Converted timer storage from an accumulating array to a self-cleaning `Set`.
- Fallback timers now derive from CSS duration variables with a small recovery buffer.
- Kept `transitionend` as the primary lifecycle signal.
- Preserved conditional mounting, fixed-header stability, scroll positioning and the 4.2-second final watchdog.

### Safari document canvas

- Dynamic sampling now runs only on iOS WebKit, eliminating scroll work on desktop and non-iOS engines.
- One animation frame is scheduled per event burst, followed by one 90 ms settled sample after toolbar movement.
- Removed the old untracked double-rAF scheduling.
- Sampling uses visual-viewport width and height.
- Invalid samples retain the last valid colour.
- True document-bottom black forcing remains.
- Cleanup now explicitly restores paper on both root and body.

### Splash

- Shared `afterPaint()` replaces three separate double-rAF implementations.
- JavaScript reads splash entry/exit durations from the CSS motion tokens.
- Session key updated to `shf-splash-seen-v2.1.2`.
- Entry/hold/exit sequence shortened while preserving the safe opaque handoff:
  - entry: 520 ms
  - minimum hold: 1,100 ms
  - exit: 700 ms
- Existing runway, image bleed, explicit sampled root colour, inert shell and two-painted-frame handoff remain.

### Mobile menu

- Uses shared paint scheduling.
- Fallback timing derives from `--duration-menu`.
- Uses `translate3d`, backface isolation and `will-change` only while conditionally mounted.

### Scroll reveals and micro-interactions

- Reveal duration reduced from 860 ms to 700 ms.
- Stagger reduced from 55 ms to 40 ms.
- Reveal distances reduced to 16 px and 10 px.
- Fast and medium interaction tokens reduced to 240 ms and 420 ms.
- Existing per-item temporary `will-change` cleanup remains.

### Release tooling

- Fixed the static audit ordering so every check runs before the final pass/fail decision.
- Narrowed the legacy content-import test so valid `content-admin` imports do not cause false failures.
- Added checks for shared motion helpers, local curtain state, CSS-derived durations, iOS-only canvas sampling, obsolete AppShell states and old double-rAF scheduling.
- Removed stale `tsconfig.tsbuildinfo`.

## Validation

Passed:

- release configuration validation
- strengthened static architecture audit
- JavaScript syntax checks for all release scripts
- CSS brace validation
- ZIP integrity validation

Not completed:

- dependency-backed TypeScript validation
- Next.js production build
- live PostgreSQL migration

The environment has no `node_modules` or package lock. Global TypeScript confirms parsing begins but cannot resolve Next.js, React, Drizzle or Node declarations without installed dependencies. The pinned `@types/node@22.0.0` package remains unavailable through the internal registry used in earlier attempts.
