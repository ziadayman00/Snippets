import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/drizzle/db";
import { entries, technologies, users } from "@/lib/drizzle/schema";
import { desc, eq, and, sql } from "drizzle-orm";

// Components
import { QuickCreateDialog } from "@/components/dashboard/quick-create-dialog";
import { DashboardTour } from "@/components/onboarding/dashboard-tour";
import { FocusSection } from "@/components/dashboard/focus-section";
import { LibrarySection } from "@/components/dashboard/library-section";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { SemanticSearchBar } from "@/components/search/semantic-search-bar";
import { Sparkles, Library as LibraryIcon } from "lucide-react";
import { UpgradeSuccessToast } from "@/components/upgrade/upgrade-success-toast";
import { EmptyState } from "@/components/dashboard/empty-state";
import { AISuggestions } from "@/components/dashboard/ai-suggestions";

// Actions
import { getReviewCount } from "@/lib/actions/review";
import { getStats } from "@/lib/actions/stats";
import { searchTechnologies } from "@/lib/actions/technology";
import { getUsageStats } from "@/lib/limits";
import { UsageProgress } from "@/components/upgrade/usage-progress";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user role
  const [userRecord] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  const isPro = userRecord?.role === "pro";

  // Fetch Data Parallel with error handling
  let reviewCount = 0;
  let stats: any = { totalSnippets: 0, mostActiveTech: "None", streak: 0, heatmapData: [] };
  let recentEntriesRaw: any[] = [];
  let userTechnologies: any[] = [];
  let usageStats: any = null;

  try {
    [reviewCount, stats, recentEntriesRaw, userTechnologies, usageStats] = await Promise.all([
      getReviewCount().catch(err => {
        console.error("getReviewCount failed:", err);
        return 0;
      }),
      getStats().catch(err => {
        console.error("getStats failed:", err);
        return { totalSnippets: 0, mostActiveTech: "None", streak: 0, heatmapData: [] };
      }),
      db.select({
          id: entries.id,
          title: entries.title,
          technologyId: entries.technologyId,
          lastViewedAt: entries.lastViewedAt,
          technologyName: technologies.name,
          technologyIcon: technologies.icon,
      })
      .from(entries)
      .leftJoin(technologies, eq(entries.technologyId, technologies.id))
      .where(eq(entries.userId, user.id))
      .orderBy(desc(entries.lastViewedAt))
      .limit(4)
      .catch((err: any) => {
        console.error("Recent entries query failed:", err);
        return [];
      }),
      searchTechnologies("").catch(err => {
        console.error("searchTechnologies failed:", err);
        return [];
      }),
      getUsageStats().catch(err => {
        console.error("getUsageStats failed:", err);
        return null;
      })
    ]);
  } catch (error) {
    console.error("Dashboard data fetch failed:", error);
  }

  // Transform recent entries for display
  const formattedRecent = recentEntriesRaw.map(e => ({
      id: e.id,
      title: e.title,
      technologyId: e.technologyId,
      technologyName: e.technologyName || "Unknown",
      technologyIcon: e.technologyIcon || "📝",
      lastViewedAt: e.lastViewedAt
  }));

  // Greeting based on time
  const hours = new Date().getHours();
  const greeting = hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";
  const firstName = user.user_metadata.full_name?.split(" ")[0] || "Developer";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      
      {/* 1. Page Header & Actions */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
             <div id="dashboard-ask">
                <Link
                    href="/ask"
                    className="flex items-center justify-center gap-2 rounded-md bg-[var(--bg-secondary)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] border border-[var(--border-primary)] shadow-sm transition-all hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                >
                    <Sparkles className="h-4 w-4" />
                    <span>Ask AI</span>
                </Link>
             </div>

             <div id="dashboard-collections">
                <Link
                    href="/collections"
                    className="flex items-center justify-center gap-2 rounded-md bg-[var(--bg-secondary)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] border border-[var(--border-primary)] shadow-sm transition-all hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                >
                    <LibraryIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Collections</span>
                </Link>
             </div>

             <div id="dashboard-quick-create">
                <QuickCreateDialog technologies={userTechnologies} />
             </div>
        </div>
      </header>

      {/* 2. Key Metrics Bar */}
      <StatsOverview stats={stats} />

      {/* 3. Search Bar (Full Width) */}
      <div className="w-full">
         <SemanticSearchBar />
      </div>

      {/* 4. AI Suggestions */}
      <AISuggestions />

      {/* Check if user has any snippets */}
      {formattedRecent.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* 5. Usage Progress (Free users only) */}
          {!isPro && usageStats && (
            <UsageProgress
              snippets={usageStats.snippets}
              technologies={usageStats.technologies}
              aiQueries={usageStats.aiQueries}
            />
          )}

          {/* 6. Main Content Stream */}
      <div className="space-y-12">
          
          {/* Recent Activity (List View) */}
          <FocusSection recentEntries={formattedRecent} reviewCount={reviewCount} />

          {/* Library (Grid View) */}
          <LibrarySection technologies={userTechnologies} />

          {/* Activity Heatmap */}
          <ActivityHeatmap data={stats.heatmapData} />
      </div>
        </>
      )}

       {/* Tour */}
       <DashboardTour />
       
       {/* Success Toast */}
       <Suspense fallback={null}>
         <UpgradeSuccessToast />
       </Suspense>
    </div>
  );
}
