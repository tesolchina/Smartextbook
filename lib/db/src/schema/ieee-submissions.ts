import { pgTable, text, timestamp, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ieeeSubmissionsTable = pgTable("ieee_submissions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  doi: text("doi"),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  status: text("status").notNull().default("draft"),
  teachingCaseSections: jsonb("teaching_case_sections").notNull().default({}),
  lessonData: jsonb("lesson_data").notNull().default({}),
  topicArea: text("topic_area"),
  bloomsLevel: text("blooms_level"),
  publicationYear: text("publication_year"),
  estimatedMinutes: text("estimated_minutes"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertIeeeSubmissionSchema = createInsertSchema(ieeeSubmissionsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertIeeeSubmission = z.infer<typeof insertIeeeSubmissionSchema>;
export type IeeeSubmission = typeof ieeeSubmissionsTable.$inferSelect;

export type TeachingCaseSections = {
  abstract?: string;
  learningObjectives?: string;
  caseNarrative?: string;
  discussionQuestions?: string;
  appendices?: string;
  teachingNotes?: string;
  rawText?: string;
};

export type IeeeLessonData = {
  summary?: string;
  bloomsObjectives?: Array<{ objective: string; level: string }>;
  keyConcepts?: Array<{ term: string; definition: string }>;
  glossary?: Array<{ term: string; definition: string }>;
  quizQuestions?: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
  reflectionActivities?: Array<{ prompt: string; guidance: string }>;
  mindmapCode?: string;
};
