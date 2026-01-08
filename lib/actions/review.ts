"use server";

import { db } from "@/lib/drizzle/db";
import { entries, technologies } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { and, desc, eq, lt, or, sql, isNull, asc } from "drizzle-orm";
import { calculateSRS } from "@/lib/utils/srs";

export async function getReviewSnippets() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Fetch items due for review (or new items)
  // New items have null nextReviewDate
  const snippets = await db
    .select({
        id: entries.id,
        title: entries.title,
        content: entries.content,
        technologyId: entries.technologyId,
        technologyName: technologies.name,
        lastViewedAt: entries.lastViewedAt,
        // SRS info (optional display)
        interval: entries.interval,
        repetitions: entries.repetitions,
    })
    .from(entries)
    .innerJoin(technologies, eq(entries.technologyId, technologies.id))
    .where(
        and(
            eq(entries.userId, user.id),
            or(
                isNull(entries.nextReviewDate),
                lt(entries.nextReviewDate, new Date())
            )
        )
    )
    .orderBy(asc(entries.nextReviewDate)) // Overdue first
    .limit(10); // Batch of 10

  return snippets;
}

/**
 * Submit a review grade for an entry
 * Grade: 0-5
 */
export async function submitReview(entryId: string, grade: number) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Fetch current stats
    const entry = await db.query.entries.findFirst({
        where: and(eq(entries.id, entryId), eq(entries.userId, user.id)),
        columns: {
            interval: true,
            repetitions: true,
            easinessFactor: true,
        }
    });

    if (!entry) throw new Error("Entry not found");

    // Calculate new stats
    const result = calculateSRS(
        grade,
        entry.interval,
        entry.repetitions,
        entry.easinessFactor
    );

    // Calculate next date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + result.interval);

    // Update DB
    await db.update(entries)
        .set({
            interval: result.interval,
            repetitions: result.repetitions,
            easinessFactor: result.easinessFactor,
            nextReviewDate: nextDate,
            lastViewedAt: new Date(),
        })
        .where(eq(entries.id, entryId));
    
    return { success: true, nextDate };
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

  const dueSnippets = await db
    .select({ count: sql<number>`count(*)` })
    .from(entries)
    .where(
      and(
        eq(entries.userId, user.id),
        or(
            isNull(entries.nextReviewDate),
            lt(entries.nextReviewDate, new Date())
        )
      )
    );

  return Number(dueSnippets[0]?.count || 0);
}

