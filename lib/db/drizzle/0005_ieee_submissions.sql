CREATE TABLE IF NOT EXISTS "xapi_statements" (
        "id" serial PRIMARY KEY NOT NULL,
        "session_id" text,
        "actor_name" text,
        "actor_email" text,
        "verb" text NOT NULL,
        "object_id" text NOT NULL,
        "object_name" text,
        "result_success" text,
        "result_score" integer,
        "result_max_score" integer,
        "result_response" text,
        "result_completion" text,
        "context_platform" text,
        "raw" jsonb,
        "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "demo_completions" (
        "id" text PRIMARY KEY NOT NULL,
        "module_id" text NOT NULL,
        "module_title" text NOT NULL,
        "learner_name" text NOT NULL,
        "score" integer NOT NULL,
        "raw_score" integer NOT NULL,
        "max_score" integer NOT NULL,
        "session_id" text,
        "content_hash" text NOT NULL,
        "issued_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ieee_submissions" (
        "id" serial PRIMARY KEY NOT NULL,
        "title" text NOT NULL,
        "doi" text,
        "author_name" text NOT NULL,
        "author_email" text NOT NULL,
        "status" text DEFAULT 'draft' NOT NULL,
        "teaching_case_sections" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "lesson_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "topic_area" text,
        "blooms_level" text,
        "publication_year" text,
        "estimated_minutes" text,
        "admin_notes" text,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
