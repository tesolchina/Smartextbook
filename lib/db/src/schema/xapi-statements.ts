import { pgTable, serial, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";

export const xapiStatementsTable = pgTable("xapi_statements", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id"),
  actorName: text("actor_name"),
  actorEmail: text("actor_email"),
  verb: text("verb").notNull(),
  objectId: text("object_id").notNull(),
  objectName: text("object_name"),
  resultSuccess: text("result_success"),
  resultScore: integer("result_score"),
  resultMaxScore: integer("result_max_score"),
  resultResponse: text("result_response"),
  resultCompletion: text("result_completion"),
  contextPlatform: text("context_platform"),
  raw: jsonb("raw"),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
});

export type XapiStatement = typeof xapiStatementsTable.$inferSelect;
