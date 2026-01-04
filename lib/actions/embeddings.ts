"use server";

import { db } from "@/lib/drizzle/db";
import { snippetEmbeddings } from "@/lib/drizzle/schema";
import { generateEmbedding, extractSearchableText } from "@/lib/ai/embeddings";
import { eq } from "drizzle-orm";

/**
 * Generate and store embedding for an entry
 */
export async function upsertEmbedding(
  entryId: string,
  title: string,
  content: any
): Promise<void> {
  try {
    // Extract searchable text
    const text = extractSearchableText(title, content);
    
    // Generate embedding
    const embedding = await generateEmbedding(text);
    
    // Upsert to database
    await db
      .insert(snippetEmbeddings)
      .values({
        entryId,
        embedding: embedding as any, // Drizzle will handle the vector type
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: snippetEmbeddings.entryId,
        set: {
          embedding: embedding as any,
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    console.error("Failed to generate embedding:", error);
    // Don't throw - embeddings are non-critical
  }
}

/**
 * Delete embedding when entry is deleted
 */
export async function deleteEmbedding(entryId: string): Promise<void> {
  try {
    await db
      .delete(snippetEmbeddings)
      .where(eq(snippetEmbeddings.entryId, entryId));
  } catch (error) {
    console.error("Failed to delete embedding:", error);
  }
}
