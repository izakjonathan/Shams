# Shams for Humanity v0.1.4

Standard Next.js deployment for Vercel.

Important Vercel settings:
- Framework Preset: Next.js
- Root Directory: blank
- Build Command: default
- Output Directory: blank
- Install Command: default

This version intentionally contains no `vercel.json` and does not override the Next.js output directory.

## Design system

The global visual system is centralized in `app/design-system.css`.

Change the variables in that file first for site-wide updates to:

- display and body typefaces, weights, tracking, and line heights
- core and supporting colors
- borders and radii
- page gutters and section spacing
- shared button dimensions
- transitions and easing
- recurring orb and ticket gradients

`app/globals.css` contains component and page rules that consume these tokens. New styles should use the existing semantic variables instead of introducing repeated hard-coded values. Add a new token only when a value is reused or represents a meaningful design decision.


## v0.1.11
- Global accent changed to `#FCC64F`.
- Added a reusable inline `ArrowIcon` using the supplied SVG geometry.
- Removed iOS tap-highlight/native button flicker from accordion controls.

## v0.1.11

- Reworked FAQ expansion to animate the content height, opacity, and vertical position smoothly without padding jumps.
- Added a global newsletter placeholder color token and darkened the email placeholder.
- Added reduced-motion handling for FAQ transitions.

## v0.1.11

- Removed the decorative hero orbit lines and crossed-square markers.

## v0.1.14 — display-font loading

- Agilera is loaded through `next/font/local` and preloaded by Next.js.
- The display face uses blocking font display, so large headings do not first paint in a sans-serif fallback and then shift.
- The global display-font token remains the single typography control for all decorative headings.


## Scroll reveal

Content after the hero uses a reusable IntersectionObserver-based reveal. Global timing, easing, and distance are controlled by `--duration-reveal`, `--ease-standard`, and `--reveal-distance` in `app/design-system.css`. Reduced-motion preferences are respected.


## v0.1.14 scroll reveal reliability fix
- Defers observer startup for two animation frames so the concealed CSS state is painted before reveal.
- Uses viewport-entry positioning rather than section-area percentage, preventing long mobile sections from revealing before their content is visible.

## v0.1.16 — SEO, accessibility, performance and structure

**Before you deploy:** set `NEXT_PUBLIC_SITE_URL` in the Vercel project's
environment variables to the real production domain. It backs canonical
URLs, Open Graph/Twitter previews, `robots.txt` and `sitemap.xml`. Without
it, those fall back to a placeholder domain.

### Structure
- `page.tsx` is now a server component. Interactive pieces were split into
  their own client components under `app/components/`: `SiteHeader` (nav +
  mobile menu), `FaqAccordion`, `NewsletterForm`, and `ScrollReveal` (the
  IntersectionObserver reveal effect, now renders nothing and runs after
  mount). This cuts the JS that has to hydrate on load — static sections no
  longer ship interactivity they don't use.
- Content (lineup, FAQs, programme, ticket tiers, core event facts) moved
  into a typed `app/lib/content.ts`, the same "single place to edit" pattern
  `design-system.css` already uses for visual tokens.

### SEO
- Full metadata in `layout.tsx`: `metadataBase`, Open Graph, Twitter card,
  keywords, canonical URL.
- JSON-LD `MusicEvent` structured data (date, location, lineup, ticket
  offers) — enables rich results/Google Events listings.
- `app/robots.ts` and `app/sitemap.ts` (Next's metadata-route convention).
- `app/manifest.ts` — installable web app manifest.
- `app/opengraph-image.tsx` — generated share-preview image via `next/og`.
- `app/icon.svg` + `app/apple-icon.png` — previously no favicon existed at
  all.
- Branded `app/not-found.tsx` for 404s (previously the framework default).

### Accessibility
- Decorative elements (hero orbs, manifesto shapes, ticket glow, brand mark)
  now carry `aria-hidden`; before, screen readers announced empty
  presentational `<div>`s.
- The closed mobile menu is now `inert` as well as `aria-hidden`, so its
  links can't steal keyboard focus while off-screen.
- Added a global `:focus-visible` outline for interactive elements that had
  none, plus a proper focus style on the newsletter input (which had
  `outline: 0` and no replacement).
- Added a "Skip to content" link for keyboard users.
- FAQ buttons now use `aria-controls`/`aria-expanded` tied to a real content
  `id`, and the +/− glyph is `aria-hidden`.

### Other
- `next.config.ts` sends baseline security headers (`X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options`) and
  disables the `X-Powered-By` header.
- Newsletter input now has `name`, `autoComplete="email"`, `inputMode`, and
  `required` for better autofill and mobile keyboards.
- All non-form buttons explicitly set `type="button"` so they can't
  accidentally submit a form later.


## v0.1.35 — iPhone Safari chrome cleanup

- Explicit light backgrounds on both `html` and `body`.
- Light color scheme and `viewport-fit=cover` metadata.
- Matching Apple web-app status-bar metadata.
- Safe-area-aware horizontal layout and footer spacing.
- Vertical overscroll containment where supported.
- A small paper-colored endcap after the footer so translucent browser controls do not sample the dark footer at the end of the page.


## v0.1.35

Light sections now use reusable positioned paper-glow layers on top of the existing gradient washes, matching the hero gradient construction while preserving the dark-section effects.


## v0.1.35 gradient cleanup
- Centralized paper, dark, and accent section glow controls around shared width/height/position/transform variables.
- Standardized light-section washes so About, Artists, Programme, and Practical all use the same control structure.
- Increased non-hero gradients on mobile for the paper sections and the manifesto, ticket, and newsletter sections.


## v0.1.35 splash screen
- Added a full-screen launch splash using the provided artwork in `public/images/splash-screen.png`.
- Splash remains visible for a minimum of 1 second and waits for the window `load` event if the page is still loading.
- Splash exit uses a common fade + slight scale + soft blur transition.
- Main site enters underneath with a subtle fade-up and deblur transition.
- Body scroll is locked during the splash, then restored automatically.


## v0.1.35 splash timing refinement
- Added a dedicated splash-in animation with fade, scale, vertical settling, and deblur.
- Increased the fully visible hold to approximately 1.8 seconds after the entrance.
- Slowed the splash-out transition to 1.15 seconds.
- Lengthened and delayed the site entrance slightly so the two animations overlap more naturally.


## v0.1.35 standalone splash viewport
- Made the splash overlay explicitly cover `100dvh`, with `100svh`, `100vh`, and `-webkit-fill-available` fallbacks.
- Added standalone/fullscreen display-mode sizing for installed iPhone web apps.
- Made the artwork wrapper absolute and inherit the full overlay height so it cannot collapse to a content-sized percentage height.
- Preserved safe-area and viewport-fit behavior.


## v0.1.35 animation audit
- Removed the decorative gradient from the solid yellow newsletter section.
- Simplified the splash/site handoff to avoid full-page blur and permanently active transitions.
- Removed the infinite splash artwork drift animation.
- Added visibility and opacity handling to the mobile menu so the closed panel is not kept active.
- Tightened scroll-reveal distance, duration, and stagger for less compositor pressure.
- Reduced-motion users now receive a static splash with a shorter hold and near-instant exit.


## v0.1.35 edge-to-edge mobile Safari
- Removed the artificial cream browser-chrome endcap after the footer.
- Removed vertical Safari safe-area filler so live page content continues beneath translucent browser controls.
- Restored native vertical overscroll/browser-toolbar behavior.
- Retained `viewport-fit=cover` and horizontal safe-area protection for header controls.
- Switched installed iOS web-app status-bar mode to `black-translucent` so the page can extend underneath it.
- Removed the explicit browser `themeColor` override so Safari can derive its translucent treatment from the visible page.


## v0.1.35 Safari edge continuation
- Added a lightweight scroll-boundary controller for Safari rubber-band overscroll.
- Top overscroll now continues the hero paper/yellow gradient treatment.
- Bottom overscroll now remains solid black beyond the footer.
- Footer extends through the bottom safe area in browser and installed web-app modes.


## v0.1.35 Safari top chrome fix
- Added a hero-matched `theme-color` so Safari does not use its default white status/address-bar tint at the top edge.
- The edge-state controller now switches Safari chrome tint between warm hero color at the top, paper in the middle, and black at the bottom.
- Added a fixed top-edge gradient sampling backdrop beneath the page to improve Safari 26 Liquid Glass color sampling.
- Changed the top rubber-band base color from paper to a warm hero-matched tone, while preserving the hero gradient layers.


## v0.1.35 transparent Safari top chrome
- Removed the explicit `theme-color` that produced a solid yellow Safari status-bar band.
- Removed the fixed top sampling backdrop that Safari treated as an opaque chrome color.
- Extended the actual hero canvas into the iOS top safe area while compensating its content spacing.
- Retained the working black bottom overscroll behavior.


## v0.1.35 Safari top-canvas root fix
- Full audit found that iOS Safari ignores root background images in the reserved status-bar canvas and paints only the root background color.
- Changed the top under-page color from yellow to the exact hero paper base.
- Removed the ineffective root gradient image.
- Added a subtle paper veil at the hero's top edge so the page and Safari canvas meet seamlessly.
- Added a matching paper theme color while retaining the proven solid-black bottom boundary.


## v0.1.35 Safari menu canvas fix
- Fixed an iOS Safari race where body scroll locking temporarily collapsed document metrics and incorrectly activated the black bottom overscroll canvas.
- Overscroll detection now ignores locked-menu measurements, validates that the document is scrollable before applying the bottom state, and always lets the top state win contradictory measurements.
- Added visual viewport and explicit viewport-state refresh handling after menu lock/unlock.
- The full-screen mobile menu is now mounted only while opening/open/closing and removed from the DOM after its exit transition, preventing stale black fixed-layer tiles in Safari's top safe area.
- Replaced inline body overflow mutations with centralized `menuScrollLocked` classes on html/body.


## v0.1.35 splash safe-area continuity
- Rebuilt the splash artwork so the top and bottom edges resolve to the exact paper/root canvas color.
- Preserved the central illustration and organic gradients while fading them away before Safari-owned safe areas.
- This lets normal Safari, standalone mode, and installed web-app status areas use a matching flat color without visible seams.
- Kept the existing full-viewport splash sizing and launch animation.


## v0.1.35 structural Safari repair
- Removed `mix-blend-mode` from the fixed header and replaced it with actual surface detection.
- Removed html/body menu scroll locking; the menu overlay now consumes gestures without changing Safari viewport metrics.
- Rebuilt the mobile menu as an opacity-only full-screen layer, with motion limited to its inner content.
- Simplified overscroll control to the bottom edge only; the top always uses the stable paper root canvas.
- Added a stronger edge-safe splash asset with 12% flat paper zones at both ends.
- Extended the splash by the iOS safe-area insets and sized it from the large viewport.
