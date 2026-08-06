# Shams for Humanity regression QA matrix

This matrix documents checks required before a production promotion. It does not claim tests that have not been run.

## Automated source checks

- Release configuration validation
- Static architecture audit
- Theme generation
- Script syntax validation
- CSS brace validation
- ZIP structure and integrity

## Browser checks

| Area | Chrome | Firefox | Safari macOS | Real iPhone Safari |
|---|---:|---:|---:|---:|
| Splash first visit and repeat visit | Required | Required | Required | Required in expanded and collapsed toolbar states |
| Menu open, close, interruption | Required | Required | Required | Required |
| Editorial curtain open/close/switch | Required | Required | Required | Required |
| Legal-page close returns to footer | Required | Required | Required | Required |
| Footer fills final visual viewport | Required | Required | Required | Required during toolbar expansion/collapse |
| Programme filters and empty state | Required | Required | Required | Required |
| Artist external-link announcement | Required | Required | Required | Required with VoiceOver |
| Reduced motion | Required | Required | Required | Required |
| Keyboard focus restoration | Required | Required | Required | External keyboard where available |

## Responsive widths

320, 375, 390, 430, 768, 1024, 1280, and landscape phone orientation.

## Content states

- Long artist title and biography
- Empty programme category
- Sold-out, available, and coming-soon tickets
- Long FAQ answer
- Placeholder and published status
- Missing optional artist links
- Legal page with long wrapped headings

## Admin and database

- Login success/failure and session expiry
- Local read-only mode without `DATABASE_URL`
- Seed into an empty database
- Valid save for every content type
- Rejection of malformed JSON
- Rejection of invalid status, slug, time, category, price, and page structure
- Audit log before/after record
- Migration and rollback rehearsal

## Post-deployment

- Verify Vercel build uses Node 22
- Confirm environment variables
- Confirm indexing remains disabled on preview
- Run public smoke navigation
- Run admin login and one non-production write
- Inspect runtime logs
- Retain the prior ZIP/deployment for rollback
