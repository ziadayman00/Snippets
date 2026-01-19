"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/drizzle/db";
import { entries, snippetLinks } from "@/lib/drizzle/schema";
import { and, eq, ilike, ne, desc } from "drizzle-orm";
import { extractMentionContext } from "@/lib/utils/backlink-context-extractor";

export interface BacklinkWithContext {
  id: string; // link id
  sourceId: string;
  sourceTitle: string;
  sourceSlug: string | null;
  technologyId: string;
  context: string | null;
  createdAt: Date;
}

export async function getBacklinkContext(entryId: string): Promise<BacklinkWithContext[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // Fetch incoming links with source entry content
  const links = await db
    .select({
      id: snippetLinks.id,
      sourceId: snippetLinks.sourceId,
      sourceTitle: entries.title,
      sourceContent: entries.content,
      sourceSlug: entries.slug,
      technologyId: entries.technologyId,
      createdAt: snippetLinks.createdAt,
    })
    .from(snippetLinks)
    .leftJoin(entries, eq(snippetLinks.sourceId, entries.id))
    .where(eq(snippetLinks.targetId, entryId))
    .orderBy(desc(snippetLinks.createdAt));

  // Extract context for each link
  return links.map(link => {
    // If we have content, extract the context
    // If entries join failed (shouldn't happen), use defaults
    if (!link.sourceTitle) {
      return {
        id: link.id,
        sourceId: link.sourceId,
        sourceTitle: "Unknown Snippet",
        sourceSlug: null,
        technologyId: "",
        context: null,
        createdAt: link.createdAt || new Date(),
      };
    }

    return {
      id: link.id,
      sourceId: link.sourceId,
      sourceTitle: link.sourceTitle,
      sourceSlug: link.sourceSlug,
      technologyId: link.technologyId || "",
      context: extractMentionContext(link.sourceContent, entryId),
      createdAt: link.createdAt || new Date(),
    };
  });
}


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
