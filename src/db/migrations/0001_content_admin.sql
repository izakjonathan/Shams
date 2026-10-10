CREATE TABLE IF NOT EXISTS content_records (
  id text PRIMARY KEY,
  type text NOT NULL,
  slug text,
  status text NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
CREATE INDEX IF NOT EXISTS content_records_type_idx ON content_records(type);
CREATE INDEX IF NOT EXISTS content_records_status_idx ON content_records(status);
CREATE UNIQUE INDEX IF NOT EXISTS content_records_type_slug_unique ON content_records(type, slug);

CREATE TABLE IF NOT EXISTS audit_logs (
  id text PRIMARY KEY,
  actor text NOT NULL,
  action text NOT NULL,
  record_type text NOT NULL,
  record_id text NOT NULL,
  before jsonb,
  after jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_logs_record_idx ON audit_logs(record_type, record_id);
CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON audit_logs(created_at);
