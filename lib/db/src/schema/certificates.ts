import { pgTable, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";

export const certificatesTable = pgTable("certificates", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull(),
  courseTitle: text("course_title").notNull(),
  teacherName: text("teacher_name").notNull(),
  learnerName: text("learner_name").notNull(),
  learnerKey: text("learner_key").notNull(),
  scores: jsonb("scores").notNull().$type<Record<string, number>>(),
  overallScore: integer("overall_score").notNull(),
  contentHash: text("content_hash").notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Certificate = typeof certificatesTable.$inferSelect;
