
## 2.10.4 — Frontend editing view

The admin landing page renders the shared public homepage with section controls and direct record edit links. Gallery controls follow the current slide; FAQs and programme filters remain interactive. Navigation uses the public paper colour and typography. Drafts and archives remain available in collection editors, while the landing preview shows published content. Homepage hero/about/mission/event/newsletter copy remains code-managed; this release does not add database fields for that copy. Save, publication, authorization, revisions and concurrency checks are unchanged.
# Login storage recovery in 2.10.3
A missing login-counter table can be initialized by the sign-in flow only after the configured credentials verify. The operation is transactional, idempotent and limited to security counter storage. It does not apply/mark migration 0003 or alter content. Complete migrations still need normal operator execution. Database outages/permissions failures stay fail-closed with a setup error; actual repeated attempts still have a 15-minute limit.

# Development and deployment workflow
1. Create a branch from the confirmed production commit; retain a recoverable baseline tag/backup. Apply the complete ZIP with the deletion manifest and review `git diff` before committing.
2. Run Node 24 `npm ci`; use isolated local/preview database credentials. Never copy production DATABASE_URL into tests or checked-in files.
3. Change domain code and tests together. Preserve routing and approved styling. Add migrations with increasing numbers; do not change 0001/0002 or the existing ledger.
4. Run documented quality checks, real PostgreSQL and browser CI. Stop release sign-off if required gates are missing/failing.
5. Create a provider backup/branch and perform a restore rehearsal. Run migration and read-only verification on an isolated copy, including legacy records. Migration 0003 is additive, not an editorial cleanup.
6. Configure isolated Preview credentials before allowing writes. The current Vercel database target is shared between Preview and Production; code now blocks preview content writes by default. Login throttling still writes its shared storage, so real database isolation remains required.
7. For the reviewed production release, run migration 0003 once via the protected Database — Migrate workflow, verify, deploy the same committed source and smoke-test real authenticated publishing. These steps were not executed by this review. Initial seed is for an empty database only. Refresh is destructive editorial replacement even though it stores recovery revisions; never run routinely. Repair and placeholder alignment are explicit maintenance operations with row locks and revisions; both preserve drafts/archives.
8. After CLI maintenance verify public cache refresh/redeploy. Do not switch to local-fallback as a silent outage workaround: it can display checked-in content that was intentionally unpublished in the database.
9. Provide the owner repository/Vercel/Neon access, environment-key inventory without values, integration owners, backup policy and support contacts. Rotate credentials/session secret at handover; rotation signs all old sessions out.

Rollback: restore the baseline application commit or the prior Vercel deployment if code fails. Leave additive 0003 objects in place unless a reviewed database rollback is necessary. Application rollback does not undo data edits; restore a revision for individual content or rehearse provider backup restoration for disaster recovery. Avoid replacing the database with seed content.
