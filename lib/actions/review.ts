"use server";

import { db } from "@/lib/drizzle/db";
import { entries, technologies } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { and, desc, eq, lt, or, sql, isNull, asc } from "drizzle-orm";

export async function getReviewSnippets() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 24 hours ago
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  // Fetch up to 5 random snippets that haven't been viewed in the last 24 hours
  // OR have never been viewed.
  const snippets = await db
    .select({
        id: entries.id,
        title: entries.title,
        content: entries.content,
        technologyId: entries.technologyId,
        technologyName: technologies.name,
        lastViewedAt: entries.lastViewedAt,
    })
    .from(entries)
    .innerJoin(technologies, eq(entries.technologyId, technologies.id))
    .where(eq(entries.userId, user.id))
    .orderBy(asc(entries.lastViewedAt)) // Oldest (or nulls) first
    .limit(5);

  return snippets;
}

/**
 * Get count of snippets due for review
 */
export async function getReviewCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return 0;
  }

  const now = new Date();

  const dueSnippets = await db
    .select({ count: sql<number>`count(*)` })
    .from(entries)
    .where(
      and(
        eq(entries.userId, user.id),
        or(
          lt(entries.lastViewedAt, sql`NOW() - INTERVAL '24 hours'`),
          isNull(entries.lastViewedAt)
        )
      )
    );

  return Number(dueSnippets[0]?.count || 0);
}
