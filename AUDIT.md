# v1.1.7 current-state audit

## Changes completed

- Split the 2,466-line global stylesheet into focused style files while preserving the exact import and cascade order.
- Added ESLint with Next.js Core Web Vitals and TypeScript rules.
- Added Playwright smoke journeys for splash lifecycle, modal menu behavior, and artist navigation.
- Made the footer and skip link inert together with main content while the mobile modal is mounted.
- Removed blanket touch/wheel suppression and made the mobile overlay vertically scrollable.
- Reconciled manifest loading chrome with the paper/transparent loading policy.
- Removed the obsolete `interest-cohort` Permissions-Policy directive.
- Replaced placeholder `href="#"` values with optional artist-link URLs.
- Strengthened release validation so indexing cannot be enabled while draft public contact/legal information remains.
- Cleaned current release documentation and separated it from historical version notes.

## Validation limitation

The package registry was unavailable in this environment. A lockfile, dependency-backed Next.js build, ESLint execution and Playwright execution could therefore not be completed here. The repository includes the configuration and tests, and the release validator warns until a lockfile is generated.

## Remaining launch work

- Generate and commit `package-lock.json`, then use `npm ci` in deployment.
- Install dependencies and run the full release and browser test commands.
- Replace provisional public content before enabling indexing.
- Confirm the final custom-domain configuration when available.
