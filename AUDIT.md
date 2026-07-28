# v1.3.4 Current-State Audit

## Corrected in this release

- Removed the unused `ArtistCard` component and all artist-card CSS.
- Removed public placeholder/confirmed labels and their unused content-model fields from artist and ticket data.
- Removed the artist loading route that could create a double fade.
- Removed unused programme times and programme development statuses from the public programme model.
- Rebuilt route transition lifecycle with timer cleanup, failure recovery, duplicate-click protection, search-aware route identity, `aria-busy`, a live loading status, and keyboard-focused destination handling.
- Coordinated mobile-menu navigation by unmounting the menu before route fading begins.
- Disabled automatic browser scroll restoration and normalised history destinations after commit.
- Revealed the complete lineup before returning to an artist anchor, preventing nearby vertical reveal movement.
- Added a mobile programme-filter continuation affordance.
- Moved responsive CSS to the final import position.
- Removed cross-page selectors from artist stylesheet ownership.
- Updated release validation and added dependency-free repository quality checks.
- Rewrote current documentation without stale artist-card or earlier-version claims.

## Native browser limitation

Safari's interactive swipe-back animation and browser-owned history gestures cannot be fully replaced by a JavaScript exit fade. Site controls use the complete fade-out/fade-in lifecycle. Native history destinations are hidden, positioned, and faded in after the browser commits the route.

## Remaining release-environment limitation

A dependency lockfile could not be generated because the package registry was unavailable in the build environment. Source validation passes, but a networked environment must run `npm install`, commit `package-lock.json`, and then use `npm ci` for fully reproducible deployments.

## Verification completed

- TypeScript/TSX syntax transpilation
- CSS brace and import validation
- relative import resolution
- JSON validation
- repository contradiction checks
- release configuration validation
- archive structure and ZIP integrity

A dependency-backed `next build` was not run in this environment.
