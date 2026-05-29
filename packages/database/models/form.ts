import {
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { usersTable } from "./user";

export const formsTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),

  title: varchar("title", { length: 40 }).notNull(),

  canvasJson: jsonb("canvas_json").notNull(),

  // parsedSchema: jsonb("parsed_schema"),

  isLive: boolean("is_live")
    .default(false)
    .notNull(),

  // unlisted: boolean("unlisted")
  //   .default(false)
  //   .notNull(),

  expiresAt: timestamp("expires_at"),
  
  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").$onUpdate(
    () => new Date()
  ),
});