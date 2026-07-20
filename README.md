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
