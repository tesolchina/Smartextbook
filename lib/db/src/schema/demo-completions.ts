import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const demoCompletionsTable = pgTable("demo_completions", {
  id: text("id").primaryKey(),
  moduleId: text("module_id").notNull(),
  moduleTitle: text("module_title").notNull(),
  learnerName: text("learner_name").notNull(),
  score: integer("score").notNull(),
  rawScore: integer("raw_score").notNull(),
  maxScore: integer("max_score").notNull(),
  sessionId: text("session_id"),
  contentHash: text("content_hash").notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
});

export type DemoCompletion = typeof demoCompletionsTable.$inferSelect;
