# Repository audit — v0.1.59

Audit date: 26 July 2026

## Scope

Every file in the archive was inspected. All lines in TypeScript, TSX, CSS, JSON, Markdown, and SVG were reviewed. Binary assets were checked for type, dimensions, size, and active references.

## Changes made

1. Removed an older desktop gradient/orb block that duplicated and contradicted the later centralized gradient system.
2. Added complete cleanup for scroll-reveal classes in reduced-motion and IntersectionObserver-fallback paths.
3. Added mobile-menu focus management, focus return, Escape handling, Tab containment, dialog semantics, and scroll blocking through the whole closing phase.
4. Removed non-functional artist buttons; their arrows are now explicitly decorative.
5. Removed placeholder `href="#"` footer links; unavailable destinations are non-interactive text.
6. Made ticket and newsletter controls configuration-driven instead of silently doing nothing.
7. Added one normalized site-origin helper and removed three duplicate URL implementations.
8. Removed volatile `new Date()` sitemap output that falsely changed on every generation.
9. Escaped `<` in JSON-LD serialization as a defensive script-embedding measure.
10. Renamed the misleading `lint` script to `typecheck`.
11. Updated documentation to match only the active architecture.

## File-by-file result

### Root files

- `package.json`: valid; exact production framework versions; type-check script accurately named. No lockfile is present because registry access was unavailable during this audit.
- `tsconfig.json`: strict App Router-compatible configuration; no contradictory compiler flags found.
- `next.config.ts`: security headers are active for every route. A CSP remains an optional future hardening step.
- `vercel.json`: valid and minimal. The custom install command remains because it is part of the established deployment baseline, but reproducibility would improve with a committed lockfile and `npm ci`.
- `next-env.d.ts`: standard generated Next.js declaration file; intentionally not edited.
- `README.md`: rewritten to describe the current code only.

### App shell and metadata

- `app/layout.tsx`: viewport and metadata use supported App Router exports. Structured data is derived from central content and safely serialized.
- `app/robots.ts`: valid metadata route using the shared normalized origin.
- `app/sitemap.ts`: valid metadata route; volatile generation-time modification date removed.
- `app/icon.svg` and `app/apple-icon.png`: active Next.js metadata-convention assets.
- `app/opengraph-image.tsx`: active dynamic Open Graph image route; no unused imports or unreachable styles.
- `app/not-found.tsx`: active App Router not-found page with non-indexing metadata.

### Page and content

- `app/page.tsx`: all imported components and content collections are used. Dead artist controls and fake footer links were removed. Ticket CTA behavior is now explicit when checkout is not configured.
- `app/lib/content.ts`: central data source; date display duplication reduced with `numericDate` and `timeRange`.
- `app/lib/site.ts`: single normalized public-origin source for metadata routes and structured data.

### Client components

- `SiteHeader.tsx`: menu state machine has one opening path, one closing path, one fallback timer, focus containment, Escape support, focus restoration, local pointer/keyboard scroll blocking, and full unmount on close.
- `SplashScreen.tsx`: one owner for splash classes, canvas colors, and runtime theme-color. No competing browser-tint controller exists.
- `ScrollReveal.tsx`: one observer, one reveal-class system, and complete cleanup in every branch.
- `FaqAccordion.tsx`: button/region relationships are explicit and closed answers are hidden from accessibility APIs.
- `NewsletterForm.tsx`: server-rendered and configuration-driven; no client bundle or no-op submit handler remains.
- `ArrowIcon.tsx`: shared decorative SVG; all usages valid.

### CSS

- `app/design-system.css`: every declared token is used. No undefined static token references were found; remaining dynamic variables are intentionally supplied by component selectors or runtime inline styles.
- `app/globals.css`: parsed without errors. No obsolete tint sentinels, safe-area rules, visual-viewport listeners, backdrop-filter sampling exclusions, duplicate gradient implementation, or unused classes remain.

### Assets

- `public/fonts/Agilera.woff`: actively loaded by `next/font/local`.
- `public/images/splash-screen-edge-safe.png`: actively loaded by `next/image`; 1320×2868 RGB PNG, approximately 875 KB.

## Researched implementation choices

### Viewport and metadata

The static `viewport` export is the current Next.js App Router API for width, scale, viewport fit, and theme color. The existing implementation follows that API. Generated `robots.ts`, `sitemap.ts`, icons, and Open Graph image files also follow current metadata file conventions.

### Menu implementation

A native modal `<dialog>` is the standards-first alternative because `showModal()` provides top-layer placement, modal inertness, and focus behavior. It was not adopted here because the current project is specifically testing iOS Safari fixed/fullscreen behavior, and WebKit has had active iOS 26 reports involving full-viewport fixed/dialog painting. The custom overlay therefore remains, but now implements the missing keyboard and focus behavior explicitly.

### Safari fixed viewport behavior

WebKit reports confirm that iOS 26 introduced fixed-position and viewport-sized container problems. Safari 26.1 fixed one bottom-gap case, while later reports still describe intermittent bottom-fixed painting issues. Because of that, the code deliberately avoids visualViewport-driven correction loops, body-position locking, and stacked browser-tint heuristics. The root canvas plus mounted-only menu remains the least complicated testable baseline.

### Scroll locking

`body { overflow: hidden }` has a long history of inconsistent iOS behavior. The current menu leaves the root scroller untouched and prevents touch/wheel/scroll-key input only while the overlay exists. The tradeoff is more JavaScript than a body class, but fewer root viewport mutations.

### CSS organization

CSS Modules are a valid alternative supported by Next.js and would provide local selector scoping. For this single-page design, keeping one organized global stylesheet avoids splitting tightly coupled responsive and gradient systems across many files. If the site gains routes or reusable feature modules, moving component styles to CSS Modules would be the next maintainability step.

### Font loading

`next/font/local` is the correct optimized local-font path. `display: block` intentionally prioritizes avoiding a visible fallback-font flash; the tradeoff is a short invisible text period. `swap` is the performance-oriented alternative but would reintroduce the font change the project previously sought to avoid.

## Remaining intentional limitations

- Ticket checkout requires `NEXT_PUBLIC_TICKET_URL`.
- Newsletter submission requires `NEXT_PUBLIC_NEWSLETTER_FORM_ACTION`.
- Social/contact destinations are intentionally non-interactive until real URLs are supplied.
- No `package-lock.json` could be generated because the package registry timed out. A lockfile plus `npm ci` is the main remaining reproducibility improvement.
- Device testing in actual Safari 26.x is still required; static analysis cannot reproduce browser-chrome heuristics.

## v0.1.60 targeted corrections

- The menu previously applied `.isOpen` during both `opening` and `open`. Because the element mounted with its final transform already applied, there was no rendered start state and therefore no entrance transition. `.isOpen` is now applied only after two animation frames.
- Large `filter: blur(...)` layers on the Manifesto and Tickets sections were removed. Their softness is now encoded in the radial-gradient stops, preventing a transient rectangular compositor layer on WebKit while preserving a diffuse yellow glow.
- Artist controls were restored as semantic links using stable name-derived slugs. Their destination pages are intentionally planned for a later version.


## v0.1.61 follow-up

The dark-section gradient edge was traced to CSS radial-gradient geometry: implicit `farthest-corner` sizing left non-zero alpha at the side boundary of the circular element. The gradients now use explicit 50% radii and become transparent before the element edge. No blur filter was reintroduced.

## v0.1.63

- Removed pointer-triggered programmatic focus from the mobile menu lifecycle, preventing persistent focus outlines after touch open/close while retaining keyboard focus management.
- Changed Manifesto and Tickets glows to the same solid-centre yellow radial-gradient construction used by the light sections.

## v0.1.65 dark-section gradient correction

The Manifesto and Tickets gradients previously used oversized, border-radius-clipped oval elements whose centres were positioned outside the viewport. Their alpha was also multiplied by element opacity before compositing over black, which produced dull cropped spotlight shapes.

The decorative elements and their geometry variables have been removed. Both dark sections now use layered, filter-free radial gradients directly on the section background. Each gradient reaches transparency within its own interpolation range, so there is no element edge to clip and no blurred compositor layer to flash as a square.


## v0.1.65 — Reduced dark-section gradient scale

- Reduced the Manifesto section washes so they remain edge accents rather than covering most of the section.
- Reduced the Tickets top-right wash substantially and tightened the secondary bottom-left wash.
- Preserved section-level, filter-free gradients and soft transparent edges.


## v0.1.66 — Round black-section gradients

Root cause: the visible elongated shapes in the black sections came from the direct section backgrounds on `.manifesto` and `.tickets`. Those backgrounds were still defined with `radial-gradient(ellipse …)`, so the final rendered shapes were oval even though other recent gradient work had targeted different section systems.

Correction applied:
- changed `.manifesto` background gradients from `ellipse` to `circle`
- changed `.tickets` background gradients from `ellipse` to `circle`
- kept the existing color stops, opacity balances, and placement logic
- left the light-section paper-glow system unchanged


## v0.1.67 — Restore circular dark gradients

The v0.1.66 syntax used percentage radii with the `circle` keyword, for example `radial-gradient(circle 38% at …)`. CSS only permits an explicit circle radius as a length, not a percentage, so Safari rejected the full `background-image` declaration. The gradients are now expressed as equal-radius ellipses (`ellipse 38% 38%`), which are valid CSS and visually circular.


## v0.1.68 — Softer, more diffused dark gradients

The round geometry from v0.1.67 was retained. The visible harshness came from high-opacity centres and relatively abrupt transitions through the middle of each radial gradient. The Manifesto and Tickets gradients now use lower centre opacity, additional intermediate stops, and a gradual fade to full transparency at 100%, without blur filters or enlarged geometry.


## v0.1.69 — Layered dark-section glows

The black sections previously used only two isolated section-level radial backgrounds, while the white sections used three section washes plus three overlapping decorative glow elements. This structural mismatch made the dark gradients read as defined spotlights rather than soft atmospheric washes.

Correction applied:
- added three subtle background washes to both `.manifesto` and `.tickets`
- added three reusable `.darkGlow` layers to each dark section
- kept every dark glow circular by using equal width and height
- used lower opacity than the paper-section glows to compensate for yellow compositing over black
- avoided `filter: blur()` to prevent the earlier Safari rectangular compositor flash
- ensured section content remains above all decorative layers via one shared stacking rule
