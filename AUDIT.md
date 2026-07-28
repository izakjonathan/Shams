# Shams for Humanity v1.3.2 — Release Audit

## Scope

This release is built from the confirmed v1.2.1 baseline. It adds programme interaction and develops the ticket section without requiring real event information or live integrations.

## Programme system

- Programme data now contains explicit categories, stage labels, descriptions, and content status.
- `ProgrammeExplorer` owns filtering state while the homepage remains server-rendered outside this isolated client component.
- The filter controls use native buttons and `aria-pressed`.
- Filtered results are announced through an `aria-live` programme list.
- Programme content remains available without requiring external services.

## Ticket system

- `TicketSection` centralizes ticket rendering and state behavior.
- Ticket tiers use an explicit availability union rather than independent booleans.
- Available tickets link externally only when a validated URL exists.
- Missing URLs, coming-soon tiers, and sold-out tiers use disabled button states.
- Placeholder status is visible and controlled by the shared content-status model.

## Compatibility

- Existing visual direction and section gradient systems are unchanged.
- New layouts include mobile, tablet, desktop, hover, keyboard-focus, and reduced-motion behavior.
- The current deploy-friendly dependency set is unchanged.

## Validation

- Source structure, imports, CSS balance, JSON, release metadata, and ZIP integrity were checked.
- A dependency-backed Next.js build still requires package installation in a networked environment.

## v1.3.2 deployment correction

The v1.3.0 ticket model replaced the legacy `available` boolean with the `availability` union, but the event JSON-LD mapping in `app/layout.tsx` still referenced `ticket.available`. The mapping now exhaustively handles all three current values and produces valid Schema.org availability URLs.


## v1.3.2 interaction revision

- Programme rows no longer expose status labels or a separate time column.
- Programme copy begins in the second grid column directly after the row index.
- Homepage artist discovery has returned to the compact list presentation from the earlier baseline.
- Internal route navigation now uses a shared opacity-only transition with no translate or scroll-style movement.
