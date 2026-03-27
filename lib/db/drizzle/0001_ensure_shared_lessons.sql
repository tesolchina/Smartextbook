CREATE TABLE IF NOT EXISTS "shared_lessons" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"lesson_data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" text NOT NULL,
	"author_name" text NOT NULL,
	"contact_info" text,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shared_lessons_expires_at_idx" ON "shared_lessons" USING btree ("expires_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shared_lessons_title_idx" ON "shared_lessons" USING btree ("title");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comments_lesson_id_idx" ON "comments" USING btree ("lesson_id");
