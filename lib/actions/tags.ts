"use server";

import { db } from "@/lib/drizzle/db";
import { tags, entryTags } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { and, eq, ilike, inArray } from "drizzle-orm";

import { entries } from "@/lib/drizzle/schema";

export async function searchTags(query: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const [tagResults, entryResults] = await Promise.all([
      db
        .select({ id: tags.id, name: tags.name })
        .from(tags)
        .where(
            and(
                eq(tags.userId, user.id),
                ilike(tags.name, `%${query}%`)
            )
        )
        .limit(5),
      
      db
        .select({ id: entries.id, title: entries.title }) // We use title as name
        .from(entries)
        .where(
            and(
                eq(entries.userId, user.id),
                ilike(entries.title, `%${query}%`)
            )
        )
        .limit(5)
  ]);

  // Merge and deduplicate
  const suggestions = new Map<string, { id: string, name: string }>();

  tagResults.forEach(t => suggestions.set(t.name.toLowerCase(), t));
  entryResults.forEach(e => {
      // If title not already suggested as a tag, add it
      if (!suggestions.has(e.title.toLowerCase())) {
          suggestions.set(e.title.toLowerCase(), { id: `entry-${e.id}`, name: e.title });
      }
  });

  return Array.from(suggestions.values()).slice(0, 10);
}

export async function getEntryTags(entryId: string) {
    const results = await db
        .select({
            id: tags.id,
            name: tags.name,
            slug: tags.slug
        })
        .from(entryTags)
        .innerJoin(tags, eq(entryTags.tagId, tags.id))
        .where(eq(entryTags.entryId, entryId));
    
    return results;
}

export async function createTag(name: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Check existing
    const existing = await db.query.tags.findFirst({
        where: and(
            eq(tags.userId, user.id),
            eq(tags.name, name) // specific name check, could also check slug
        )
    });

    if (existing) return existing;

    const [newTag] = await db.insert(tags).values({
        name,
        slug,
        userId: user.id
    }).returning();

    return newTag;
}

export async function updateEntryTags(entryId: string, tagNames: string[]) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // 1. Resolve all tags (create if missing)
    const tagIds: string[] = [];
    for (const name of tagNames) {
        const tag = await createTag(name);
        if (tag) tagIds.push(tag.id);
    }

    // 2. Clear existing relation
    await db.delete(entryTags).where(eq(entryTags.entryId, entryId));

    // 3. Insert new relations
    if (tagIds.length > 0) {
        await db.insert(entryTags).values(
            tagIds.map(tagId => ({
                entryId,
                tagId
            }))
        );
    }
}

import { technologies } from "@/lib/drizzle/schema";
import { desc } from "drizzle-orm";

export async function getTagWithEntries(slug: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // 1. Get the tag
    const tag = await db.query.tags.findFirst({
        where: and(
            eq(tags.userId, user.id),
            eq(tags.slug, slug)
        )
    });

    if (!tag) return null;

    // 2. Get entries for this tag
    const taggedEntries = await db
        .select({
            id: entries.id,
            title: entries.title,
            content: entries.content,
            technologyId: entries.technologyId,
            userId: entries.userId,
            createdAt: entries.createdAt,
            updatedAt: entries.updatedAt,
            lastViewedAt: entries.lastViewedAt,
            technologyName: technologies.name, // Join technology name
        })
        .from(entryTags)
        .innerJoin(entries, eq(entryTags.entryId, entries.id))
        .innerJoin(technologies, eq(entries.technologyId, technologies.id))
        .where(eq(entryTags.tagId, tag.id))
        .orderBy(desc(entries.updatedAt));
    
    return {
        ...tag,
        entries: taggedEntries
    };
}
