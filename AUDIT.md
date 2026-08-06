# v2.1.9 Constitution alignment implementation audit

## Baseline

Built from `shams-for-humanity-v2.1.8-splash-refresh-gradient-update.zip` following the Project Development Constitution alignment audit.

## Corrections applied

### Admin mutation validation

Admin JSON is no longer written directly to PostgreSQL after only metadata normalization. Every write now passes through `app/content/admin-validation.ts`, which validates:

- canonical status values;
- stable ID and metadata agreement;
- slug shape and agreement;
- programme time/category values;
- ticket price, availability, and includes;
- FAQ fields;
- information/contact page structure;
- artist editorial, image, biography, highlights, and link fields.

The public repository remains unchanged and continues using its existing full-content validation.

### Gradient-strength correction

The global strength value remains `1.2`. Wash layers still use bounded opacity, while all gradient layers now also use saturation and contrast derived from the same strength token. This makes values above `1` visible without altering section geometry, content scale, spacing, or layout.

### Focus consistency

Same-document hash navigation and cross-route arrival now share one focus helper. Non-focusable destinations receive a temporary `tabindex="-1"`, which is removed on blur.

### Release traceability

- Seed audit metadata derives from `package.json`.
- Node 22 is pinned through `engines`.
- The unused old splash JPEG was removed.
- `CHANGELOG.md` and `QA_MATRIX.md` were added.
- v2.1.8 documentation drift was corrected by replacing release documentation with the actual v2.1.9 scope.

## Deliberately unchanged high-risk systems

No changes were made to:

- splash runway or handoff;
- Safari document-canvas/footer-contact controller;
- route-curtain timing and ownership;
- menu phase model;
- hero geometry;
- footer sizing;
- browser history/swipe-back behaviour;
- public/admin layout separation;
- CSS file ownership.

## Verification

- Static architecture audit passes.
- Release configuration validation passes.
- Validation and theme scripts parse under Node.
- CSS brace integrity passes.
- ZIP integrity passes.

A clean dependency install, full TypeScript check, Next.js production build, database mutation test, and browser/device matrix remain required outside this constrained registry environment.
