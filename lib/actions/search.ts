"use server";

import { db } from "@/lib/drizzle/db";
import { entries, technologies, snippetEmbeddings } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { sql, desc, or, ilike, and, eq } from "drizzle-orm";
import { generateEmbedding } from "@/lib/ai/embeddings";

interface SearchResult {
  id: string;
  title: string;
  content: any;
  technologyId: string;
  technologyName: string;
  technologyIcon: string | null;
  similarity?: number;
}

/**
 * Semantic search using vector similarity
 * Falls back to keyword search if no query provided
 */
export async function semanticSearch(
  query: string,
  limit: number = 10
): Promise<SearchResult[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // If no query, return recent entries
  if (!query || query.trim().length === 0) {
    const results = await db
      .select({
        id: entries.id,
        title: entries.title,
        content: entries.content,
        technologyId: entries.technologyId,
        technologyName: technologies.name,
        technologyIcon: technologies.icon,
      })
      .from(entries)
      .innerJoin(technologies, eq(entries.technologyId, technologies.id))
      .where(eq(entries.userId, user.id))
      .orderBy(desc(entries.updatedAt))
      .limit(limit);

    return results;
  }

  try {
    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query);
    
    // Convert embedding array to proper vector format
    const embeddingVector = `[${queryEmbedding.join(',')}]`;

    // Hybrid search: Vector similarity + keyword matching
    // Using cosine similarity via pgvector's <=> operator
    const results = await db
      .select({
        id: entries.id,
        title: entries.title,
        content: entries.content,
        technologyId: entries.technologyId,
        technologyName: technologies.name,
        technologyIcon: technologies.icon,
        similarity: sql<number>`1 - (${snippetEmbeddings.embedding} <=> ${embeddingVector}::vector)`,
      })
      .from(entries)
      .innerJoin(technologies, eq(entries.technologyId, technologies.id))
      .leftJoin(snippetEmbeddings, eq(entries.id, snippetEmbeddings.entryId))
      .where(
        and(
          eq(entries.userId, user.id),
          // Boost results that match keywords OR have good semantic similarity
          or(
            ilike(entries.title, `%${query}%`),
            sql`1 - (${snippetEmbeddings.embedding} <=> ${embeddingVector}::vector) > 0.5`
          )
        )
      )
      .orderBy(desc(sql`1 - (${snippetEmbeddings.embedding} <=> ${embeddingVector}::vector)`))
      .limit(limit);

    return results;
  } catch (error) {
    console.error("Semantic search failed, falling back to keyword:", error);
    
    // Fallback to simple keyword search
    const results = await db
      .select({
        id: entries.id,
        title: entries.title,
        content: entries.content,
        technologyId: entries.technologyId,
        technologyName: technologies.name,
        technologyIcon: technologies.icon,
      })
      .from(entries)
      .innerJoin(technologies, eq(entries.technologyId, technologies.id))
      .where(
        and(
          eq(entries.userId, user.id),
          ilike(entries.title, `%${query}%`)
        )
      )
      .orderBy(desc(entries.updatedAt))
      .limit(limit);

    return results;
  }
}
