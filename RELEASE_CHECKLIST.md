# Release checklist — v1.3.1

## Automated checks

```bash
npm install
npm run release:validate
npm run typecheck
npm run build
```

## Programme

- Verify all filter buttons update the visible schedule.
- Verify keyboard focus remains visible.
- Verify the schedule remains readable on small phones and landscape screens.
- Verify reduced-motion mode removes unnecessary movement.

## Tickets

- Verify sold-out and unavailable actions are disabled.
- Verify available actions show “Tickets soon” when no URL is configured.
- Verify a configured HTTPS ticket URL opens correctly.
- Replace placeholder ticket information later without changing component markup.

## Regression checks

- Splash appears once per tab session.
- Safari loading area retains the approved behavior.
- Mobile menu opens, closes, scrolls, and restores focus.
- Artist cards and artist routes remain functional.
- Information-page close controls return home.
