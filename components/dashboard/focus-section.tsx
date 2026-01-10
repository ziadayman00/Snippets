import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Sparkles, ArrowRight, FileText, Clock } from "lucide-react";

interface FocusSectionProps {
  recentEntries: any[];
  reviewCount: number;
}

export function FocusSection({ recentEntries, reviewCount }: FocusSectionProps) {
  return (
    <section id="dashboard-focus" className="space-y-6">
      
      {/* Review Banner (if needed) */}
      {reviewCount > 0 && (
          <div id="dashboard-review" className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
              <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                      <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                      <h3 className="text-sm font-medium text-[var(--text-primary)]">Time to redisocver</h3>
                      <p className="text-xs text-[var(--text-muted)]">You have {reviewCount} snippets pending review.</p>
                  </div>
              </div>
              <Link href="/review" className="text-xs font-medium bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-3 py-1.5 rounded-md border border-[var(--border-primary)] transition-colors shadow-sm">
                  Review Now
              </Link>
          </div>
      )}

      {/* Recent Activity List */}
      <div>
        <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Activity</h2>
             <Link href="/collections" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                View all history →
             </Link>
        </div>

        <div className="border border-[var(--border-primary)] rounded-lg overflow-hidden bg-[var(--bg-secondary)] shadow-sm">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50 p-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                <div className="col-span-6 pl-2">Snippet</div>
                <div className="col-span-3">Technology</div>
                <div className="col-span-3 text-right pr-2">Last Viewed</div>
            </div>

            {/* List Items */}
            <div className="divide-y divide-[var(--border-primary)]">
                {recentEntries.length === 0 ? (
                    <div className="p-8 text-center text-[var(--text-muted)] text-sm">
                        No recent activity. Create a snippet to get started!
                    </div>
                ) : (
                    recentEntries.map((entry) => (
                        <Link
                            key={entry.id}
                            href={`/technology/${entry.technologyId}/edit/${entry.id}`}
                            className="group grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 hover:bg-[var(--bg-tertiary)] transition-colors items-center"
                        >
                            {/* Title Column */}
                            <div className="col-span-6 flex items-center gap-3 min-w-0">
                                <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)] group-hover:border-[var(--accent-primary)]/50 transition-colors">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-medium text-sm text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                                        {entry.title}
                                    </div>
                                    <div className="sm:hidden text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-2">
                                         <span>{entry.technologyName}</span>
                                         <span>•</span>
                                         <span>{formatDistanceToNow(new Date(entry.lastViewedAt), { addSuffix: true })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tech Column */}
                            <div className="col-span-3 hidden sm:flex items-center gap-2">
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--bg-primary)] border border-[var(--border-primary)] text-xs text-[var(--text-secondary)]">
                                    {entry.technologyIcon && <span>{entry.technologyIcon}</span>}
                                    <span>{entry.technologyName}</span>
                                </div>
                            </div>

                            {/* Time Column */}
                            <div className="col-span-3 hidden sm:flex items-center justify-end gap-2 text-xs text-[var(--text-muted)] pr-2">
                                <Clock className="h-3 w-3" />
                                <span>{formatDistanceToNow(new Date(entry.lastViewedAt), { addSuffix: true })}</span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
      </div>
    </section>
  );
}
