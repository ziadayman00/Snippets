import { pgTable, text, timestamp, uuid, jsonb, integer, vector, index, real, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Technologies - Categories for snippets
export const technologies = pgTable("technologies", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  // Simple slug for URL if needed, or just display name
  slug: text("slug").notNull(),
  icon: text("icon"), // Can store icon name or SVG path
  userId: uuid("user_id").notNull(), // Managed by Supabase Auth
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Public sharing fields
  isPublic: boolean("is_public").default(false).notNull(),
  publicSlug: text("public_slug").unique(),
  views: integer("views").default(0).notNull(),
}, (table) => ({
  userIdIdx: index("technologies_user_id_idx").on(table.userId),
}));

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
  lastViewedAt: timestamp("last_viewed_at"),
  
  // SRS Fields
  easinessFactor: real("easiness_factor").default(2.5).notNull(),
  repetitions: integer("repetitions").default(0).notNull(),
  interval: integer("interval").default(0).notNull(), // in days
  nextReviewDate: timestamp("next_review_date"), // null means new/not started
  
  // Public Sharing
  isPublic: boolean("is_public").default(false).notNull(),
  slug: text("slug").unique(), // Randomly generated public ID
  views: integer("views").default(0).notNull(),
}, (table) => ({
  userIdIdx: index("entries_user_id_idx").on(table.userId),
  createdAtIdx: index("entries_created_at_idx").on(table.createdAt),
  technologyIdIdx: index("entries_technology_id_idx").on(table.technologyId),
  updatedAtIdx: index("entries_updated_at_idx").on(table.updatedAt),
  nextReviewDateIdx: index("entries_next_review_date_idx").on(table.nextReviewDate),
}));

export const snippetLinks = pgTable("snippet_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceId: uuid("source_id")
    .notNull()
    .references(() => entries.id, { onDelete: "cascade" }),
  targetId: uuid("target_id")
    .notNull()
    .references(() => entries.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  sourceIdIdx: index("snippet_links_source_id_idx").on(table.sourceId),
  targetIdIdx: index("snippet_links_target_id_idx").on(table.targetId),
}));

// Embeddings - Vector representations for semantic search
export const snippetEmbeddings = pgTable("snippet_embeddings", {
  id: uuid("id").primaryKey().defaultRandom(),
  entryId: uuid("entry_id")
    .notNull()
    .references(() => entries.id, { onDelete: "cascade" })
    .unique(),
  embedding: vector("embedding", { dimensions: 768 }), // Gemini text-embedding-004 dimensions
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Snippet Views - Track unique views for analytics
export const snippetViews = pgTable("snippet_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  entryId: uuid("entry_id")
    .notNull()
    .references(() => entries.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address").notNull(),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
}, (table) => ({
  entryIdIdx: index("snippet_views_entry_id_idx").on(table.entryId),
  ipAddressIdx: index("snippet_views_ip_address_idx").on(table.ipAddress),
  viewedAtIdx: index("snippet_views_viewed_at_idx").on(table.viewedAt),
}));

// Resource Views - Unified view tracking for snippets, technologies, and collections
export const resourceViews = pgTable("resource_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  resourceType: text("resource_type").notNull(), // 'snippet', 'technology', 'collection'
  resourceId: uuid("resource_id").notNull(),
  ipAddress: text("ip_address").notNull(),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
}, (table) => ({
  resourceIdx: index("resource_views_resource_idx").on(table.resourceType, table.resourceId),
  ipAddressIdx: index("resource_views_ip_address_idx").on(table.ipAddress),
  viewedAtIdx: index("resource_views_viewed_at_idx").on(table.viewedAt),
}));

export const entriesRelations = relations(entries, ({ one, many }) => ({
  technology: one(technologies, {
    fields: [entries.technologyId],
    references: [technologies.id],
  }),
  outgoingLinks: many(snippetLinks, { relationName: "sourceSnippet" }),
  incomingLinks: many(snippetLinks, { relationName: "targetSnippet" }),
  embedding: one(snippetEmbeddings, {
    fields: [entries.id],
    references: [snippetEmbeddings.entryId],
  }),
}));

export const snippetLinksRelations = relations(snippetLinks, ({ one }) => ({
  source: one(entries, {
    fields: [snippetLinks.sourceId],
    references: [entries.id],
    relationName: "sourceSnippet",
  }),
  target: one(entries, {
    fields: [snippetLinks.targetId],
    references: [entries.id],
    relationName: "targetSnippet",
  }),
}));

export const technologiesRelations = relations(technologies, ({ many }) => ({
  entries: many(entries),
}));


// AI Usage - For rate limiting and analytics
export const aiRequests = pgTable("ai_requests", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  featureType: text("feature_type").notNull(), // 'explain' | 'refine'
  tokensUsed: integer("tokens_used").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  createdAtIdx: index("ai_requests_created_at_idx").on(table.createdAt),
}));


// Tagging System
export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("tags_user_id_idx").on(table.userId),
  nameIdx: index("tags_name_idx").on(table.name),
}));

export const entryTags = pgTable("entry_tags", {
  entryId: uuid("entry_id")
    .notNull()
    .references(() => entries.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
}, (table) => ({
    pk: index("entry_tags_pk").on(table.entryId, table.tagId), // Composite index for lookups
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  entries: many(entryTags),
}));

export const entryTagsRelations = relations(entryTags, ({ one }) => ({
  entry: one(entries, {
    fields: [entryTags.entryId],
    references: [entries.id],
  }),
  tag: one(tags, {
    fields: [entryTags.tagId],
    references: [tags.id],
  }),
}));

// Collections (Playlists)
export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // Public sharing fields
  isPublic: boolean("is_public").default(false).notNull(),
  publicSlug: text("public_slug").unique(),
  views: integer("views").default(0).notNull(),
}, (table) => ({
  userIdIdx: index("collections_user_id_idx").on(table.userId),
}));

export const collectionEntries = pgTable("collection_entries", {
  collectionId: uuid("collection_id").references(() => collections.id, { onDelete: 'cascade' }).notNull(),
  entryId: uuid("entry_id").references(() => entries.id, { onDelete: 'cascade' }), // Nullable
  technologyId: uuid("technology_id").references(() => technologies.id, { onDelete: 'cascade' }), // Nullable
  order: integer("order").notNull(), 
}, (table) => ({
  pk: index("collection_entries_pk").on(table.collectionId), // Removed compound PK for simplicity or use unique index on logic
  collectionIdIdx: index("collection_entries_collection_id_idx").on(table.collectionId),
}));

// Relations
export const collectionsRelations = relations(collections, ({ many }) => ({
  entries: many(collectionEntries),
}));

export const collectionEntriesRelations = relations(collectionEntries, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionEntries.collectionId],
    references: [collections.id],
  }),
  entry: one(entries, {
    fields: [collectionEntries.entryId],
    references: [entries.id],
  }),
  technology: one(technologies, {
    fields: [collectionEntries.technologyId],
    references: [technologies.id],
  }),
}));
