# Shams for Humanity — v1.3.1

Mobile-first Next.js festival website. This release develops the programme and ticket experience while retaining placeholder content.

## v1.3.1 — Programme and ticket experience

- Added an interactive programme explorer with category filters.
- Expanded programme entries with stage, category, description, and confirmation status.
- Redesigned the schedule into accessible responsive event rows.
- Added a reusable ticket-section component with tier inclusions, availability states, and placeholder labels.
- Improved ticket-section hierarchy, explanatory copy, disabled states, and external ticket handling.
- Added responsive and reduced-motion behavior for the new components.
- Preserved the approved artist system, splash, menu, gradients, photography, and Safari behavior.

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
