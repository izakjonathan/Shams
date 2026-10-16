# Mobile motion review — 2.10.8

Research and code review: 16 October 2026. This release builds on 2.10.7 and retains the black browser theme/canvas, colour system, typography and public/admin functionality.

## Research and design decisions

The sources below are primary browser/platform guidance and W3C accessibility material. The exact timings in this release are design choices for this site, not numbers prescribed by these sources.

1. **Rendering cost.** [Chrome/web.dev: high-performance CSS animations](https://web.dev/articles/animations-guide) recommends keeping animation on the compositing stage where possible, favouring transform and opacity, and using `will-change` sparingly. This release removes animated underline geometry, hover padding changes and portrait filter transitions. The menu and route curtain only request transform layers while mounted. No perpetual background motion, scroll hijacking or animation framework was added.
2. **Motion preferences.** [WebKit: Responsive Design for Motion](https://webkit.org/blog/7551/responsive-design-for-motion/) describes scaling, spinning and parallax as possible vestibular triggers and demonstrates responding to preference changes in JavaScript as well as CSS. This release uses small translations, no parallax or looping zoom, and updates the splash, reveal controller and gallery when Reduce Motion changes during a visit.
3. **Interaction animation.** [W3C: WCAG 2.3.3, Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) explains disabling nonessential interaction-triggered motion. Reduced motion removes decorative entrances and movement while keeping menus, filters, FAQ expansion and navigation functional. This criterion is Level AAA; this review is not a claim of whole-site WCAG conformance.
4. **Automatic motion.** [W3C: WCAG 2.2.2, Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) covers automatically started moving content presented alongside other content. The gallery retains its explicit pause/resume control and stops its interval when off screen, in a hidden tab, under Reduce Motion or while hovered with a mouse. Focusing the gallery's editorial link also pauses it. The pause button itself remains a direct toggle. A still-image counter communicates position without a looping progress animation.
5. **Visibility detection.** [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) provides asynchronous observation of visibility without continuous scroll measurements. One shared reveal observer reveals marked content once; a separate observer controls gallery playback. Observed elements are unobserved after arrival, and both controllers clean up subscriptions.
6. **Responsiveness.** [Chrome/web.dev: Optimize Interaction to Next Paint](https://web.dev/articles/optimize-inp) explains input delay and main-thread work. UI state changes remain immediate. The splash no longer waits for every asset's window-load event, fonts have bounded waits, and a route starts warming while the cover animates. No measured INP improvement is claimed without field data.

## Audit and changes

| Area | Previous behaviour / issue | Release behaviour |
| --- | --- | --- |
| Splash | 520ms entrance allowance + 1100ms hold + 700ms exit; full window load could delay interaction | Minimum 640ms artwork display, then 420ms dissolve once the artwork is ready; 2s artwork watchdog and bounded 800ms font wait. Repeat visits and Reduce Motion skip it. Cleanup guards prevent late async work after exit/unmount. |
| Hero | Static title | Short, staggered entrances for the existing title lines when the splash dissolves or the home page returns. Server HTML stays readable; CTA remains available. |
| Route curtain | About 500–550ms per leg on phones | 260–320ms per leg on phones; 300–380ms on wider screens. Cover/reveal state machine, arrival positioning and watchdog retained. Background content becomes inert while covered; focus returns to the actual main-content target. |
| Scroll reveals | 28px / 760ms movement; global index-based delays; entire artist/ticket groups hidden together | 16px / 520ms on mobile, 22px / 620ms on wider screens. Delays use only the current arrival batch and stop at 80ms. Individual artist rows, cards and FAQ rows arrive separately. Content at initial/restored viewport is already visible. |
| Keyboard / fallback | Focus could reach an element awaiting its reveal; preference sampled only on mount | Focus reveals an element immediately. Changing Reduce Motion reveals all remaining content and disconnects the observer. No observer or no JavaScript leaves content visible. |
| Menu | Whole panel only, 550ms; Unicode plus could render as a missing glyph | 360ms panel on mobile / 420ms on desktop. A short capped link sequence follows. A CSS-drawn plus rotates to a cross. Escape, focus trap and restoration retained. |
| Gallery | All 14 overlapping image layers mounted; 3.6s cadence; 900ms fade; live preference changes not subscribed | At most three slides mounted, lazy images, next image must finish loading before advancing, 4.8s cadence, 600ms crossfade. Playback intervals stop outside the visible page. Stable small-viewport height avoids resizing when mobile toolbars move. |
| FAQ | Plus/minus text swapped abruptly; long disclosure duration | Stable CSS plus/minus icon, 280ms disclosure and short content fade. Grid disclosure still intentionally changes layout for natural text flow; it is scoped to the interacted row. |
| Programme | Results changed abruptly; filter controls inside a moving reveal group | Controls remain stationary. Newly filtered result lists have a short 8px entrance with a capped 105ms stagger. The programme section now has its intended anchor ID. |
| Small interactions | Underlines animated `right`; hover changed padding and large-image filters | Underlines scale, arrows nudge on fine pointers, buttons have short press feedback. Hover movement is gated away from touch devices. Sold-out ticket dimming remains intact through reveal and reduced-motion states. |

## Motion limits

- No continuously running decorative animation, perpetual gradients, cursor followers, magnetic controls, pinned scrolling or scroll-linked layout changes.
- No animated blur or large-image filter transitions. Existing static gradient artwork and static portrait filtering remain.
- No persistent `will-change` on the reveal collection or gallery slides.
- Read all initial reveal geometry before applying style changes; no scroll-event handlers in the motion controller.
- CSS enhancements require `prefers-reduced-motion: no-preference`. The global reduced-motion rules also cover existing interactions.
- Paint cost is not zero: opacity blending large photographs still consumes compositor bandwidth. The three-slide window limits concurrent page layers; the browser owns its decoded-image cache, so this is not a claim that image memory is capped at exactly three images.

## Verification

See `BUILD_VERIFICATION.md` and `docs/testing.md` for the final checks and environment limitations. Automated browser tests cover a fresh/repeated splash, bounded startup, live motion preferences, gallery playback/pause, keyboard visibility, observer fallback, filters, FAQ, route return positions, menus and narrow-screen overflow.

A physical iPhone remains the final check for native toolbar tint, GPU memory, refresh rate and touch feel. Browser emulation can test layout and behaviour but cannot establish device battery life, sustained frame rate or the exact Safari chrome appearance.
