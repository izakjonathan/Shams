import { sql } from "drizzle-orm";
import { check, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const contentRecords = pgTable(
  "content_records",
  {
    id: text("id").primaryKey(),
    type: text("type").notNull(),
    slug: text("slug"),
    status: text("status").notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    data: jsonb("data").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
  },
  (table) => ({
    typeCheck: check("content_records_type_check", sql`${table.type} IN ('artist','gallery','programme','ticket','faq','page')`),
    statusCheck: check("content_records_status_check", sql`${table.status} IN ('draft','placeholder','published','archived')`),
    objectCheck: check("content_records_data_object_check", sql`jsonb_typeof(${table.data}) = 'object'`),
    publicIndex: index("content_records_public_idx").on(table.type, table.sortOrder, table.id).where(sql`${table.status} = 'published'`),
    typeIndex: index("content_records_type_idx").on(table.type),
    statusIndex: index("content_records_status_idx").on(table.status),
    typeSlugUnique: uniqueIndex("content_records_type_slug_unique").on(table.type, table.slug),
  }),
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    actor: text("actor").notNull(),
    action: text("action").notNull(),
    recordType: text("record_type").notNull(),
    recordId: text("record_id").notNull(),
    before: jsonb("before"),
    after: jsonb("after"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    recordIndex: index("audit_logs_record_idx").on(table.recordType, table.recordId),
    createdIndex: index("audit_logs_created_idx").on(table.createdAt),
  }),
);

export const contentRevisions = pgTable(
  "content_revisions",
  {
    id: text("id").primaryKey(),
    recordType: text("record_type").notNull(),
    recordId: text("record_id").notNull(),
    actor: text("actor").notNull(),
    reason: text("reason").notNull(),
    snapshot: jsonb("snapshot").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    recordIndex: index("content_revisions_record_idx").on(table.recordType, table.recordId, table.createdAt),
  }),
);

export const adminLoginAttempts = pgTable("admin_login_attempts", {
  key: text("key").primaryKey(),
  attempts: integer("attempts").notNull(),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  attemptsCheck: check("admin_login_attempts_attempts_check", sql`${table.attempts} BETWEEN 1 AND 11`),
  windowIndex: index("admin_login_attempts_window_idx").on(table.windowStart),
}));
