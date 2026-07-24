# Shams for Humanity

Next.js festival website for Shams for Humanity.

## Version

`0.1.47` — strict browser-area reset baseline.

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


## v0.1.47 — strict browser-area reset

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

## v0.1.48 — curved yellow edge curtains

- Sets the root and body canvas to the festival yellow so mobile browser-adjacent areas remain yellow.
- Adds fixed curved yellow gradient curtains at the top and bottom on mobile.
- Layers page content, the full-screen menu, and the splash beneath both curtains.
- Keeps only the top navigation controls above the top curtain.
- Removes dynamic dark/light header color detection; navigation remains dark on yellow.
- Keeps the curtains decorative and non-interactive with `pointer-events: none`.
