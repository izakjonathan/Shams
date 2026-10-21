# Shams 2.10.26 — Gallery controls and image fidelity

## Source
Based on `shams-2.10.25-gallery-autoplay-fix.zip`. Retains the prior 2.10.25 autoplay fix, admin fixes, Blob integration and PostgreSQL media compatibility.

## Changes

1. Replaced font glyphs for previous/next/pause/play with SVG icons. Their geometry is centred in a 24×24 viewBox, with a reset flex-centred 38×38 circular button and no font-baseline or native button padding offset.
2. Gallery images use Next.js `Image` with `unoptimized`, so bundled and uploaded gallery images are displayed from their source files without Next.js performing an additional lossy re-encode. This deliberately favours image fidelity over CDN image resizing; original uploads up to 12 MB can consume more bandwidth. Gallery renders only the active and adjacent image layers.
3. For uploads over 8 MB only, browser optimisation now keeps up to 3200px on the longest side and tries WebP quality 0.94, 0.91, then 0.88; accepts only a smaller result within the 12 MB upload cap. Files of 8 MB or less are uploaded unchanged.
4. Added an admin warning for uploaded images whose shorter dimension is under 1200 pixels, including their actual dimensions. This warning does not block uploads or alter content.

## Important image limitation

The user-provided sample photo `IMG_6829.jpeg` is **528 × 753 pixels**. A full-screen display of that source will be visibly soft, regardless of browser or image settings. For crisp results, re-upload a higher-resolution original, ideally at least 1200px on its shorter side and preferably larger for full-screen backgrounds. The change prevents *additional* loss, but cannot reconstruct absent detail.

## Verification

- `node scripts/audit-static.mjs`: passed.
- `node scripts/check-runtime-boundaries.mjs`: passed.
- `node scripts/validate-release.mjs`: passed (only pre-existing optional environment warnings).
- `node scripts/verify-release.mjs`: completed theme generation and three audits; stopped at ESLint because project dependencies are not installed (`eslint: not found`).
- Source regression assertions for SVG buttons, centring, no re-encoding and upload quality passed.
- Full Next.js build, lint, typecheck and iPhone browser validation were **not** completed; dependencies are unavailable in this environment.
- No Vercel deployment was performed.

## Deployment

Deploy the updated project to Vercel, then check the carousel controls and image appearance on iPhone. To improve sharpness of an already low-resolution photo, replace the gallery record with a higher-resolution original in Admin → Gallery and save/publish it.
