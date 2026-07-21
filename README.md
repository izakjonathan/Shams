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


## v0.1.19 — iPhone Safari chrome cleanup

- Explicit light backgrounds on both `html` and `body`.
- Light color scheme and `viewport-fit=cover` metadata.
- Matching Apple web-app status-bar metadata.
- Safe-area-aware horizontal layout and footer spacing.
- Vertical overscroll containment where supported.
- A small paper-colored endcap after the footer so translucent browser controls do not sample the dark footer at the end of the page.
