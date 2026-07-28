# Shams for Humanity — v1.3.2

Mobile-first Next.js festival website. This release refines the programme layout, restores the compact artist list, and introduces consistent fade-only page transitions while retaining placeholder content.

## v1.3.2 — Programme layout and route fades

- Removed programme confirmation and development-status labels.
- Removed the standalone programme time column above each title.
- Shifted programme content left to use the former time-column space.
- Restored the compact text-only artist list used in the earlier baseline.
- Added consistent opacity-only fade-out and fade-in transitions for internal page navigation.
- Removed vertical movement from page opening and closing transitions.
- Preserved the programme filters, developed ticket section, artist pages, splash, menu, gradients, photography, and Safari behavior.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run release:validate
```

## Production configuration

Copy `.env.example` and configure values through Vercel when available. Placeholder content is intentional and indexing remains disabled by default.
