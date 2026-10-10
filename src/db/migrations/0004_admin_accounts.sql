CREATE TABLE IF NOT EXISTS admin_accounts (
  email text PRIMARY KEY CHECK (email = lower(email) AND length(email) <= 254),
  password_hash text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  session_version integer NOT NULL DEFAULT 1 CHECK (session_version > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
