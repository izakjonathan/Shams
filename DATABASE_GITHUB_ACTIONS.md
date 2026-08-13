# Database administration from iPad — GitHub Actions

Shams v2.9.2 uses the same operating model as Baros:

- Vercel owns the deployed application's Neon environment variables.
- GitHub Actions owns manual database administration.
- `/admin` is for content editing, publishing, preview, audit history, and revisions — not schema administration.

## One-time GitHub setup

In the Shams GitHub repository open **Settings → Secrets and variables → Actions** and add one repository secret:

- `DATABASE_URL` — use the current **rotated Neon unpooled/direct connection string** for migration and maintenance operations. Vercel can continue using its pooled `DATABASE_URL` for the deployed application.

Do not paste the database URL into workflow files or commit it to the repository.

## Manual workflow order

From the GitHub mobile/web interface open **Actions** and run the workflows in this order:

1. **Database — Migrate**
   - Creates the Shams migration registry if needed.
   - Applies every numbered SQL file under `app/db/migrations/` in order.
   - Refuses to continue if an already-applied migration file was edited later.
   - Automatically runs schema verification afterward.

2. **Database — Verify**
   - Safe and read-only.
   - Checks connectivity, required tables, required columns, indexes, registered migration checksums, and content-record counts.
   - Can be run at any time.

3. **Database — Seed**
   - First run: leave `refresh_existing` set to **false**.
   - Seeds the checked-in canonical v2.9.2 local content into an empty database.
   - Refuses to overwrite an already-populated database unless `refresh_existing=true` is explicitly selected.
   - Writes an audit-log record showing the GitHub actor and baseline version.
   - Runs Verify before and after the seed.

4. Run **Database — Verify** once more if you want an independent final check.

## Production rollout

Keep Vercel set to:

```text
CONTENT_SOURCE=local
CONTENT_DATABASE_FAILURE=error
```

while you migrate and seed.

After Migrate, Verify, and Seed all pass:

1. Open `/admin` on the deployed site and confirm artists, gallery, programme, tickets, FAQs, pages, audit, and revisions load from the database.
2. Review statuses before switching the public site. The seed intentionally preserves the local baseline statuses; many current placeholder records are **not** public in database mode because database reads expose `published` records only. Publish the records you actually want live through `/admin`.
3. Test a draft edit and Draft Mode preview.
4. Run **Database — Verify** and confirm the published/placeholder counts match your intended public state.
5. Only then change Vercel to:

```text
CONTENT_SOURCE=database
CONTENT_DATABASE_FAILURE=local-fallback
```

6. Redeploy.
7. Run **Database — Verify** again.

## Safety rules

- Never edit an SQL migration that has already been applied. Add a new numbered migration instead.
- Keep `refresh_existing=false` for normal seeding. `true` intentionally overwrites matching canonical records and can replace admin edits.
- The GitHub workflows use the `DATABASE_URL` GitHub secret; they do not read Vercel environment variables automatically. They install only the pinned `postgres@3.4.7` maintenance dependency, so Playwright or other development packages cannot block database administration.
- Rotate the Neon credential immediately if a connection string is exposed.

## Existing v2.9.1 database: publication alignment

If the database was seeded before v2.9.2, run **Database — Align Publication** once after deploying this release. It promotes only canonical records that are still `placeholder` to `published`. It does not replace edited JSON/content, and it leaves `draft` and `archived` records untouched. Run **Database — Verify** afterwards.


## Repair existing record metadata — v2.9.3

Use this only when **Database — Verify** reports JSON/database metadata drift or when upgrading a database seeded before v2.9.3.

1. Open **Actions → Database — Repair Records**.
2. Tap **Run workflow** on `main`.
3. Enter `REPAIR` in the confirmation field.
4. Run the workflow and wait for green status.
5. The workflow automatically runs Database Verify after repair.

The repair preserves questions, answers, artist copy, programme details, images, ticket content, publication status and sort-order columns. It only synchronizes duplicated JSON metadata with the authoritative database columns.

## Complete older record shapes — v2.9.4

Databases seeded by older releases may contain valid editorial content but omit fields that were added later to the canonical type shape (for example `page.index` or nested section metadata). v2.9.4 completes only missing baseline fields at the read boundary; values already stored in Neon always win. Run **Database — Repair Records** with confirmation `REPAIR` once to permanently backfill those missing canonical fields, then run **Database — Verify**.
