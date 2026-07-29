# v1.7.1 editorial curtain audit

## Removed completely

- Native View Transition API artist route handling
- DOM/FLIP artist title morphing
- Viewport snapshot cloning
- Floating artist title layers
- Morph-specific data attributes, CSS classes, timers and watchdogs
- Source-element plumbing in `FadeLink`

A repository-wide static audit rejects these identifiers if they return.

## Current route architecture

1. A navigation lock prevents duplicate activation.
2. The transition kind is inferred or supplied by the link.
3. The black curtain starts moving immediately from `translateY(-101%)` to `0`.
4. A transform `transitionend` starts the Next.js route change; a timeout is retained only as a fallback.
5. The curtain remains opaque while the App Router commits.
6. Destination hash/top positioning happens before reveal.
7. Fonts and two animation frames are awaited.
8. The curtain exits upward.
9. Its transform `transitionend` releases the lock; a bounded fallback and global watchdog guarantee cleanup.

## Contradiction checks

- The live route has no transition opacity or transform rules.
- The curtain is below the fixed header and above page content.
- The menu source files are unchanged.
- Automatic Next.js scrolling is disabled during route changes.
- ScrollReveal is coordinated through `shf-route-target` on artist close.
- No cloned DOM, duplicated IDs, browser compositor snapshots or transparent intermediate canvas exist.

## v1.7.2 typography audit

- Added a single global typography layer imported last, so heading metrics are not accidentally overridden by older page styles.
- Added semantic line-height tokens for hero, section, compact-display, reading, large body, and UI text.
- Removed reliance on the browser's `normal` line-height for Agilera headings.
- Standardized h1-h6 family, weight, tracking, wrapping, margins, and leading.
- Tightened all wrapped legal-page headings, including the Terms “Tickets and payment” heading shown in the audit screenshot.
- Standardized legal-page section spacing and paragraph rhythm.
- Added mobile-specific legal-title sizing and layout safeguards.
- Preserved the editorial curtain and all navigation behavior.


## v1.7.3 audit
The programme remains server-sourced and prop-driven, but now uses stable content IDs and explicit editorial order so a future admin API can replace the local data module without changing the presentation component. Generated sequence numbers were removed in favour of the actual editable time field. The splash now uses the supplied artwork on a transparent, full-safe-viewport layer; the old splash image remains unused and is removed from this release.
