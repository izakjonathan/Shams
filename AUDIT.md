# v1.7.0 editorial curtain audit

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
