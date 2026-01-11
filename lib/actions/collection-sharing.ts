"use server";

import { db } from "@/lib/drizzle/db";
import { collections, collectionEntries, entries, technologies, resourceViews } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, and, sql, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Generate a URL-safe slug for public sharing
 */
function generatePublicSlug(title: string): string {
  const sanitized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 30);
  
  // Use Math.random for Edge compatibility (instead of crypto.randomBytes)
  const randomSuffix = Math.random().toString(16).substring(2, 10);
  return `${sanitized}-${randomSuffix}`;
}

/**
 * Toggle public visibility for a collection
 */
export async function toggleCollectionPublic(collectionId: string, makePublic: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Verify ownership
    const [collection] = await db
      .select()
      .from(collections)
      .where(and(eq(collections.id, collectionId), eq(collections.userId, user.id)))
      .limit(1);

    if (!collection) {
      return { success: false, error: "Collection not found" };
    }

    // Generate slug if making public and doesn't have one
    const publicSlug = makePublic && !collection.publicSlug
      ? generatePublicSlug(collection.title)
      : collection.publicSlug;

    // Update collection
    await db
      .update(collections)
      .set({
        isPublic: makePublic,
        publicSlug: makePublic ? publicSlug : collection.publicSlug,
      })
      .where(eq(collections.id, collectionId));

    // Revalidate paths
    revalidatePath(`/collections/${collectionId}`);
    if (publicSlug) {
      revalidatePath(`/shared/collection/${publicSlug}`);
    }

    return {
      success: true,
      slug: publicSlug,
      isPublic: makePublic,
    };
  } catch (error) {
    console.error("Failed to toggle collection visibility:", error);
    return { success: false, error: "Failed to update collection" };
  }
}

/**
 * Get a public collection by slug (increments view count with deduplication)
 */
export async function getPublicCollection(slug: string, ipAddress?: string) {
  try {
    const [collection] = await db
      .select({
        id: collections.id,
        title: collections.title,
        description: collections.description,
        createdAt: collections.createdAt,
        updatedAt: collections.updatedAt,
        views: collections.views,
        userId: collections.userId,
      })
      .from(collections)
      .where(and(eq(collections.publicSlug, slug), eq(collections.isPublic, true)))
      .limit(1);

    if (!collection) {
      return null;
    }

    // 1. Fetch all connection items first to preserve order
    const items = await db
      .select({
        entryId: collectionEntries.entryId,
        technologyId: collectionEntries.technologyId,
        order: collectionEntries.order,
      })
      .from(collectionEntries)
      .where(eq(collectionEntries.collectionId, collection.id))
      .orderBy(collectionEntries.order);

    // 2. Extract IDs
    const entryIds = items.map(i => i.entryId).filter((id): id is string => id !== null);
    const techIds = items.map(i => i.technologyId).filter((id): id is string => id !== null);

    // 3. Fetch public content in parallel
    const [publicEntries, publicTechnologies] = await Promise.all([
      entryIds.length > 0 
        ? db
            .select({
              id: entries.id,
              title: entries.title,
              content: entries.content,
              createdAt: entries.createdAt,
              updatedAt: entries.updatedAt,
              isPublic: entries.isPublic,
              slug: entries.slug,
              views: entries.views,
              technologyId: entries.technologyId,
              technologyName: technologies.name,
              technologyIcon: technologies.icon,
            })
            .from(entries)
            .innerJoin(technologies, eq(entries.technologyId, technologies.id))
            .where(and(inArray(entries.id, entryIds), eq(entries.isPublic, true)))
        : Promise.resolve([]),
      
      techIds.length > 0
        ? db
            .select()
            .from(technologies)
            .where(and(inArray(technologies.id, techIds), eq(technologies.isPublic, true)))
        : Promise.resolve([])
    ]);

    // 4. Map back to preserved order
    const collectionItems = items.map(item => {
      if (item.entryId) {
        const entry = publicEntries.find(e => e.id === item.entryId);
        if (!entry) return null;
        return {
          type: 'snippet',
          data: entry,
          order: item.order
        };
      } else if (item.technologyId) {
        const tech = publicTechnologies.find(t => t.id === item.technologyId);
        if (!tech) return null;
        return {
          type: 'technology',
          data: tech,
          order: item.order
        };
      }
      return null;
    }).filter((item): item is NonNullable<typeof item> => item !== null);

    // Only increment view if IP is provided (not from OG image generation)
    if (ipAddress) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const [existingView] = await db
        .select()
        .from(resourceViews)
        .where(
          and(
            eq(resourceViews.resourceType, 'collection'),
            eq(resourceViews.resourceId, collection.id),
            eq(resourceViews.ipAddress, ipAddress),
            sql`${resourceViews.viewedAt} > ${twentyFourHoursAgo.toISOString()}`
          )
        )
        .limit(1);

      if (!existingView) {
        // Record the view
        await db.insert(resourceViews).values({
          resourceType: 'collection',
          resourceId: collection.id,
          ipAddress,
        });

        // Increment the counter
        await db
          .update(collections)
          .set({ views: collection.views + 1 })
          .where(eq(collections.id, collection.id));

        return {
          ...collection,
          entries: collectionItems,
          views: collection.views + 1,
        };
      }
    }

    return {
      ...collection,
      entries: collectionItems,
    };
  } catch (error) {
    console.error("Failed to fetch public collection:", error);
    return null;
  }
}
