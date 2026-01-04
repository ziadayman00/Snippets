"use server";

import { db } from "@/lib/drizzle/db";
import { entries, technologies } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, sql, desc } from "drizzle-orm";

export interface StatsData {
  totalSnippets: number;
  totalTechnologies: number;
  techDistribution: Array<{
    name: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  recentActivity: number; // Snippets created in last 7 days
}

export async function getUserStats(): Promise<StatsData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 1. Get all entries
  const allEntries = await db
    .select({
      id: entries.id,
      technologyId: entries.technologyId,
      createdAt: entries.createdAt,
    })
    .from(entries)
    .where(eq(entries.userId, user.id));

  const totalSnippets = allEntries.length;

  // 2. Calculate distribution
  const techCounts: Record<string, number> = {};
  allEntries.forEach((e) => {
    techCounts[e.technologyId] = (techCounts[e.technologyId] || 0) + 1;
  });

  // Get tech details
  const allTechnologies = await db.select().from(technologies);
  
  const techDistribution = allTechnologies
    .map((tech) => {
      const count = techCounts[tech.id] || 0;
      return {
        name: tech.name,
        count,
        percentage: totalSnippets > 0 ? Math.round((count / totalSnippets) * 100) : 0,
        color: "var(--accent-primary)",
      };
    })
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);

  // 3. Recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentActivity = allEntries.filter(
    (e) => new Date(e.createdAt) >= sevenDaysAgo
  ).length;

  return {
    totalSnippets,
    totalTechnologies: techDistribution.length,
    techDistribution,
    recentActivity,
  };
}
