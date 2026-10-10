# Shared frontend editing view

Use the public HomePage, gallery, FAQ, programme and ticket components in the authenticated admin landing page. Editing is an explicit server-owned boolean, never a public query parameter. Edit links open existing authenticated record forms and do not change write authorization, validation, optimistic concurrency or publication rules. Only public fields and IDs are passed to interactive components, never admin identities or record snapshots.

The landing page is a published-content view; drafts and archives remain in collection editors. Gallery and collections have management links even if there are no published records. Individual links select stable record IDs and scroll to the editor. Code-managed homepage copy remains code-managed; adding editable fields for it requires a separately validated content model.
