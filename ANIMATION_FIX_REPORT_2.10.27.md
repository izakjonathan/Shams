# Shams 2.10.27 — Animation hardening implementation report

**Base:** `shams-2.10.26-gallery-quality-icons.zip`. This update changes animation behavior and delivery only. Existing backend, Vercel Blob upload integration, admin zoom fix and gallery icon alignment are retained.

## Resolution of the 10 audit findings

1. **Off-screen autoplay:** Gallery playback is gated by a 15% IntersectionObserver threshold and `document.visibilityState` (through `document.hidden`). Pending handoffs are cancelled when the gallery is hidden. No catch-up animation.
2. **Unloaded/failed slides:** Gallery uses responsive image preloading and `decode()` before committing the next slide. A candidate gets a bounded 3.8s readiness window; failed/slow candidates are skipped for that attempt while the last decoded frame stays visible. Failed optimizer requests try the original media URL. Two layers crossfade briefly; a single image remains if others fail.
3. **Query-only route stall:** Same-path search changes use direct Next.js push/replace without a curtain, so no pathname-dependent reveal can stall.
4. **Back/Forward scroll:** Removed the global `scrollRestoration="manual"` override; browser-native history restoration is used. Curtain-owned navigations still explicitly position their new destinations. Popstate cancels an in-flight curtain. Same-document hash links now preserve their URL/history entries.
5. **Gallery bandwidth:** Next/Image responsive optimized delivery uses high-quality 90 variants and the original files are preserved in storage. One next frame is warmed when visible; at most two gallery DOM image layers remain during crossfades. The original URL is used if optimization fails.
6. **Reduced motion:** Gallery starts paused under `prefers-reduced-motion: reduce` and responds to live changes. Previous/next and explicit resume remain available; CSS disables fades.
7. **Stacked motion:** First-visit splash minimum hold reduced from 640ms to 420ms; content arriving during route curtain is revealed without another below-fold animation.
8. **Dynamic reveals:** MutationObserver scoped to the route content enrolls newly inserted reveal elements; initial and already-visible content remains readable. Cleanup leaves no hidden content.
9. **Tests:** Updated stale artist-link selector and replaced obsolete gallery tests with visible/offscreen, decoded frame, slow/failed image, live reduced-motion, query-only navigation and browser-history checks.
10. **Documentation:** Current `docs/MOTION_REVIEW.md` is a versioned behavior specification; historical notes are archived.

## Checks run

- **Passed:** TypeScript/TSX syntax transpilation for all 123 source and test files.
- **Passed:** `node scripts/audit-static.mjs`.
- **Passed:** `node scripts/check-runtime-boundaries.mjs`.
- **Passed:** `node scripts/validate-release.mjs` (non-blocking environment configuration warnings).
- **Not run:** full Next.js typecheck/build, Playwright browser suite, iPhone Safari performance trace and production Blob/network profiling. Dependencies were not installed in the working environment, and available Node is v22 versus the project's v24 requirement. Syntax transpilation is not full typechecking.

## Deployment notes

No live deployment, GitHub commit, Vercel environment change or database migration was performed. To release, unpack the ZIP, commit the project changes, install dependencies using Node 24, run `npm ci`, `npm run typecheck`, `npm run build`, and `npm run test:e2e`, then deploy via the existing Vercel pipeline. Check autoplay on an actual iPhone, and verify high-resolution Blob photographs in the network panel. Image sharpness is limited by the resolution of the uploaded original.
