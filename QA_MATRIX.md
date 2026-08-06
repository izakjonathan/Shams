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

## v2.2.0 automation mapping

| Requirement | Automated project | Remaining manual evidence |
|---|---|---|
| Splash first/repeat visit | Chromium + mobile WebKit | Real iPhone toolbar states |
| Mobile menu lifecycle | Mobile WebKit | Real-device interruption and rotation |
| Artist open/close curtain | Chromium + mobile WebKit | Swipe-back consistency on iPhone |
| Legal-page footer return | Chromium + mobile WebKit | Expanded/collapsed Safari toolbar |
| Programme filters | Chromium + mobile WebKit | Long translated content |
| Reduced motion | Chromium + mobile WebKit | iOS system setting |
| Contact mail links | Chromium + mobile WebKit | Installed mail-client handoff |
| Admin route isolation | Chromium + mobile WebKit | Configured credentials and database writes |
| Approved visual surfaces | Opt-in Chromium screenshots | Safari font and compositor rendering |

## v2.3.0 admin publishing workflow

Requires a configured preview database and admin credentials:

- Seed records and confirm the audit log records the seed.
- Open a record, edit it in a second session, then confirm the stale first session is rejected.
- Confirm duplicate slugs are rejected within the same content type.
- Save, publish, move to draft, and archive each record type.
- Confirm protected record previews require authentication.
- Confirm FAQ and information-page list links stay inside `/admin/faqs` and `/admin/pages`.


## v2.4.0 database public content

- Local source renders canonical content.
- Database source renders published records only.
- Draft records remain hidden outside authenticated preview.
- Preview banner appears and exit disables Draft Mode.
- Publishing invalidates the relevant content cache tag.
- Error and local-fallback policies behave as configured.
- Public layout, splash, curtain, menu, footer, and Safari canvas remain unchanged.

## v2.6.0 structured admin QA
- Open each content workspace and confirm the selected record renders type-specific fields.
- Save artist, programme, ticket and FAQ edits and confirm canonical validation errors are surfaced for invalid values.
- Verify artist image path/URL, alternative text and object-position preview in `/admin/media`.
- Confirm publish, draft and archive actions still create audit entries and invalidate the matching public cache tag.
- Verify legal/contact nested JSON fields reject invalid JSON before persistence.


## v2.6.1 lower-section reveal QA

- [ ] Hero and About are visible immediately on every load.
- [ ] Mission and later marked content reveal once when entering the viewport on desktop Chromium and Firefox.
- [ ] Reloading midway down the page never conceals currently visible content.
- [ ] Reduced-motion mode shows all content immediately.
- [ ] iOS Safari shows all content immediately with no reveal classes enabled.
- [ ] Route navigation away from and back to home leaves no stale reveal classes.


## Gallery
- Confirm the gallery sits immediately before Artists.
- Confirm all images fill the viewport without exposed background.
- Confirm crossfades are smooth on iPhone Safari and desktop browsers.
- Confirm “Shams” remains centered, yellow, and rendered in Agilera.
- Confirm autoplay pauses when the gallery leaves the viewport or the tab is hidden.
- Confirm reduced-motion mode keeps a static image.

## v2.8.0 gallery checks

- Gallery admin publishing: edit alt text/order/status, publish, and confirm cache invalidation.
- Draft preview: verify draft gallery records render only for authenticated preview sessions.
- Public local mode: verify all 14 canonical images remain available.
- Public database mode: verify only published gallery records render in sort order.
- Media QA: verify missing image and missing alt-text states are visible.
