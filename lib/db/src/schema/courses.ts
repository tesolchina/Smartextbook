import { pgTable, text, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";

export const coursesTable = pgTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  teacherName: text("teacher_name").notNull(),
  teacherCredential: text("teacher_credential"),
  lessonIds: jsonb("lesson_ids").notNull().$type<string[]>(),
  passScore: integer("pass_score").notNull().default(70),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Course = typeof coursesTable.$inferSelect;
