# Shams for Humanity — v1.4.2

Mobile-first Next.js festival website using placeholder content, static artist pages, interactive programme filtering, ticket states, information pages, and progressive editorial page transitions.

## Current architecture

- Next.js App Router and React 19
- local Agilera display font through `next/font/local`
- structured content files for artists, programme, tickets, event details and FAQs
- static artist routes with explicit slugs
- shared header, footer, splash and information-page components
- native View Transition API for supported browsers
- coordinated scale-and-opacity fallback for unsupported browsers
- matched artist-title transitions between the lineup and artist pages
- separately timed artist-image transitions
- manual route positioning while destination content is hidden
- reduced-motion bypass and navigation recovery safeguards

## v1.4.2 changes

- upgraded the simple route fade into an editorial transition system
- added distinct artist-open, artist-close, artist-switch, page-open, page-close and page-switch transition types
- added shared artist-title transitions using stable per-artist transition names
- added a separate artist-portrait transition
- kept the fixed header visually stable while page content changes beneath it
- added asymmetric opening and closing timings
- retained the hardened fallback transition from v1.3.4
- retained repeated-click protection, timeout recovery, focus placement and manual scroll restoration
- preserved instant reduced-motion navigation
- avoided blur filters and directional page slides

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run audit:static
npm run build
npm run release:check
```

## Environment variables

Copy `.env.example` to `.env.local` when configuring integrations.

Search indexing remains disabled unless `NEXT_PUBLIC_ALLOW_INDEXING=true` is set with launch-ready public information.

## Transition support

Modern browsers that expose `document.startViewTransition` receive the native editorial transition. Other browsers use the coordinated CSS fallback. Browser-native interactive gestures such as Safari swipe-back remain controlled by the browser; the application does not attempt to replace the operating system’s interactive gesture animation.
