# Shams for Humanity — v0.1.70

Mobile-first Next.js festival website.

## v0.1.70 — Larger dark glows and hotspot cleanup

- Removed the legacy built-in dark-section background-image gradients from Manifesto and Tickets.
- Removed the two small extra dark glow layers from each black section.
- Increased the radius of the remaining dark-section glow in both Manifesto and Tickets.
- Softened the remaining dark glow with a more gradual radial fade.
- Kept the light-section gradient system unchanged.


## v0.1.69 — Layered dark-section glows

- Rebuilt Manifesto and Tickets with the same layered visual method used by the white sections.
- Each black section now combines three subtle section washes with three separate circular glow layers.
- Dark glows use lower opacity tuned for black backgrounds.
- All dark glow layers remain round, filter-free, and clipped by the section rather than blurred by the compositor.
- Preserved the existing menu, splash, artist pages, and browser tint behavior.


## v0.1.68 — Softer dark-section gradients

- Softened the round yellow gradients in Manifesto and Tickets.
- Reduced centre intensity and added more gradual intermediate opacity stops.
- Extended each fade smoothly to full transparency at 100%.
- Kept the existing round dimensions and section-level, filter-free rendering.


## v0.1.67

- Fixed invalid percentage-radius `circle` gradients that caused Safari to drop the entire dark-section background image.
- Replaced them with valid equal-radius ellipses (`ellipse X% X%`), which render as true circles.
- Restored the Manifesto and Tickets yellow gradients.

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
