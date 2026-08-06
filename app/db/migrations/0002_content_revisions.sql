CREATE TABLE IF NOT EXISTS "content_revisions" (
  "id" text PRIMARY KEY NOT NULL,
  "record_type" text NOT NULL,
  "record_id" text NOT NULL,
  "actor" text NOT NULL,
  "reason" text NOT NULL,
  "snapshot" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "content_revisions_record_idx"
  ON "content_revisions" ("record_type", "record_id", "created_at");
