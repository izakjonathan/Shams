# v2.9.3 release checklist

- [x] Built from v2.9.2.
- [x] Database columns are authoritative for stable record metadata.
- [x] Public database reads normalize metadata before canonical validation.
- [x] Admin database reads normalize legacy records before editing.
- [x] Revision restore normalizes older snapshots before validation.
- [x] Added guarded Database — Repair Records GitHub Action.
- [x] Repair preserves editorial fields and publication status.
- [x] Repair writes revision and audit entries.
- [x] Database Verify detects metadata drift.
- [x] Existing public design, motion, Safari, gallery, admin and preview behavior preserved.
- [x] Static audits and release validation pass.
