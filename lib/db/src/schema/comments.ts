import { pgTable, text, serial, timestamp, index } from "drizzle-orm/pg-core";

export const commentsTable = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    lessonId: text("lesson_id").notNull(),
    authorName: text("author_name").notNull(),
    contactInfo: text("contact_info"),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("comments_lesson_id_idx").on(t.lessonId)]
);

export type Comment = typeof commentsTable.$inferSelect;
