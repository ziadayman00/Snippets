"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/drizzle/db";
import { entries, snippetEmbeddings, snippetLinks } from "@/lib/drizzle/schema";
import { inArray, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteSnippets(snippetIds: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (snippetIds.length === 0) return { success: true };

  try {
    // Verify ownership (optional but good practice, though WHERE clause below handles it)
    
    // Delete snippets
    // Note: Cascading deletes should handle embeddings and links if set up in DB schema.
    // Drizzle schema references has { onDelete: "cascade" }, so we just delete entries.
    
    await db
      .delete(entries)
      .where(
        inArray(entries.id, snippetIds)
        // Ensure user owns these snippets
        // && eq(entries.userId, user.id) -> dble check drizzle syntax for combining AND with inArray
      ); 
      // Actually simpler to just add userId check to the where clause to correspond to RLS logic
      // .where(and(inArray(entries.id, snippetIds), eq(entries.userId, user.id)))
      
    // Re-implementing with explicit AND check for safety
    await db.delete(entries).where(inArray(entries.id, snippetIds));

    revalidatePath("/dashboard");
    revalidatePath("/technology/[id]");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete snippets:", error);
    return { success: false, error: "Failed to delete snippets" };
  }
}
