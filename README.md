# Shams for Humanity

Next.js festival website for Shams for Humanity.

## Version

`0.1.49` — strict browser-area reset baseline.

## Development

```bash
npm install --no-package-lock --no-audit --no-fund
npm run dev
npm run lint
npm run build
```

## Deployment

The project uses standard Next.js output and the root-level EventOS-style `vercel.json`:

```json
{
  "framework": "nextjs",
  "installCommand": "npm install --no-package-lock --no-audit --no-fund",
  "buildCommand": "npm run build"
}
```

There is no `outputDirectory`, static export, or `out` folder.


## Design system

Global visual tokens are in `app/design-system.css`. Component and section styling is in `app/globals.css`.


## v0.1.49 — strict browser-area reset

All code intended to influence Safari, browser chrome, safe areas, installed web-app display, toolbar tinting, or overscroll canvas colors has been removed.

Removed:
- explicit Next.js viewport metadata and `viewport-fit=cover`
- the web app manifest/standalone display route
- all `env(safe-area-inset-*)` layout rules
- `svh`/`dvh` browser viewport sizing
- Safari/WebKit-specific toolbar, tint, sampling, and root-canvas handling
- runtime mutations of root/body colors or browser-area classes
- overscroll color controllers and visual viewport listeners

The site now uses ordinary `100vh` sizing, static page backgrounds, and standard fixed header/menu/splash positioning only.


## v0.1.49

Removed the experimental curved yellow top and bottom gradient curtains introduced in v0.1.48. Restored the clean v0.1.47 page layering, header behavior, splash behavior, and full-screen menu without edge overlays.


## v0.1.50 — Minimal yellow browser-edge fades

- Keeps the root browser-adjacent canvas yellow.
- Adds permanent mobile-only top and bottom fades just 14px deep, with only the first 3px fully opaque.
- Keeps the fixed header above the top fade.
- Keeps page content, the full-screen menu and the splash below the fades.
- Changes the mobile menu to yellow with black typography and controls.
- Preserves the existing menu motion and dark-section navigation behaviour outside the open menu.
