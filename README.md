# Shams for Humanity — v0.1.65

Mobile-first Next.js festival website.

## v0.1.65

- Replaced the Manifesto and Tickets oval glow elements with layered radial backgrounds owned directly by each section.
- Removed obsolete `manifestoShape`, `shapeOne`, `shapeTwo`, and `ticketGlow` markup and CSS.
- Removed obsolete dark-gradient aliases from the design system.
- Kept the gradients filter-free to avoid Safari square-layer flashes.
- Preserved the menu animation, artist links, splash lifecycle, and permanent black root canvas after splash.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
```


## v0.1.65 — Reduced dark-section gradient scale

- Reduced the Manifesto section washes so they remain edge accents rather than covering most of the section.
- Reduced the Tickets top-right wash substantially and tightened the secondary bottom-left wash.
- Preserved section-level, filter-free gradients and soft transparent edges.
