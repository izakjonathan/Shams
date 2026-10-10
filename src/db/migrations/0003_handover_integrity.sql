-- Existing invalid rows are preserved; NOT VALID checks constrain all future
-- inserts/updates. Validate them only after an operator reviews legacy rows.
ALTER TABLE content_records ADD CONSTRAINT content_records_type_check
  CHECK (type IN ('artist','gallery','programme','ticket','faq','page')) NOT VALID;
ALTER TABLE content_records ADD CONSTRAINT content_records_status_check
  CHECK (status IN ('draft','placeholder','published','archived')) NOT VALID;
ALTER TABLE content_records ADD CONSTRAINT content_records_data_object_check
  CHECK (jsonb_typeof(data) = 'object') NOT VALID;
CREATE INDEX IF NOT EXISTS content_records_public_idx ON content_records(type, sort_order, id) WHERE status = 'published';
CREATE TABLE IF NOT EXISTS admin_login_attempts (
  key text PRIMARY KEY,
  attempts integer NOT NULL CHECK (attempts BETWEEN 1 AND 11),
  window_start timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_login_attempts_window_idx ON admin_login_attempts(window_start);
