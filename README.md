# Shams for Humanity

Next.js event website prepared for deployment on Vercel.

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run typecheck
npm run build
```

## Environment variables

- `NEXT_PUBLIC_SITE_URL` — canonical production origin, without a trailing slash.
- `NEXT_PUBLIC_TICKET_URL` — ticket checkout URL. Available tiers show a disabled “Tickets soon” control until configured.
- `NEXT_PUBLIC_NEWSLETTER_FORM_ACTION` — newsletter provider form endpoint. The form remains visibly disabled until configured.

## Current architecture — v0.1.59

- Full-screen splash with one lifecycle owner and a paper-to-black root-canvas transition.
- Transparent site shell; visible sections own their paper, yellow, or black surfaces.
- Fixed difference-blend header with no background or backdrop filter.
- Full-screen mobile navigation mounts only for opening/open/closing, traps focus, supports Escape, locally blocks scroll input, and unmounts after closing.
- One gradient system controls hero orbs, paper-section glows, manifesto shapes, and ticket glow.
- Scroll reveals progressively enhance server-rendered content and clean up correctly in reduced-motion and fallback environments.
- Shared public origin logic lives in `app/lib/site.ts`.
- `app/design-system.css` contains tokens; `app/globals.css` contains organized global/component/responsive rules.

See `AUDIT.md` for the repository-wide audit and researched alternatives.
