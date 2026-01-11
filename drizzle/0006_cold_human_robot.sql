CREATE INDEX "idx_analytics_pages_org" ON "analytics_pages" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX "idx_analytics_pages_org_active" ON "analytics_pages" USING btree ("organisation_id","is_active");--> statement-breakpoint
CREATE INDEX "idx_departments_org" ON "departments" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX "idx_employees_org" ON "employees" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX "idx_employees_org_created" ON "employees" USING btree ("organisation_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_pr_events_org" ON "pr_events" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX "idx_pr_events_flow_lookup" ON "pr_events" USING btree ("organisation_id","pr_number","timestamp");--> statement-breakpoint
CREATE INDEX "idx_pr_events_start_step" ON "pr_events" USING btree ("organisation_id","event_type");--> statement-breakpoint
CREATE INDEX "idx_pr_events_funnel_start" ON "pr_events" USING btree ("organisation_id","event_type","created_at");--> statement-breakpoint
CREATE INDEX "idx_pr_events_org_timestamp" ON "pr_events" USING btree ("organisation_id","timestamp");--> statement-breakpoint
CREATE INDEX "idx_pr_events_org_created" ON "pr_events" USING btree ("organisation_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_productivity_org" ON "productivity" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX "idx_productivity_org_date" ON "productivity" USING btree ("organisation_id","date");--> statement-breakpoint
CREATE INDEX "idx_productivity_org_created" ON "productivity" USING btree ("organisation_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_settings_org" ON "settings" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX "idx_time_entries_org" ON "time_entries" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX "idx_time_entries_org_date" ON "time_entries" USING btree ("organisation_id","date");--> statement-breakpoint
CREATE INDEX "idx_time_entries_org_created" ON "time_entries" USING btree ("organisation_id","created_at");