import { pgTable, text, timestamp, uuid, jsonb, integer } from "drizzle-orm/pg-core";

// Technologies - Categories for snippets
export const technologies = pgTable("technologies", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  // Simple slug for URL if needed, or just display name
  slug: text("slug").notNull(),
  icon: text("icon"), // Can store icon name or SVG path
  userId: uuid("user_id").notNull(), // Managed by Supabase Auth
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Entries - The actual snippets
export const entries = pgTable("entries", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  title: text("title").notNull(),
  // JSONB for rich text content (TipTap)
  content: jsonb("content").notNull(),
  technologyId: uuid("technology_id")
    .notNull()
    .references(() => technologies.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(), // Managed by Supabase Auth
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


// AI Usage - For rate limiting and analytics
export const aiRequests = pgTable("ai_requests", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  featureType: text("feature_type").notNull(), // 'explain' | 'refine'
  tokensUsed: integer("tokens_used").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
