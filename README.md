# Shams for Humanity v2.9.3

Database Record Normalization & Repair.

This release fixes the database/public-reader mismatch discovered during Neon preview testing. Database columns are now authoritative for stable record metadata (`id`, `status`, `sortOrder`, and `slug` where applicable). Existing JSON payloads are normalized at the server boundary before canonical validation, so older or partially edited records cannot crash the public site merely because duplicated metadata is missing inside `data`.

For databases already seeded before v2.9.3, run the manual **Database — Repair Records** GitHub Action once with confirmation `REPAIR`, then run **Database — Verify**. The repair changes metadata fields only, preserves editorial content and publication states, and records a revision plus audit entry for every changed record.
