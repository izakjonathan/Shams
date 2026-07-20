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


## v0.1.9
- Global accent changed to `#FCC64F`.
- Added a reusable inline `ArrowIcon` using the supplied SVG geometry.
- Removed iOS tap-highlight/native button flicker from accordion controls.
