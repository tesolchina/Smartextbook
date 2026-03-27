CREATE TABLE "courses" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"teacher_name" text NOT NULL,
	"teacher_credential" text,
	"lesson_ids" jsonb NOT NULL,
	"pass_score" integer DEFAULT 70 NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"course_title" text NOT NULL,
	"teacher_name" text NOT NULL,
	"learner_name" text NOT NULL,
	"learner_key" text NOT NULL,
	"scores" jsonb NOT NULL,
	"overall_score" integer NOT NULL,
	"content_hash" text NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL
);
