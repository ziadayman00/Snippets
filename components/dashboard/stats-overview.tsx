import { Flame, Layers, Trophy } from "lucide-react";

interface StatsProps {
    stats: {
        totalSnippets: number;
        mostActiveTech: string;
        streak: number;
    }
}

export function StatsOverview({ stats }: StatsProps) {
  return (
    <div id="dashboard-stats" className="w-full border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)] p-4 sm:p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0">
            {/* Total Snippets */}
            <div className="flex flex-col sm:border-r border-[var(--border-primary)]/50 sm:pr-6">
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    <Layers className="h-3 w-3" />
                    <span>Total Snippets</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                    {stats.totalSnippets}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                    Knowledge base size
                </div>
            </div>

            {/* Streak */}
            <div className="flex flex-col sm:border-r border-[var(--border-primary)]/50 sm:px-6">
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    <Flame className="h-3 w-3 text-orange-500" />
                    <span>Current Streak</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                    {stats.streak} <span className="text-lg font-normal text-[var(--text-muted)]">days</span>
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                    Keep it up!
                </div>
            </div>

            {/* Top Tech */}
            <div className="flex flex-col sm:pl-6">
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    <Trophy className="h-3 w-3 text-yellow-500" />
                    <span>Top Technology</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] truncate">
                    {stats.mostActiveTech || "—"}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                    Most contributions
                </div>
            </div>
        </div>
    </div>
  );
}
