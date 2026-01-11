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
  limit: number = 10,
  technologyId?: string
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
    // Using simple linear combination:
    // Final Score = (Vector Similarity * 0.7) + (Title Match * 0.3)
    const results = await db
      .select({
        id: entries.id,
        title: entries.title,
        content: entries.content,
        technologyId: entries.technologyId,
        technologyName: technologies.name,
        technologyIcon: technologies.icon,
        similarity: sql<number>`1 - (${snippetEmbeddings.embedding} <=> ${embeddingVector}::vector)`,
        // Calculate hybrid score directly in SQL
        score: sql<number>`
          (1 - (${snippetEmbeddings.embedding} <=> ${embeddingVector}::vector)) * 0.7 + 
          (CASE WHEN ${entries.title} ILIKE ${`%${query}%`} THEN 0.3 ELSE 0 END)
        `,
      })
      .from(entries)
      .innerJoin(technologies, eq(entries.technologyId, technologies.id))
      .leftJoin(snippetEmbeddings, eq(entries.id, snippetEmbeddings.entryId))
      .where(
        and(
          eq(entries.userId, user.id),
          // Optional Technology Filter
          technologyId ? eq(entries.technologyId, technologyId) : undefined,
          // Flexible match: High similarity OR Keyword match
          or(
            ilike(entries.title, `%${query}%`),
            sql`1 - (${snippetEmbeddings.embedding} <=> ${embeddingVector}::vector) > 0.3` // Lowered threshold for hybrid
          )
        )
      )
      .orderBy(desc(sql`
        (1 - (${snippetEmbeddings.embedding} <=> ${embeddingVector}::vector)) * 0.7 + 
        (CASE WHEN ${entries.title} ILIKE ${`%${query}%`} THEN 0.3 ELSE 0 END)
      `))
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

/**
 * Fast keyword-only search for optimistic UI updates
 */
export async function keywordSearch(
  query: string,
  limit: number = 5,
  technologyId?: string
): Promise<SearchResult[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  if (!query || query.trim().length === 0) return [];

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
        technologyId ? eq(entries.technologyId, technologyId) : undefined,
        ilike(entries.title, `%${query}%`)
      )
    )
    .orderBy(desc(entries.updatedAt))
    .limit(limit);

  return results;
}
