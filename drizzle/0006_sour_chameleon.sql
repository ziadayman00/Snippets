CREATE TABLE "resource_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" uuid NOT NULL,
	"ip_address" text NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "is_public" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "public_slug" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "technologies" ADD COLUMN "is_public" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "technologies" ADD COLUMN "public_slug" text;--> statement-breakpoint
ALTER TABLE "technologies" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX "resource_views_resource_idx" ON "resource_views" USING btree ("resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "resource_views_ip_address_idx" ON "resource_views" USING btree ("ip_address");--> statement-breakpoint
CREATE INDEX "resource_views_viewed_at_idx" ON "resource_views" USING btree ("viewed_at");--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_public_slug_unique" UNIQUE("public_slug");--> statement-breakpoint
ALTER TABLE "technologies" ADD CONSTRAINT "technologies_public_slug_unique" UNIQUE("public_slug");