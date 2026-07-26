# Shams for Humanity — v0.1.72

Mobile-first Next.js festival website using the App Router, React 19, a local display font, static metadata routes, accessible navigation, and configurable ticket/newsletter integrations.

## v0.1.72 — Repository-wide quality audit

- Moved the site-wide header into the root layout so it is present on the homepage, artist routes, and 404 page.
- Fixed the skip link on every route and made each main landmark programmatically focusable.
- Improved the mobile menu modal model with inert page content, stronger focus containment, keyboard/assistive-technology activation detection, and consistent close labeling through the exit animation.
- Replaced internal route anchors with `next/link` where client navigation and prefetching are beneficial.
- Removed duplicate branding from the homepage document title.
- Added every generated artist route to the sitemap.
- Validated external ticket, newsletter, and site URLs before using them.
- Changed the local font to `display: swap` with a metric-adjusted serif fallback.
- Removed redundant `reactStrictMode` and `X-Frame-Options` controls.
- Improved FAQ ID safety with `useId()` and made collapsed panels inert.
- Reduced the splash hold for users who request reduced motion.
- Added a fixed-header scroll offset for hash navigation.
- Preserved the current visual design, dark-section gradient system, splash-to-black browser canvas, and mobile-menu animation.

See `AUDIT.md` for the full file-by-file review, component quality assessment, researched alternatives, and remaining limitations.

## Configuration

Optional environment variables:

```bash
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_TICKET_URL=https://tickets.example.com/event
NEXT_PUBLIC_NEWSLETTER_FORM_ACTION=https://provider.example.com/subscribe
```

Invalid or unsupported URLs are ignored safely. Ticket and newsletter controls show their existing unavailable states when the corresponding integration is not configured.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
```
