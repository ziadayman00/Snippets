import { db } from "@/lib/drizzle/db";
import { entries, technologies } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { desc, eq, and, isNotNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { FileText, Clock } from "lucide-react";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const historyEntries = await db
    .select({
      id: entries.id,
      title: entries.title,
      updatedAt: entries.updatedAt,
      technologyId: entries.technologyId,
      technologyName: technologies.name,
      isPinned: entries.isPinned,
      lastViewedAt: entries.lastViewedAt,
    })
    .from(entries)
    .leftJoin(technologies, eq(entries.technologyId, technologies.id))
    .where(and(eq(entries.userId, user.id)))
    .orderBy(desc(entries.lastViewedAt)) // Sort by last viewed
    .limit(100);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      <header>
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--accent-primary)]">
                <Clock className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">History</h1>
        </div>
        <p className="text-[var(--text-muted)]">Your recently viewed snippets.</p>
      </header>

      <div className="border border-[var(--border-primary)] rounded-lg overflow-hidden bg-[var(--bg-secondary)] shadow-sm">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50 p-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                <div className="col-span-6 pl-2">Snippet</div>
                <div className="col-span-3">Technology</div>
                <div className="col-span-3 text-right pr-2">Last Viewed</div>
            </div>

            {/* List Items */}
            <div className="divide-y divide-[var(--border-primary)]">
                {historyEntries.length === 0 ? (
                    <div className="p-8 text-center text-[var(--text-muted)] text-sm">
                        No recent activity found.
                    </div>
                ) : (
                    historyEntries.map((entry) => (
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
                                         <span>{formatDistanceToNow(new Date(entry.lastViewedAt || entry.updatedAt), { addSuffix: true })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tech Column */}
                            <div className="col-span-3 hidden sm:flex items-center gap-2">
                                {entry.technologyName && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--bg-primary)] border border-[var(--border-primary)] text-xs text-[var(--text-secondary)]">
                                        <span>{entry.technologyName}</span>
                                    </div>
                                )}
                            </div>

                            {/* Time Column */}
                            <div className="col-span-3 hidden sm:flex items-center justify-end gap-2 text-xs text-[var(--text-muted)] pr-2">
                                <Clock className="h-3 w-3" />
                                <span>{formatDistanceToNow(new Date(entry.lastViewedAt || entry.updatedAt), { addSuffix: true })}</span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
      </div>
    </div>
  );
}
