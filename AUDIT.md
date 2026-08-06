# v2.9.0 revision and rollback audit

- Revision snapshots are stored in a dedicated append-only table.
- The previous state is captured before each update or status change.
- Restores validate canonical content before writing.
- Stale editor timestamps prevent restoring over newer work.
- The current state is captured before a restore, making rollback reversible.
- Every restore writes an audit entry and invalidates the affected public cache tag.
- Revision history is database-only and does not alter local fallback content.
- Public rendering and stable animation/Safari architecture are unchanged.
