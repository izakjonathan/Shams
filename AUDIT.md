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


## v1.7.5 audit
The programme remains server-sourced and prop-driven, but now uses stable content IDs and explicit editorial order so a future admin API can replace the local data module without changing the presentation component. Generated sequence numbers were removed in favour of the actual editable time field. The splash now uses the supplied artwork on a transparent, full-safe-viewport layer; the old splash image remains unused and is removed from this release.


## v1.7.5 splash root-cause audit

The v1.7.3 base overlay selector was accidentally changed from `.splashScreen` to `html.splashSessionSeen .splashScreen`. The session class is present only when the splash should be skipped, so first visits received no fixed positioning, viewport size, z-index, or overlay layout. The session flag was also stored before the image could render, causing subsequent reloads in the same tab to skip the already-failed sequence. Both contradictions are removed in v1.7.5.

## v1.7.5 Safari splash safe-area correction

The splash artwork is now also painted onto the root document canvas while the splash is active. Mobile Safari derives the visual material behind its status bar and bottom toolbar from that canvas rather than from a fixed child constrained to the visual viewport. The `splashCanvasActive` class is present in the server-rendered `<html>` element, removed before hydration for repeat visits, and removed after the first splash completes. This lets the browser chrome remain translucent over the same full-bleed artwork instead of exposing a white fallback canvas.


## v1.7.8 theme architecture audit

The palette is no longer split across CSS and TypeScript. `app/theme.json` is consumed directly by non-CSS renderers and generates the browser CSS theme before development and production builds. The audit rejects duplicate core palette declarations in `design-system.css`, direct gradient declarations in homepage or artist component styles, and hard-coded accent RGB values inside the gradient geometry file.


## Programme filter rail audit — v1.7.8

- Confirmed `.programmeFilters` has no gradient or mask treatment.
- Confirmed horizontal scrolling remains enabled for narrow mobile viewports.
- Confirmed native scrollbars are hidden using Firefox and WebKit-compatible controls.
- Confirmed vertical overflow is suppressed and no scrollbar-reserved padding remains.

## v1.7.8 centralized gradient audit

- Added one global edit block at the top of `app/styles/gradients.css`.
- `--gradient-size`, `--gradient-shape-x`, `--gradient-shape-y`, `--gradient-strength`, and `--gradient-rotation` now affect the hero and every light gradient section.
- Shared layer dimensions, shape, rotation, opacity, and wash recipes are defined once.
- Homepage sections and artist sections now vary placement only; they cannot redefine their own size or shape.
- Dark sections use one equivalent `--dark-gradient-*` control group.
- Removed the artist quote gradient size/opacity override from `artists.css`.
- Static audit rejects private hero recipes and per-section size/shape controls.
