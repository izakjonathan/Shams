# v2.9.2 seed publication alignment audit

- Canonical seed snapshot version is 2.9.2.
- All 39 records already visible in the bundled local public site seed with top-level `published` status.
- `data.status` is synchronized with the database record status.
- Database public reads remain published-only; placeholder visibility was not weakened.
- Existing Neon data can be aligned using a status-only GitHub Action without overwriting record content.
- Alignment preserves draft and archived decisions.
- Every automatic placeholder→published change records both a revision snapshot and audit log entry.
- Database verification can require all canonical baseline records to be published.
- Existing public design, preview, admin editing, Safari handling, gallery, motion, and rollback behavior are unchanged.
