CREATE INDEX "ai_requests_user_id_idx" ON "ai_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_requests_created_at_idx" ON "ai_requests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "entries_user_id_idx" ON "entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "entries_created_at_idx" ON "entries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "entries_technology_id_idx" ON "entries" USING btree ("technology_id");--> statement-breakpoint
CREATE INDEX "entries_updated_at_idx" ON "entries" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "snippet_links_source_id_idx" ON "snippet_links" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "snippet_links_target_id_idx" ON "snippet_links" USING btree ("target_id");--> statement-breakpoint
CREATE INDEX "technologies_user_id_idx" ON "technologies" USING btree ("user_id");