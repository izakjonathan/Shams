# Shams 2.10.24 — Admin mobile zoom and gallery fixes

Based on the supplied 2.10.23 Vercel Blob release. No live deployment or production database modifications were performed.

## Changes

1. **Admin login and initial editor zoom (iPhone):** The admin's login/editor fields used a 14px font. Mobile Safari zooms the viewport when a control below 16px receives focus and can retain that zoom after navigation. All admin text inputs, selects, textareas and file inputs now use a 16px font, while the page retains `initialScale: 1` and normal pinch-to-zoom accessibility.
2. **Gallery slideshow freezing:** The slideshow only advanced to an image marked loaded, while its adjacent slides were `loading="lazy"` inside opacity-zero layers. Browsers can defer those images, preventing the transition. Only the three mounted slides (previous/current/next) now load eagerly; failures are skipped instead of blocking rotation. Readiness is keyed to the actual media URL, not just the database record ID, so replacing an image doesn't retain a stale loaded state. Added accessible previous/next controls for manual navigation and reduced-motion users.
3. **Gallery edits on public website:** Saving/publishing content now invalidates the public homepage route as well as its tagged database data cache. The admin editor keeps the selected gallery record open after saving. The Gallery and Content Editor show a clear warning when `CONTENT_SOURCE` is not `database`, because in local mode the frontend deliberately ignores database edits.
4. **New gallery images:** The Add Gallery Image workflow now offers **Save draft** and **Save & publish** in one step. The create action honours the publish intent only for gallery records, validates it, writes the published record and invalidates the public homepage. New gallery templates in the main content editor have blank image/alt fields rather than reusing an existing photograph.

## Configuration that still matters

For public images to reflect database edits, set `CONTENT_SOURCE=database` in the **production** Vercel environment, after migrating and reviewing the database, and redeploy. In `CONTENT_SOURCE=local`, public content intentionally comes from checked-in static files, regardless of successful admin writes. A new gallery record saved as **draft** also intentionally does not appear publicly until published. `MEDIA_STORAGE=blob` and `BLOB_READ_WRITE_TOKEN` control where uploads are stored; they do not change the content source or publication status.

## Verification performed

- `node scripts/audit-static.mjs` — passed.
- `node scripts/check-runtime-boundaries.mjs` — passed.
- `node scripts/validate-release.mjs` — passed, with pre-existing local environment configuration warnings.
- TypeScript/TSX transpilation syntax check — 116 files passed.
- Full Next.js build, browser/iOS Safari run, authenticated database writes, and live Vercel Blob uploads were **not** verified. `npm ci` could not complete in this environment. Do not interpret static checks as full integration tests.

## Deploy

Deploy the updated ZIP via the normal GitHub/Vercel workflow. Confirm `CONTENT_SOURCE=database` in production and that the gallery record is **published**. Verify the iPhone login and admin page remain at natural zoom and that the public gallery rotates and shows updated photos.
