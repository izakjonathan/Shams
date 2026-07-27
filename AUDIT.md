# Shams for Humanity — repository audit and release history

## Scope

The audit covered all 29 files in the archive, including every line of TypeScript, TSX, CSS, JSON, configuration, documentation, and all four binary/static assets.

Validation included:

- TypeScript/TSX syntax transpilation for all 16 application source files plus `next.config.ts`
- recursive CSS parsing for `globals.css` and `design-system.css`
- duplicate selector and duplicate declaration checks
- custom-property definition/use checks
- JSON parsing
- relative import resolution checks
- route/metadata convention checks
- asset existence, type, dimensions, and reference checks
- keyboard, focus, modal, reduced-motion, and no-JavaScript behavior review
- current Next.js, React, HTML accessibility, MDN, Vercel, and WebKit guidance review

## Executive assessment

The project is now a strong small-event marketing site with good separation between server-rendered content and the limited interactive client components. The current architecture is appropriate for a mostly static festival website. The largest remaining engineering limitation is the absence of a committed dependency lockfile and the inability to complete a dependency-backed production build in this environment.

## Changes made during this audit

### Shared layout and navigation

- Moved `SiteHeader` from the homepage into `app/layout.tsx`.
- The header and mobile menu now work consistently on `/`, `/artists/[slug]`, and the 404 route.
- Converted site-wide and route-to-route navigation to `next/link`.
- Changed mobile-menu hash destinations to absolute home routes (`/#about`, etc.), so they also work from artist pages.
- Added fixed-header `scroll-padding-top` values for mobile and desktop anchor navigation.

### Skip link and landmarks

- Added `id="main-content"` and `tabIndex={-1}` to every rendered `<main>`.
- Added a focus-outline reset only for the programmatically focused main landmark.
- The root skip link now resolves on the homepage, artist pages, and 404 page.

### Mobile menu

- Kept the proven custom fixed overlay rather than introducing a new browser-layout variable.
- Made the active page `<main>` inert for the complete mounted menu lifecycle.
- Made the brand and desktop navigation inert while the menu is mounted.
- Included the visible menu toggle in the focus loop.
- Kept Escape handling, initial keyboard focus, focus restoration, scroll containment, and exit-animation unmounting.
- Detects keyboard and assistive-technology clicks through `MouseEvent.detail === 0`, not only keydown events.
- Keeps the visible label as `Close` until the overlay has fully unmounted.
- Uses `onNavigate` for mobile links so modifier-clicks do not unnecessarily close the menu.

### Metadata and routing

- Corrected the homepage title so the root title template no longer repeats `Shams for Humanity`.
- Added all statically generated artist pages to `sitemap.xml`.
- Retained supported App Router conventions for viewport, manifest, icons, robots, sitemap, and generated Open Graph imagery.
- Kept `viewport-fit=cover` and the intentional paper-to-black runtime theme transition.

### URLs and integrations

- Added one `safeExternalUrl()` validator for site, ticket, and newsletter configuration.
- Only HTTP and HTTPS URLs are accepted.
- Invalid `NEXT_PUBLIC_SITE_URL` values fall back to the production domain.
- Invalid ticket/newsletter URLs now resolve to the existing safe unavailable UI instead of producing malformed links or form actions.
- The CSP newsletter `form-action` origin uses the same validator as the rendered form.

### Typography

- Changed the local Agilera font from `font-display: block` to `swap`.
- Added a Times New Roman fallback and Next.js metric adjustment to reduce invisible text and layout shift.
- Font remains locally hosted and preloaded by `next/font/local`.

### FAQ

- Replaced index-only global IDs with a component-specific `useId()` prefix.
- Collapsed answer regions are now inert as well as `aria-hidden`.
- Replaced the presentational `<i>` element with a named decorative span class.

### Splash and motion

- Kept the established session-aware splash lifecycle and direct root/theme color transition required by the current Safari treatment.
- Reduced the minimum wait for `prefers-reduced-motion` users from 1000 ms to the short repeat-visit hold.
- Kept no-JavaScript recovery styles.

### Configuration and security

- Removed explicit `reactStrictMode: true`; App Router already enables it by default.
- Removed `X-Frame-Options: DENY`; CSP `frame-ancestors 'none'` is the current authoritative frame control.
- Retained CSP, HSTS, permissions, referrer, MIME-sniffing, and powered-by protections.

## Component quality review

### `ArrowIcon.tsx` — Good

- Pure server-compatible presentational SVG.
- Correctly hidden from assistive technology and removed from the tab order.
- The exported artwork contains complex transforms, but only one path and no runtime cost beyond normal SVG rendering.
- Alternative considered: simplifying the path with an SVG optimizer. Not changed because it risks altering the supplied artwork and offers negligible page-level benefit.

### `FaqAccordion.tsx` — Very good after audit

- Native buttons, `aria-expanded`, `aria-controls`, labelled regions, and keyboard behavior come from platform controls.
- `useId()` makes the component safe if reused more than once.
- Closed content is both accessibility-hidden and inert while CSS can still animate its grid row.
- Alternative considered: native `<details>/<summary>`. That would reduce JavaScript but provides less control over the current one-open-at-a-time behavior and animation.

### `NewsletterForm.tsx` — Good, integration-dependent

- Remains a server component with no hydration cost.
- Uses native email validation, autocomplete, labels, disabled states, and direct provider submission.
- External action is validated before enabling the form.
- Remaining provider-specific concern: some mailing providers require a field name other than `email` or additional hidden fields. Configure this when the final provider is selected.
- Alternative considered: a Server Action or internal route handler. That would enable custom success/error UI but adds server processing, anti-spam, and privacy responsibilities that are unnecessary before a provider is chosen.

### `ScrollReveal.tsx` — Good

- Isolates browser-only behavior in one small client component, leaving page content server-rendered.
- Uses IntersectionObserver, reduced-motion fallback, observer cleanup, transition listener cleanup, and temporary `will-change` promotion.
- Does not keep all page content permanently composited.
- Alternative considered: CSS scroll-driven animations. IntersectionObserver remains the more conservative cross-browser choice for this production site.

### `SiteHeader.tsx` — Good, intentionally complex

- Correct opening and closing phases ensure both animations paint.
- Full unmount after closing prevents an invisible fixed layer from affecting Safari.
- Main content, brand, and desktop nav are inert during the modal state.
- Handles pointer, keyboard, assistive activation, Escape, Tab cycling, focus restoration, touch/wheel containment, and reduced-motion fallback timing.
- Alternative considered: native `<dialog>.showModal()`. Native dialog provides built-in top-layer and inert behavior, but changing to it would reintroduce a major full-viewport rendering variable while the site is actively working around current iOS fixed/modal behavior. The custom implementation is justified, but should continue to receive regression testing on VoiceOver and physical keyboards.

### `SplashScreen.tsx` — Good for the chosen visual requirement

- Uses `next/image`, session storage guards, load synchronization, reduced-motion behavior, cleanup, no-JavaScript fallback, and a finite mounted lifecycle.
- Direct `html`, `body`, and theme-color mutation is normally avoidable, but is intentional here because the site requires a paper launch canvas followed by a persistent black browser-adjacent canvas.
- Remaining tradeoff: every new tab receives the full splash once because session storage is tab-scoped.

## Route and server-component review

### `app/layout.tsx` — Very good

- Correct root `html`/`body` structure.
- Uses supported static Metadata and Viewport exports.
- Site header is now truly shared.
- JSON-LD is escaped before inline output.
- Local font is optimized through `next/font/local`.

### `app/page.tsx` — Very good

- Remains a server component despite the page’s interactive islands.
- Content comes from a central typed source.
- Ticket URL is validated before rendering an active purchase link.
- Internal artist routes now use `next/link`.
- FAQ structured data matches rendered FAQ content.

### `app/artists/[slug]/page.tsx` — Good scaffold

- Statically generates known artist routes.
- Uses async Next.js 16 params correctly.
- Has per-artist metadata, canonical URLs, and not-found handling.
- Internal links use `next/link`.
- Remaining product limitation: artist biography/media content is placeholder copy by design.

### `app/not-found.tsx` — Good

- Correct non-indexing metadata.
- Shared header and working skip target now apply.
- Internal return navigation uses `next/link`.

## Data and utility review

### `app/lib/content.ts` — Good

- One typed source for event, artists, FAQ, programme, and ticket data.
- Shared slug function prevents route/link drift.
- Remaining content-model limitation: artist slugs derive from names, so renaming an artist changes the URL. Add explicit stable slugs before artist pages are promoted publicly.

### `app/lib/site.ts` — Very good after audit

- Validates HTTP/HTTPS URLs.
- Removes query/hash from the canonical site root.
- Provides a safe production fallback.
- Shared by metadata, rendered integrations, and CSP configuration.

## CSS review

### `app/design-system.css` — Very good

- All declared custom properties are used.
- Tokens are grouped by purpose and components rely on semantic variables.
- No undefined runtime token was found; the apparent `--font-agilera` reference is generated by `next/font`, while section positioning/reveal variables intentionally use CSS fallbacks or inline values.

### `app/globals.css` — Good for a single-page visual system

- Parses without errors.
- No exact duplicate selectors were found.
- No accidental duplicate declarations were found; the consecutive `overflow: hidden` / `overflow: clip` pair is an intentional compatibility fallback.
- Sections remain clearly numbered and grouped.
- Dark gradients remain filter-free, avoiding the previous Safari square-compositor flash.
- Remaining maintainability tradeoff: the file is large. Splitting component-level rules into CSS Modules would improve local ownership but would also fragment the current centralized visual tuning workflow. Keeping one organized global file is reasonable while the design remains under active cross-section iteration.

## Metadata and static-file review

- `manifest.ts`: valid generated web manifest; SVG supplies scalable app imagery and the 180×180 PNG remains appropriate for Apple metadata.
- `robots.ts`: valid allow-all policy with canonical sitemap URL.
- `sitemap.ts`: now includes homepage and every generated artist page.
- `opengraph-image.tsx`: valid generated 1200×630 image with an explicit edge runtime.
- `icon.svg`: valid scalable icon.
- `apple-icon.png`: valid 180×180 RGB PNG.
- `splash-screen-edge-safe.png`: valid 1320×2868 RGB PNG; large but handled through `next/image` optimization.
- `Agilera.woff`: valid WOFF/CFF font, approximately 106 KiB.

## Configuration review

### `next.config.ts`

- Security headers are centralized and type-safe.
- External newsletter form origin is validated.
- `poweredByHeader: false` remains useful.
- Static CSP is appropriate for preserving static rendering. A nonce-based strict CSP was researched but not adopted because it would force dynamic rendering and complicate the current static deployment.

### `vercel.json`

- Explicit Next.js framework, install, and build commands match the existing deployment workflow.
- Remaining quality limitation: `--no-package-lock` and the absence of a committed lockfile reduce reproducibility. This was not changed because the current environment could not reach the package registry to generate and verify a correct lockfile, and deployment behavior has historically been sensitive in this project.

### `package.json`

- Runtime dependencies are pinned exactly.
- Node and npm engines are explicit.
- Scripts are minimal and accurate.
- Version updated to `0.1.72`.

### `tsconfig.json`

- Strict TypeScript, bundler resolution, isolated modules, and Next plugin settings are appropriate.
- `skipLibCheck` matches common Next.js defaults and keeps third-party declaration noise out of application checks.

## Researched alternatives not adopted

1. **Native `<dialog>` for the menu** — better built-in modal behavior, but a risky change during ongoing iOS full-viewport testing.
2. **Nonce-based strict CSP** — stronger than `unsafe-inline`, but requires per-request dynamic rendering and would give up the current fully static delivery model.
3. **CSS scroll-driven reveal animations** — less JavaScript, but IntersectionObserver remains more conservative across the supported Safari range.
4. **CSS Modules for every section** — stronger component ownership, but less convenient for the current centralized gradient and cross-section design tuning.
5. **Server Action newsletter submission** — better inline success/error states, but unnecessary operational and anti-abuse responsibility before a provider is selected.
6. **Removing the manifest or `viewport-fit=cover`** — not adopted because they remain intentional parts of the installed-app and Safari-edge behavior.

## Remaining limitations

- No dependency lockfile is present.
- Dependency installation timed out in the audit environment, so a real `next build` and full TypeScript module-resolution check could not be completed.
- The newsletter provider’s exact field contract is not yet known.
- Artist pages are intentionally placeholders and should receive stable explicit slugs before launch.
- Current iOS Safari fixed-position behavior should continue to be tested on physical devices after major browser updates.

## Research sources

- Next.js App Router, Metadata, Viewport, Font, Link, CSP, headers, sitemap, robots, icons, and version-16 documentation: https://nextjs.org/docs
- React portal/modal accessibility guidance: https://react.dev/reference/react-dom/createPortal
- MDN dialog, inert, aria-modal, keyboard, and live-region guidance: https://developer.mozilla.org/
- Vercel package-manager and build-configuration guidance: https://vercel.com/docs
- WebKit Safari 26.x release notes and fixed-position bug tracking: https://webkit.org/ and https://bugs.webkit.org/


## v0.1.73 — Splash visual-strength update

- Increased the splash artwork scale to make the central logo figure noticeably larger.
- Added two non-interactive radial gradient overlays to strengthen the existing yellow top-left and bottom-right washes.
- Kept the original PNG unchanged and retained the paper fallback background, session lifecycle, reduced-motion timing, and Safari paper-to-black transition.


## v0.1.74 — Splash session lifecycle

The earlier implementation persisted `shf-splash-seen` in `sessionStorage`, but still intentionally displayed a shortened 200 ms repeat splash. That caused the splash to reappear on route returns and could create a visible hydration flash on full navigations.

The corrected lifecycle uses:
- `sessionStorage` as the page-session source of truth
- a `beforeInteractive` root-layout script that applies `splashSessionSeen` before hydration
- CSS that immediately exposes the site and hides the splash when that class is present
- an in-memory fallback for client-side navigation if storage access fails
- immediate cleanup in the React component with no repeat hold or exit animation


## v0.9.0 — Release-candidate preparation

- Removed the hard-coded placeholder production origin as the metadata fallback.
- Canonical metadata now resolves from `NEXT_PUBLIC_SITE_URL`, then the current Vercel deployment URL, then local development.
- Added explicit opt-in search indexing so preview deployments cannot be indexed accidentally.
- Added a checked-in environment template and a complete v1.0 release checklist.
- Added one release verification command: `npm run release:check`.
- The eventual custom domain remains a deployment configuration task and does not require another architectural rewrite.

## v0.9.1 — Production hardening

- Added `app/error.tsx` for recoverable route/render errors with retry and home actions.
- Added `app/global-error.tsx` as a dependency-light fallback when the root layout itself fails.
- Added `scripts/validate-release.mjs` to detect invalid URLs, unsafe protocols, embedded credentials, missing required release files and unsafe indexing configuration.
- Tightened `safeExternalUrl()` so production integrations require HTTPS while localhost development may use HTTP.
- Stopped noindex preview deployments from advertising a sitemap in `robots.txt`.
- Updated `release:check` so configuration validation runs before type checking and production build.


## v1.0.0 — Stable production baseline

- Promoted the user-confirmed working v0.9.1 release candidate to v1.0.0.
- No visual, routing, animation or integration behavior was changed during promotion.
- Updated package metadata, release validation and documentation to treat 1.0.0 as the current stable baseline.
- The custom domain remains intentionally deferred; Vercel deployment URL fallback and no-index defaults remain active until launch configuration is supplied.

## v1.1.0 implementation audit

### Artist pages
- Replaced the minimal centered placeholder with a full editorial page system.
- Added complete structured artist fields in `app/lib/content/artists.ts`.
- Added accessible placeholder artwork, performance facts, biography, quote, highlights, links and next-artist navigation.
- Placeholder links are rendered as disabled text rather than false working anchors.
- Responsive layouts were reviewed for narrow mobile, tablet and desktop widths.

### Information pages
- Added Privacy, Terms, Accessibility and Contact routes.
- Copy is explicitly marked as draft where organizer, provider or venue facts are not confirmed.
- Privacy text covers controller identity, purpose, data categories, legal bases, retention, recipients, international transfers, user rights and session-storage use.
- Terms text avoids presenting provisional refund or liability wording as final policy.
- Accessibility copy separates current website behavior from venue-dependent commitments.

### Content architecture
- Split the single content file into artists, event, FAQ, programme and tickets modules.
- Kept `app/lib/content.ts` as a compatibility barrel so existing imports remain stable.
- Shared footer moved into the root layout to remove route inconsistency.

### Deferred by request
- Ticket section and provider integration.
- Newsletter provider integration.
- Social and sharing integration.
- Final event details and approved artist assets.


## v1.1.1 implementation note

- Added one reusable `PageCloseButton` component to the four standalone information routes.
- The control uses a Next.js `Link` to `/#top`, remains visible while scrolling, includes an explicit accessible label, and supports keyboard focus and reduced-motion preferences.


## v1.1.2 implementation note

- Added five user-supplied artist photographs as optimized WebP assets.
- Replaced the generated placeholder artwork in the shared artist template with responsive `next/image` media.
- Added per-artist crop positioning and descriptive alternative text.
- Added each artist image to route-specific Open Graph metadata.
- The first group photograph is intentionally reused for the sixth Community Choir route because the content model contains six artists and five source images were supplied.


## v1.1.3 implementation note

- Added `font-family: var(--font-display)` to `.artistHeroCopy h1`, applying the bundled Agilera font to all artist names while leaving supporting copy in the existing body typeface.

## v1.1.4 — Full cleanup pass

### Repository hygiene

- Removed `tsconfig.tsbuildinfo`, which is generated locally and should not be distributed.
- Added `.gitignore` coverage for dependencies, Next.js output, TypeScript caches, local environment files, logs and operating-system metadata.
- Removed the obsolete `app/lib/content.ts` compatibility barrel. Existing imports now resolve directly through `app/lib/content/index.ts`.

### Content and routing

- Added explicit immutable slugs to every artist record.
- Removed runtime slug generation from artist names, preventing future editorial name changes from silently changing public URLs.
- Added `dynamicParams = false` to the artist route so unknown slugs are not generated dynamically.
- Updated homepage links, metadata, static parameters, next-artist navigation and sitemap entries to use the canonical stored slugs.
- Marked artist records, links, biographies, highlights and information-page sections as readonly data.

### Shared utilities

- Consolidated the duplicated structured-data escaping logic into `serializeJsonLd()` in `app/lib/site.ts`.
- Both MusicEvent and FAQ structured data now use the same serializer.

### Styling and behavior

- Removed stale legacy wording from current gradient-system comments.
- No approved layout, typography, photography, animation, menu, splash, Safari canvas or information-page behavior was changed.
