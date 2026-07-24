# Shams for Humanity

Next.js event website prepared for deployment on Vercel.

## Run locally

```bash
npm install
npm run dev
```

## Production check

```bash
npm run lint
npm run build
```

## v0.1.51

This version restores the menu and browser-edge behavior from the uploaded original `v0.1.4` build while retaining the newer site content and components.

- Black full-screen mobile menu, permanently mounted and animated with `translateY` only.
- Difference-blended white header above the menu.
- Paper-colored `html` and `body` backgrounds.
- Paper-colored viewport theme setting from the original build.
- Original body overflow lock while the menu is open.
- No edge gradients, yellow browser canvas, tint sentinels, overscroll controllers, safe-area adjustments, fixed-element sampling filters, menu opacity transitions, closing timers, delayed unmounting, dark-section detector, or custom touch/wheel/keyboard blockers.
