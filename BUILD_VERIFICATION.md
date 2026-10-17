> Historical reference retained from the baseline. For 2.10.0, use HANDOVER_REVIEW.md and docs/development-workflow.md; previous check results and runtime versions do not certify this candidate.

## 2.10.17 verification

Lint passed with four existing admin image warnings; TypeScript, all 12 unit tests, static/runtime audits, release validation and production build passed. Static guards were updated for the explicitly selected content-sized footer and configurable gallery crossfade. Browser checks covered 320, 390, 430, 768 and 1440px, plus 667×375 landscape: no horizontal overflow, coincident Hero/About edges, 44px artist controls, featured ticket first in DOM order, and correct light/dark/photo header tones. Exercised programme filtering, five menu destinations, keyboard opening/Escape/focus restoration, menu anchor navigation, artist open/return, FAQ expansion and legal-page return to document bottom. Normal motion and live Reduce Motion switching passed without client exceptions. Inspected phone and desktop screenshots. At 390px, Tickets measures 1524px versus 1847px before; the footer measures 674px versus 844px. Final filter targets are 44px and desktop ticket borders remain complete. Local ticket/newsletter/site URL configuration warnings remain unchanged; physical iPhone toolbar behaviour and frame rate were not measured. No dependency, database or authentication change.

## 2.10.16 verification

Lint (four existing admin image warnings), TypeScript, all 12 unit tests, static/runtime audits and production build passed. Browser checks at 390px and 1280px confirm exact computed-style parity between the opening and Programme for wash images/opacity and all three glow images, opacity, dimensions and transforms. Hero/About edges coincide and neither viewport has horizontal overflow. Visually inspected the mobile hero, join and Programme comparison. The shared surface uses static CSS, with three decorative aria-hidden glow elements and no new dependency or runtime listener.

## 2.10.15 verification

Lint (four existing admin image warnings), TypeScript, all 12 unit tests, static/runtime audits and a clean production build passed. The initial build encountered a stale Turbopack persistence-cache error; rebuilding after removing generated .next output succeeded. Rendered the production build at 390px and 1280px: the shared wash computes to 72% opacity, Hero/About edges coincide and neither viewport has horizontal overflow. Visually inspected the mobile hero and section join. No new layer, animation, dependency or runtime listener was added.

## 2.10.14 verification

Production build, TypeScript, static/runtime audits and all 12 unit tests passed; ESLint has no errors and four existing admin image warnings. Inspected the mobile hero and checked layout at 390px and 1280px. The same mobile rich-yellow pixel comparison used for 2.10.13 now measures 63.0% coverage, down from 83.8%, restoring more cream space. Both layouts preserve the seamless join and have no horizontal overflow; the adjacent-row join difference is at most 2/255 per channel on mobile and 1/255 on desktop. No runtime dependency, animation, filter, database or authentication change.

## 2.10.13 verification

Production build, TypeScript, static/runtime audits and all 12 unit tests passed. ESLint has no errors and four existing admin image warnings. Rendered the final build at 390px and 1280px; inspected the mobile hero. Both layouts retain coincident Hero/About edges and no horizontal overflow. The mobile rich-yellow area increases from 50.3% to 83.8% of the viewport when compared with the previous recipe under identical rendering (pixel threshold R>235, 170<G<220, B<115; a design-comparison measure, not a performance score). Adjacent rows at the section join differ by at most 2/255 per channel on mobile and 0/255 on desktop. No new dependency, animation, filter or database change. Physical iPhone frame rate and native toolbar tint were not measured.

## 2.10.12 verification

Production build, TypeScript, static/runtime audits and all 12 unit tests passed. ESLint has no errors and four existing admin image warnings. Inspected stronger opening gradients at mobile and desktop sizes (390px and 1280px); both keep transparent child sections above one continuous background, matching edges and no horizontal overflow. Saturated centres now use the same colour-stop values as the shared paper-orb recipe. No new blur, animation, runtime listener, image or dependency was added.

## 2.10.11 verification

Production build, TypeScript, static/runtime audits and all 12 unit tests passed. ESLint has no errors and four existing admin image warnings. Targeted iPhone-sized WebKit checks passed: there is no gallery playback button, automatic image advancement still works, incoming photos are loaded before switching, and live Reduce Motion stops playback. The three-slide limit remains.

## 2.10.10 verification

Production build, TypeScript, static/runtime audits and all 12 unit tests passed; ESLint has no errors and four existing admin image warnings. Inspected the hero/About join at 390px and 1280px widths. Both sections now have transparent backgrounds above one shared gradient; their adjacent edges coincide exactly and neither layout overflows horizontally. Adjacent screenshot rows across the join differ by at most 2 (mobile) / 3 (desktop) levels per 8-bit colour channel, consistent with a smooth gradient rather than a section colour reset. Previous mobile Event Info spacing and motion features remain included. No database or authentication code changed.

## 2.10.9 verification

Production build, TypeScript, static/runtime audits and all 12 unit tests passed. ESLint has no errors and four existing admin image warnings. Browser layout checks at 360px and 390px confirmed each Event Info card is now approximately 189px high (previous minimum 270px), with 24px of bottom padding and 14px above the heading. At 1280px the original desktop minimum height and heading spacing remain. Inspected the updated mobile screenshot. This change is scoped to two CSS files plus release metadata/documentation; no database or authentication code changed.

## 2.10.8 — Motion verification (16 October 2026)

| Check | Result |
| --- | --- |
| Production build | Passed; 14 static pages generated, public and admin routes built. A stale local Turbopack cache was moved aside after a cache panic; the clean build and subsequent build both passed. |
| TypeScript | Passed, including the final browser-test fixtures. |
| ESLint | No errors; four existing admin next/no-img-element warnings. |
| Unit tests | All 12 session/content tests passed. |
| Static architecture / runtime boundaries / release validation | Passed. Existing missing public ticket/newsletter/site URL notices are local configuration notices, not new requirements. |
| Chromium desktop and mobile emulation | 33 applicable checks passed; one mobile-menu-only check skipped on desktop. |
| WebKit with iPhone 13 viewport/touch emulation | All 17 applicable checks passed across the full run and the corrected motion-test rerun. One initial failure was a test comparing equivalent CSS number serialization (0.00001s versus 1e-05s); the final assertion compares duration numerically. |
| Screens inspected | 390 × 844 hero, menu, programme and ticket screens. Narrow overflow checks also passed at 360 × 740. |
| Database / production | No SQL or production checks needed for these presentation-only changes; no migration, credentials, production mutation or deployment. |

Browser evidence covers 50 distinct applicable test/project cases. The environment could not retrieve browsers matching the project's pinned Playwright version, so compatible Playwright 1.51.1 browser binaries and a temporary runner were used without changing project dependencies. WebKit ran against a temporary local HTTPS proxy because the existing production CSP upgrades subresources to HTTPS. Security headers were preserved.

Browser cases cover fresh/repeat splash startup, deferred page images, reduced-motion startup, live preference changes, gallery loading/automatic advancement/pause, three-slide bounds, keyboard reveal, observer fallback, no-JavaScript content, narrow overflow, menu closure, filters, FAQ controls, artist route returns and footer contact.

Limitations: Linux WebKit emulation is not a physical iPhone or the latest native Safari. Native toolbar tint, sustained device frame rate, GPU memory and battery use remain device checks. No 60fps, INP or battery improvement claim is made from desktop emulation. See docs/MOTION_REVIEW.md for research, design choices and tradeoffs.

# v2.4.2 production verification guide

## Required local/Vercel gates

Run with Node 22 and the committed lockfile:

```bash
npm ci
npm run audit:boundaries
npm run typecheck
npm run build
npm run test:e2e
```

## Environment matrix

### Local repository mode

```env
CONTENT_SOURCE=local
DATABASE_URL=
```

Expected: the public build succeeds without loading PostgreSQL. Admin database mutations remain unavailable until `DATABASE_URL` is configured.

### Database repository mode

```env
CONTENT_SOURCE=database
CONTENT_DATABASE_FAILURE=error
DATABASE_URL=postgres://...
```

Expected: public pages read published records only. Draft Mode reads draft and published records for authenticated admins.

### Controlled rollback mode

```env
CONTENT_SOURCE=database
CONTENT_DATABASE_FAILURE=local-fallback
DATABASE_URL=postgres://...
```

Expected: database read failures are logged and canonical local content is served. Use only as an explicit operational fallback.

## Import-graph acceptance criteria

The Vercel log must not show a Client or Edge import trace containing:

- `src/features/content/server.ts`
- `src/features/content/public-repository.ts`
- `src/features/content/database-public-records.ts`
- `src/db/client.ts`
- `postgres`
- `next/headers`

The public database pages, admin, and preview routes must report the Node.js runtime. Open Graph remains Edge-compatible and database-independent.

## Database acceptance test

1. Apply the migration.
2. Seed canonical content.
3. Publish one draft record.
4. Confirm its content tag is invalidated.
5. Confirm the public page changes.
6. Move it back to draft and confirm it disappears publicly.
7. Confirm authenticated preview still displays it.
8. Confirm the audit log records both status changes.

## 2.10.7 verification

Passed: production build, TypeScript, 12 unit tests, static architecture audit, runtime-boundary audit and release configuration validation. ESLint completed with no errors and four existing next/no-img-element warnings. No database change; SQL checks were not needed. Physical iPhone/Safari toolbar tint and browser interaction checks were not available in this environment; follow APPLY_CHANGES.md for device checks. Reviewed the changed React components for hook dependencies, accessibility, hydration and render behaviour; no new interaction or fetching was introduced.
