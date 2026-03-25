import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";

export const sharedLessonsTable = pgTable(
  "shared_lessons",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    lessonData: jsonb("lesson_data").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("shared_lessons_expires_at_idx").on(t.expiresAt)]
);

export type SharedLesson = typeof sharedLessonsTable.$inferSelect;
