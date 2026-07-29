import { index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

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
