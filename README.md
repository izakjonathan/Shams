# Shams for Humanity

Next.js event website prepared for deployment on Vercel.

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```

## Current architecture — v0.1.58

- Full-screen splash with one body-owned lifecycle: entering, active, exiting, and complete.
- Paper-colored document canvas during the splash, then a synchronized black `html`, `body`, and runtime `theme-color` after completion.
- Transparent site shell; each visible page section owns its intended paper, yellow, or black background.
- Fixed difference-blend header with no background or backdrop-filter.
- Full-screen black mobile menu mounts only while opening/open/closing, uses one transform animation, blocks local scroll input, and unmounts after closing.
- One centralized gradient system controls hero orbs, paper-section glows, manifesto shapes, and the ticket glow.
- Scroll reveals progressively enhance server-rendered content and are disabled for reduced motion.
- `app/design-system.css` contains shared tokens; `app/globals.css` contains organized component and responsive styles.

Set `NEXT_PUBLIC_SITE_URL` in Vercel to the production domain so canonical, Open Graph, sitemap, and structured-data URLs are correct.
