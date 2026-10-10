# Repository engineering rules
Start from the current working commit and inspect before editing. Preserve the yellow/black design, typography, public URLs, accessibility and established motion/viewport behaviour.

Use `src/app` for Next.js entrypoints only. Colocate domain implementation and tests in `src/features`; share code only across unrelated features. Prefer Server Components; isolate browser interaction in small Client Components. Keep PostgreSQL, credentials and admin authorization server-only.

Authorize every action/handler, validate untrusted fields on the server, and never trust hidden form JSON as the original record. Save content, its exact recovery snapshot and audit record atomically. Require the current record version. Preserve stable IDs and intentional drafts/archives. Add migrations; never rewrite applied SQL/checksums. Never execute tests against production.

Run lint, typecheck, unit tests, build and appropriate SQL/browser checks. Record skipped or unavailable checks honestly. Update README, changelog, architecture/testing/workflow docs and relevant decisions/plans. Review final diff for secrets, unrelated changes and boundary/security regressions. Do not commit secrets, generated build outputs or dependencies. Never push/deploy or change production data without task authorization.
