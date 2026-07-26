# Shams for Humanity — v0.1.66

Mobile-first Next.js festival website.

## v0.1.66

- Changed the yellow gradients in the black sections to round, non-elongated circles.
- Updated the Manifesto section gradients from elliptical radial gradients to circular radial gradients.
- Updated the Tickets section gradients from elliptical radial gradients to circular radial gradients.
- Left the light-section gradient system unchanged.

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


## v0.1.66 — Round black-section gradients

- Changed the Manifesto and Tickets radial backgrounds from elongated ellipses to circles.
- Kept the rest of the section systems unchanged.
