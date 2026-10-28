import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { formsTable } from "./form";

export const responsesTable = pgTable("form_responses", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, {
      onDelete: "cascade",
    }),

  answers: jsonb("answers")
    .$type<Record<string, string | string[]>>()
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SelectResponse = typeof responsesTable.$inferSelect;
export type InsertResponse = typeof responsesTable.$inferInsert;
