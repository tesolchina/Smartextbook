import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  chapterText: text("chapter_text").notNull(),
  summary: text("summary").notNull().default(""),
  keyConcepts: jsonb("key_concepts").notNull().default([]),
  quizQuestions: jsonb("quiz_questions").notNull().default([]),
  status: text("status").notNull().default("processing"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  llmProvider: text("llm_provider"),
  llmApiKey: text("llm_api_key"),
  llmModel: text("llm_model"),
  llmBaseUrl: text("llm_base_url"),
});

export const insertLessonSchema = createInsertSchema(lessonsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessonsTable.$inferSelect;
