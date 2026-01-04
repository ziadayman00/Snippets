-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "ai_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"feature_type" text NOT NULL,
	"tokens_used" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "snippet_embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entry_id" uuid NOT NULL,
	"embedding" vector(1536),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "snippet_embeddings_entry_id_unique" UNIQUE("entry_id")
);
--> statement-breakpoint
CREATE TABLE "snippet_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"target_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "entries" DROP CONSTRAINT "entries_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "technologies" DROP CONSTRAINT "technologies_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "last_viewed_at" timestamp;--> statement-breakpoint
ALTER TABLE "snippet_embeddings" ADD CONSTRAINT "snippet_embeddings_entry_id_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippet_links" ADD CONSTRAINT "snippet_links_source_id_entries_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippet_links" ADD CONSTRAINT "snippet_links_target_id_entries_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."entries"("id") ON DELETE cascade ON UPDATE no action;