CREATE TABLE "snippet_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entry_id" uuid NOT NULL,
	"ip_address" text NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "snippet_views" ADD CONSTRAINT "snippet_views_entry_id_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "snippet_views_entry_id_idx" ON "snippet_views" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "snippet_views_ip_address_idx" ON "snippet_views" USING btree ("ip_address");--> statement-breakpoint
CREATE INDEX "snippet_views_viewed_at_idx" ON "snippet_views" USING btree ("viewed_at");