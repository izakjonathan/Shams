# Applying the 2.10.0 ZIP safely
Baseline: `izakjonathan/Shams` main `a86a8912f36978d200cb1d331a4765b3307d99f0` (2.9.4). This archive is a full source snapshot, not an overlay patch. No GitHub commit or Vercel deployment was made by the review.

**Delete the old root `app/` directory before copying the new `src/`. Keeping both causes Next.js to use the old root app and ignore the updated source.**

1. Back up the working tree and create a branch from the baseline. If main has advanced, reconcile those changes before using this snapshot.
2. Extract the ZIP. Copy the contents of `shams-2.10.0/` into the repository, including `.github`, `.env.example`, `.gitignore` and other tracked configuration. Preserve your `.git` folder and local secret environment files. Remove all old tracked paths listed in FILES_TO_DELETE.txt (principally `app/`); do not remove `public/`.
3. Review `git diff --stat`, `git diff` and untracked files. Commit source/doc/lockfile additions plus deletions yourself. Exclude node_modules, .next, local environment files, build/test reports and credentials.
4. Run Node 24 `npm ci`, quality checks and real PostgreSQL/browser CI. Read HANDOVER_REVIEW.md before calling this production ready.
5. The database migration and release are separate operator steps. Take a backup, test on an isolated copy, then apply 0003 and verify before deploying. Do not reseed existing production content. No migration or production editorial change has been applied for you.

Existing migrations were moved without altering their bytes. Archive excludes `.git`, dependencies, builds, caches, reports and secret files. FILES_TO_DELETE.txt records baseline tracked deletions; it is an application aid, not a shell script.
