"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/drizzle/db";
import { entries, snippetLinks } from "@/lib/drizzle/schema";
import { and, eq, ilike, ne, desc } from "drizzle-orm";

export async function searchSnippets(query: string, excludeId?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // Simple title search with recency sort
  const results = await db
    .select({
      id: entries.id,
      title: entries.title,
    })
    .from(entries)
    .where(
      and(
        eq(entries.userId, user.id),
        ilike(entries.title, `%${query}%`),
        excludeId ? ne(entries.id, excludeId) : undefined
      )
    )
    .orderBy(desc(entries.updatedAt))
    .limit(5);

  return results;
}

export async function syncSnippetLinks(sourceId: string, content: any) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      throw new Error("Unauthorized");
    }

    // 1. Extract mentioned IDs from Tiptap JSON content
    const mentionedIds = new Set<string>();
    
    // Recursive function to parse Tiptap JSON
    const traverse = (node: any) => {
        if (node.type === "mention" && node.attrs?.id) {
            mentionedIds.add(node.attrs.id);
        }
        if (node.content && Array.isArray(node.content)) {
            node.content.forEach(traverse);
        }
    };

    traverse(content);

    // 2. Clear existing links for this source
    await db.delete(snippetLinks).where(eq(snippetLinks.sourceId, sourceId));

    // 3. Insert new links
    if (mentionedIds.size > 0) {
        const linksToInsert = Array.from(mentionedIds).map(targetId => ({
            sourceId: sourceId,
            targetId: targetId
        }));

        await db.insert(snippetLinks).values(linksToInsert);
    }
}
