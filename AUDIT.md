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
