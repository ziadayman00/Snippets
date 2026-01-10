"use server";

import { db } from "@/lib/drizzle/db";
import { entries, technologies } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, sql, desc, gte, and } from "drizzle-orm";
import { subDays, format } from "date-fns";

export async function getStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // 1. Total Snippets
    const totalSnippets = await db.$count(entries, eq(entries.userId, user.id));

    // 2. Most Active Technology
    const topTechResult = await db.select({
        name: technologies.name,
        count: sql<number>`count(${entries.id})`
    })
    .from(entries)
    .innerJoin(technologies, eq(entries.technologyId, technologies.id))
    .where(eq(entries.userId, user.id))
    .groupBy(technologies.name)
    .orderBy(desc(sql`count(${entries.id})`))
    .limit(1);

    const mostActiveTech = topTechResult[0]?.name || "None";

    // 3. Heatmap Data (Last 365 Days)
    const oneYearAgo = subDays(new Date(), 365);
    const activityData = await db.select({
        date: sql<string>`date(${entries.createdAt})`,
        count: sql<number>`count(${entries.id})`
    })
    .from(entries)
    .where(and(
        eq(entries.userId, user.id),
        gte(entries.createdAt, oneYearAgo)
    ))
    .groupBy(sql`date(${entries.createdAt})`);
    
    const heatmapData = activityData.map((d: { date: string, count: number }) => ({
        date: d.date, 
        count: Number(d.count),
        level: Math.min(4, Math.ceil(Number(d.count) / 2)) 
    }));

    // 4. Streak Calculation
    const datesResult = await db.select({
        date: sql<string>`date(${entries.createdAt})`
    })
    .from(entries)
    .where(eq(entries.userId, user.id))
    .groupBy(sql`date(${entries.createdAt})`)
    .orderBy(desc(sql`date(${entries.createdAt})`));

    const sortedDates = datesResult.map((d: { date: string }) => d.date);
    const dateSet = new Set(sortedDates);
    
    let streak = 0;
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    
    const hasActivityToday = dateSet.has(today);
    const hasActivityYesterday = dateSet.has(yesterday);
    
    if (hasActivityToday || hasActivityYesterday) {
        let anchor = hasActivityToday ? new Date() : subDays(new Date(), 1);
        while (true) {
            const dateStr = format(anchor, 'yyyy-MM-dd');
            if (dateSet.has(dateStr)) {
                streak++;
                anchor = subDays(anchor, 1);
            } else {
                break;
            }
        }
    }

    return {
        totalSnippets,
        mostActiveTech,
        heatmapData,
        streak
    };
}
