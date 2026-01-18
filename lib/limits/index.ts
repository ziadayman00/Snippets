"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/drizzle/db";
import { entries, technologies, aiRequests, users } from "@/lib/drizzle/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { FREE_LIMITS, PRO_LIMITS, type LimitCheckResult, type LimitType } from "./constants";

/**
 * Check if user can perform an action based on their current usage
 */
export async function checkLimit(limitType: LimitType): Promise<LimitCheckResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get user role from database
  const [userRecord] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  const isPro = userRecord?.role === "pro";
  const limits = isPro ? PRO_LIMITS : FREE_LIMITS;

  // Get current usage based on limit type
  let current = 0;

  switch (limitType) {
    case "snippets": {
      const [result] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(entries)
        .where(eq(entries.userId, user.id));
      current = result?.count || 0;
      break;
    }

    case "technologies": {
      const [result] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(technologies)
        .where(eq(technologies.userId, user.id));
      current = result?.count || 0;
      break;
    }

    case "aiQueries": {
      // Count AI queries in the current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [result] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(aiRequests)
        .where(
          and(
            eq(aiRequests.userId, user.id),
            gte(aiRequests.createdAt, startOfMonth)
          )
        );
      current = result?.count || 0;
      break;
    }
  }

  const limit = limits[limitType === "aiQueries" ? "aiQueriesPerMonth" : limitType];
  const allowed = current < limit;

  return {
    allowed,
    current,
    limit,
    limitType,
  };
}

/**
 * Get all usage stats for the current user
 */
export async function getUsageStats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const [snippetsCheck, technologiesCheck, aiQueriesCheck] = await Promise.all([
    checkLimit("snippets"),
    checkLimit("technologies"),
    checkLimit("aiQueries"),
  ]);

  return {
    snippets: snippetsCheck,
    technologies: technologiesCheck,
    aiQueries: aiQueriesCheck,
  };
}
