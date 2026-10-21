# Shams motion specification — 2.10.27 (current)

The source of truth is the implementation in `src/features/site/components` and the associated `src/styles` files. The previous historical review is archived as `docs/MOTION_HISTORY_PRE_2.10.27.md` and should not be used to describe current behavior.

| Component | Current behavior | Reduced motion |
| --- | --- | --- |
| Splash | Once per session, artwork-ready bounded entrance, minimum 420ms hold, short dissolve; no page-image wait | Skipped, site interactive immediately |
| Route curtain | Pathname changes only; bounded cover/reveal; explicit destination top/hash and focus; native browser Back/Forward scroll restoration | CSS transitions near-instant |
| Query-only navigation | Direct Next router push/replace without curtain; preserve scroll unless hash requests a target | Same |
| Same-document anchors | Immediate destination handling, optional smooth scroll and focus | Instant scroll |
| Scroll reveals | One-shot viewport reveal; initial visible content never hidden; MutationObserver enrolls newly mounted descendants within `.routeFade`; keyboard focus reveals immediately | Everything visible, including newly mounted content |
| Gallery | Responsive Next/Image delivery (quality 90); one decoded next frame preloaded while on screen; bounded 3.8s wait per candidate; failed images skipped; old frame retained during crossfade; 4.8s dwell | Playback paused by default, no crossfade; manual navigation and resume available |
| Gallery visibility | No autoplay while the section is off-screen or the tab is hidden; no catch-up burst | Same |
| Gallery controls | Previous, next and pause/resume with centered SVGs | Same |
| Menu | Transform-based open/close with Escape, focus trap, focus restoration | Immediate transitions |
| FAQ/programme | Short local disclosure and filter feedback, without global page transitions | Decorative movement removed |

## Performance and accessibility constraints

- Gallery source originals remain in storage. Next/Image provides width-appropriate optimized delivery; `qualities: [75,90]` in `next.config.ts` enables high-quality gallery derivatives.
- Gallery has at most two visible image layers during a transition; there is no continuous eager three-original image window.
- The decoded-frame handoff does not depend on hidden Next/Image onLoad callbacks. Timed-out candidates are skipped for that attempt; genuine load errors are excluded until the gallery changes; if the optimizer fails, the original URL is attempted as a fallback.
- No global manual `history.scrollRestoration` override. Browser history handles Back/Forward, and the curtain handles only its own forward destination.
- No animation may indefinitely keep the route inert: route watchdog, splash watchdog and menu exit fallback remain.
- Content must remain visible without JavaScript, without IntersectionObserver and when `prefers-reduced-motion` is enabled.
- On a reduced-motion preference change, playback defaults to paused and pending reveals are shown. Users may explicitly resume the gallery.

## Verification

Static audits and TypeScript syntax checks are available in this package. `tests/e2e/mobile-motion.spec.ts` includes updated coverage for autoplay, off-screen suspension, delayed/failed media, live reduced-motion changes, query-only navigation and browser history. A full Next.js build, Playwright execution, iOS Safari performance trace and Blob network transfer measurements still require a fully installed Node 24 environment and deployment access. Do not claim frame-rate or image-transfer improvements without profiling.
