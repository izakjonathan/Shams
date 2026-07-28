# v1.1.8 current-state audit

## Deployment repair

The v1.1.7 deployment stalled during `npm install` after adding ESLint and Playwright packages. Those tools were not required by `next build`, but Vercel still installed them and encountered dependency-resolution warnings.

The deployable dependency tree has been returned to the minimal application set:

- Next.js
- React
- React DOM
- TypeScript and React/Node declarations

TypeScript is pinned to the version npm previously resolved, avoiding the contradictory root requirement shown in the Vercel log. The package-level Node engine override was removed so Vercel can use the runtime selected in Project Settings.

## Preserved v1.1.7 improvements

- split stylesheet architecture
- complete modal inert model
- scrollable mobile menu
- reconciled loading and manifest theme colors
- obsolete Permissions-Policy directive removed
- optional artist-link model
- stricter launch validation
- approved design and Safari behavior unchanged

## Validation scope

Static source, import, CSS, JSON, asset, release-validator, and ZIP-integrity checks were completed. A dependency-backed build still needs to run in Vercel or another networked environment.
