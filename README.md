# Shams for Humanity v2.9.2

Seed Publication Alignment.

This release keeps the v2.9.1 GitHub Actions database operating model and fixes the baseline publication mismatch discovered during database preview testing. Canonical records that are already visible on the local public site now seed as `published`, so a freshly seeded database mirrors the existing public frontend instead of hiding placeholder-status records.

For already-seeded databases, run the manual **Database — Align Publication** GitHub Action. It changes only records still in `placeholder` state, preserves their edited content, creates revision snapshots and audit entries, and leaves deliberate `draft` or `archived` records untouched.
