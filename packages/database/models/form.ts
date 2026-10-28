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
  tagline: varchar("tagline", { length: 100 }),
  canvasJson: jsonb("canvas_json")
    .$type<{ data?: unknown[]; [key: string]: unknown }>()
    .notNull(),

  isLive: boolean("is_live").default(true).notNull(),

  theme: varchar("theme", { length: 32 })
    .$type<"paper" | "minimal" | "midnight">()
    .default("paper")
    .notNull(),

  successAnimation: varchar("success_animation", { length: 32 })
    .$type<"confetti" | "check" | "sparkle">()
    .default("confetti")
    .notNull(),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;
