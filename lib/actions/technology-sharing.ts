"use server";

import { db } from "@/lib/drizzle/db";
import { technologies, entries, resourceViews } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Generate a URL-safe slug for public sharing
 */
function generatePublicSlug(name: string): string {
  const sanitized = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 30);
  
  // Use Math.random for Edge compatibility (instead of crypto.randomBytes)
  const randomSuffix = Math.random().toString(16).substring(2, 10);
  return `${sanitized}-${randomSuffix}`;
}

/**
 * Toggle public visibility for a technology
 */
export async function toggleTechnologyPublic(technologyId: string, makePublic: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Verify ownership
    const [technology] = await db
      .select()
      .from(technologies)
      .where(and(eq(technologies.id, technologyId), eq(technologies.userId, user.id)))
      .limit(1);

    if (!technology) {
      return { success: false, error: "Technology not found" };
    }

    // Generate slug if making public and doesn't have one
    const publicSlug = makePublic && !technology.publicSlug
      ? generatePublicSlug(technology.name)
      : technology.publicSlug;

    // Update technology
    await db.transaction(async (tx) => {
        await tx
        .update(technologies)
        .set({
            isPublic: makePublic,
            publicSlug: makePublic ? publicSlug : technology.publicSlug,
        })
        .where(eq(technologies.id, technologyId));

        // If making public, cascade to all snippets
        if (makePublic) {
            // We need to ensure all snippets have slugs if they are becoming public
            // However, doing this in bulk is tricky without a loop or a custom SQL function for random slugs.
            // For now, let's assume valid slugs or update simply. 
            // Actually, best practice: fetch snippets without slugs, generate, update.
            // Or simplified: Just set isPublic = true. 
            // The user said: "all its snippets turn into public".
            
            // Let's first fetch all snippets for this tech
            const techSnippets = await tx
                .select({ id: entries.id, title: entries.title, slug: entries.slug })
                .from(entries)
                .where(eq(entries.technologyId, technologyId));

            for (const snippet of techSnippets) {
                if (!snippet.slug) {
                    const newSlug = generatePublicSlug(snippet.title);
                    await tx.update(entries)
                        .set({ isPublic: true, slug: newSlug })
                        .where(eq(entries.id, snippet.id));
                } else {
                     await tx.update(entries)
                        .set({ isPublic: true })
                        .where(eq(entries.id, snippet.id));
                }
            }
        }
    });

    // Revalidate paths
    revalidatePath(`/technology/${technologyId}`);
    if (publicSlug) {
      revalidatePath(`/shared/technology/${publicSlug}`);
    }

    return {
      success: true,
      slug: publicSlug,
      isPublic: makePublic,
    };
  } catch (error) {
    console.error("Failed to toggle technology visibility:", error);
    return { success: false, error: "Failed to update technology" };
  }
}

/**
 * Get a public technology by slug (increments view count with deduplication)
 */
export async function getPublicTechnology(slug: string, ipAddress?: string) {
  try {
    const [technology] = await db
      .select({
        id: technologies.id,
        name: technologies.name,
        icon: technologies.icon,
        createdAt: technologies.createdAt,
        views: technologies.views,
        userId: technologies.userId,
      })
      .from(technologies)
      .where(and(eq(technologies.publicSlug, slug), eq(technologies.isPublic, true)))
      .limit(1);

    if (!technology) {
      return null;
    }

    // Fetch all public snippets in this technology
    const snippets = await db
      .select({
        id: entries.id,
        title: entries.title,
        content: entries.content,
        createdAt: entries.createdAt,
        updatedAt: entries.updatedAt,
        isPublic: entries.isPublic,
        slug: entries.slug,
        views: entries.views,
        isPinned: entries.isPinned,
      })
      .from(entries)
      .where(and(
        eq(entries.technologyId, technology.id),
        eq(entries.isPublic, true)
      ));

    // Only increment view if IP is provided (not from OG image generation)
    if (ipAddress) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const [existingView] = await db
        .select()
        .from(resourceViews)
        .where(
          and(
            eq(resourceViews.resourceType, 'technology'),
            eq(resourceViews.resourceId, technology.id),
            eq(resourceViews.ipAddress, ipAddress),
            sql`${resourceViews.viewedAt} > ${twentyFourHoursAgo.toISOString()}`
          )
        )
        .limit(1);

      if (!existingView) {
        // Record the view
        await db.insert(resourceViews).values({
          resourceType: 'technology',
          resourceId: technology.id,
          ipAddress,
        });

        // Increment the counter
        await db
          .update(technologies)
          .set({ views: technology.views + 1 })
          .where(eq(technologies.id, technology.id));

        return {
          ...technology,
          snippets,
          views: technology.views + 1,
        };
      }
    }

    return {
      ...technology,
      snippets,
    };
  } catch (error) {
    console.error("Failed to fetch public technology:", error);
    return null;
  }
}
