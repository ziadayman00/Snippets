import { getStats } from "@/lib/actions/stats";
import { createClient } from "@/lib/supabase/server";
import { BarChart3, FileText, Flame, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const stats = await getStats();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
          Knowledge Analytics
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Track your learning progress and snippet collection
        </p>
      </header>

      {/* Key Metrics Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <div className="h-4 w-4 flex items-center justify-center">
            <div className="h-3.5 w-[1px] bg-current opacity-50 rotate-12" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-widest">Key Metrics</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Snippets"
            value={stats.totalSnippets}
            icon={FileText}
            color="text-blue-500"
            bg="bg-blue-500/10"
          />
          <StatCard
            title="Most Active Tech"
            value={stats.mostActiveTech}
            icon={TrendingUp}
            color="text-purple-500"
            bg="bg-purple-500/10"
          />
          <StatCard
            title="Current Streak"
            value={stats.streak}
            subtitle="days"
            icon={Flame}
            color="text-amber-500"
            bg="bg-amber-500/10"
          />
        </div>
      </div>

      {/* Activity Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <div className="h-4 w-4 flex items-center justify-center">
            <div className="h-3.5 w-[1px] bg-current opacity-50 rotate-12" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-widest">Activity Over Time</h2>
        </div>

        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
          {stats.heatmapData.length > 0 ? (
            <div className="text-sm text-[var(--text-secondary)]">
              Total activity days: {stats.heatmapData.length}
            </div>
          ) : (
            <div className="text-center py-8 text-[var(--text-muted)]">
              No activity data yet. Start adding snippets to see your progress!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  bg,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 transition-all hover:border-[var(--accent-primary)]/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            {title}
          </p>
          <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
            {value}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>
        <div className={`rounded-lg p-2 ${bg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
    </div>
  );
}