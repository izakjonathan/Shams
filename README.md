# Shams for Humanity v2.8.0

Built from the confirmed v2.7.1 public baseline.

## Gallery admin and publishing integration

- Adds a dedicated `/admin/gallery` workspace.
- Gallery images can be ordered, described, drafted, published, or archived.
- Adds structured image-path and alternative-text fields with a visual preview.
- Adds gallery assets to the shared admin media QA workspace.
- Seeds all canonical local gallery records into PostgreSQL.
- Public database mode reads published gallery records through the existing repository adapter.
- Gallery publishing invalidates a dedicated `content:gallery` cache tag.
- Draft Mode preview uses the real homepage gallery.

The approved v2.7.1 gallery design, 3.6-second cadence, 0.9-second crossfade, lower-section reveal, stable splash, Safari canvas/footer handling, menu, route curtain, and public typography remain unchanged.
