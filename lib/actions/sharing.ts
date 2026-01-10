"use server";

import { db } from "@/lib/drizzle/db";
import { entries, technologies, snippetViews } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";

/**
 * Generate a URL-safe slug for public sharing
 */
function generateSlug(title: string): string {
  const sanitized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  
  const random = randomBytes(4).toString("hex");
  return `${sanitized}-${random}`;
}

/**
 * Toggle public visibility of a snippet
 */
export async function togglePublicVisibility(entryId: string, makePublic: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify ownership
    const [entry] = await db
      .select({ id: entries.id, title: entries.title, slug: entries.slug })
      .from(entries)
      .where(and(eq(entries.id, entryId), eq(entries.userId, user.id)))
      .limit(1);

    if (!entry) {
      throw new Error("Entry not found");
    }

    // Generate slug if making public and no slug exists
    const slug = makePublic && !entry.slug ? generateSlug(entry.title) : entry.slug;

    await db
      .update(entries)
      .set({
        isPublic: makePublic,
        slug: slug,
      })
      .where(eq(entries.id, entryId));

    revalidatePath(`/technology`);
    
    return { success: true, slug };
  } catch (error) {
    console.error("Failed to toggle visibility:", error);
    throw new Error("Failed to update visibility");
  }
}

/**
 * Get a public snippet by slug (increments view count with deduplication)
 */
export async function getPublicSnippet(slug: string, ipAddress?: string) {
  try {
    const [snippet] = await db
      .select({
        id: entries.id,
        title: entries.title,
        content: entries.content,
        createdAt: entries.createdAt,
        updatedAt: entries.updatedAt,
        views: entries.views,
        userId: entries.userId,
        technologyName: technologies.name,
        technologyIcon: technologies.icon,
      })
      .from(entries)
      .innerJoin(technologies, eq(entries.technologyId, technologies.id))
      .where(and(eq(entries.slug, slug), eq(entries.isPublic, true)))
      .limit(1);

    if (!snippet) {
      return null;
    }

    // Only increment view if IP is provided (not from OG image generation)
    if (ipAddress) {
      // Check if this IP has viewed this snippet in the last 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const [existingView] = await db
        .select()
        .from(snippetViews)
        .where(
          and(
            eq(snippetViews.entryId, snippet.id),
            eq(snippetViews.ipAddress, ipAddress),
            sql`${snippetViews.viewedAt} > ${twentyFourHoursAgo.toISOString()}`
          )
        )
        .limit(1);

      // Only count as a new view if:
      // 1. No recent view from this IP
      // 2. IP is not the owner (we'll check this in the page)
      if (!existingView) {
        // Record the view
        await db.insert(snippetViews).values({
          entryId: snippet.id,
          ipAddress,
        });

        // Increment the counter
        await db
          .update(entries)
          .set({ views: snippet.views + 1 })
          .where(eq(entries.id, snippet.id));

        return {
          ...snippet,
          views: snippet.views + 1,
        };
      }
    }

    return snippet;
  } catch (error) {
    console.error("Failed to fetch public snippet:", error);
    return null;
  }
}
