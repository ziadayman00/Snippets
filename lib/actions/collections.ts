"use server";

import { db } from "@/lib/drizzle/db";
import { collections, collectionEntries, entries, technologies } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCollection(title: string, description?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const [newCollection] = await db
    .insert(collections)
    .values({
        userId: user.id,
        title,
        description,
    })
    .returning();

  revalidatePath("/collections");
  return newCollection;
}

export async function getUserCollections() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  return db.query.collections.findMany({
    where: eq(collections.userId, user.id),
    orderBy: desc(collections.updatedAt),
    with: {
        entries: {
            columns: { entryId: true } // simple count check
        }
    }
  });
}

export async function getCollection(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const collection = await db.query.collections.findFirst({
    where: and(eq(collections.id, id), eq(collections.userId, user.id)),
    with: {
        entries: {
            orderBy: (entries, { asc }) => [asc(entries.order)],
            with: {
                entry: {
                    columns: { id: true, title: true, updatedAt: true, technologyId: true },
                    with: { technology: true } // to get tech name for snippet
                },
                technology: true // if it's a technology item
            }
        }
    }
  });

  return collection;
}

export async function addEntryToCollection(collectionId: string, itemId: string, type: 'entry' | 'technology' = 'entry') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Get max order
    const maxOrderResult = await db
        .select({ maxOrder: sql<number>`MAX(${collectionEntries.order})` })
        .from(collectionEntries)
        .where(eq(collectionEntries.collectionId, collectionId));
    
    const nextOrder = (maxOrderResult[0]?.maxOrder ?? -1) + 1;

    await db.insert(collectionEntries).values({
        collectionId,
        order: nextOrder,
        entryId: type === 'entry' ? itemId : null,
        technologyId: type === 'technology' ? itemId : null,
    });
    
    revalidatePath(`/collections/${collectionId}`);
    return { success: true };
}

export async function reorderCollection(
  collectionId: string,
  items: { entryId: string | null; technologyId: string | null }[]
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const collection = await db.query.collections.findFirst({
    where: and(eq(collections.id, collectionId), eq(collections.userId, user.id)),
  });

  if (!collection) {
    throw new Error("Collection not found");
  }

  await db.transaction(async (tx) => {
    for (const [index, item] of items.entries()) {
       await tx
        .update(collectionEntries)
        .set({ order: index })
        .where(
            and(
                eq(collectionEntries.collectionId, collectionId),
                item.entryId 
                    ? eq(collectionEntries.entryId, item.entryId) 
                    : eq(collectionEntries.technologyId, item.technologyId!)
            )
        );
    }
  });
  
  revalidatePath(`/collections/${collectionId}`);
  return { success: true };
}

export async function getCollectionForLearning(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const collection = await db.query.collections.findFirst({
    where: and(eq(collections.id, id), eq(collections.userId, user.id)),
    with: {
        entries: {
            orderBy: (entries, { asc }) => [asc(entries.order)],
            with: {
                entry: {
                    with: { technology: true }
                },
                technology: true
            }
        }
    }
  });

  return collection;
}
