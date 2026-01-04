import { Header } from "@/components/dashboard/header";
import { TechCard } from "@/components/dashboard/tech-card";
import { ResumeBanner } from "@/components/dashboard/resume-banner";
import { QuickCreateDialog } from "@/components/dashboard/quick-create-dialog";
import { db } from "@/lib/drizzle/db";
import { entries, technologies } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { desc, eq, isNotNull, and } from "drizzle-orm";
import { formatDistanceToNow, differenceInHours } from "date-fns";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getReviewSnippets } from "@/lib/actions/review";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
      return null;
  }

  // 1. Fetch technologies
  const technologiesData = await db
    .select()
    .from(technologies)
    .where(eq(technologies.userId, user.id))
    .orderBy(desc(technologies.createdAt));

  // 1b. Fetch recent entries (Orientation Layer)
  const recentEntries = await db
    .select({
      id: entries.id,
      title: entries.title,
      technologyId: entries.technologyId,
      updatedAt: entries.updatedAt,
      lastViewedAt: entries.lastViewedAt,
      technologyName: technologies.name,
      technologyIcon: technologies.icon,
    })
    .from(entries)
    .innerJoin(technologies, eq(entries.technologyId, technologies.id))
    .where(
        and(eq(entries.userId, user.id), isNotNull(entries.lastViewedAt))
    )
    .orderBy(desc(entries.lastViewedAt))
    .limit(3);

  // Resume Banner Logic: Show if last viewed within 48 hours
  const mostRecent = recentEntries[0];
  const showResumeBanner = mostRecent?.lastViewedAt && 
      differenceInHours(new Date(), new Date(mostRecent.lastViewedAt)) < 48;

  // 1c. Fetch Review Snippets
  const reviewSnippets = await getReviewSnippets();

  // 2. Fetch all entries counts
  const entriesData = await db
    .select({
      id: entries.id,
      technologyId: entries.technologyId,
    })
    .from(entries)
    .where(eq(entries.userId, user.id));

  const counts: Record<string, number> = {};
  entriesData.forEach((entry) => {
    const techId = entry.technologyId;
    counts[techId] = (counts[techId] || 0) + 1;
  });

  const userTechnologies = technologiesData.map((tech) => ({
    ...tech,
    entriesCount: counts[tech.id] || 0,
  }));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header email={user.email} />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                Dashboard
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">
                Manage your knowledge base
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/ask"
              className="flex items-center gap-2 rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:border-[var(--accent-primary)]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Ask</span>
              <span className="ml-1 rounded bg-[var(--accent-primary)]/10 px-1.5 py-0.5 text-xs font-semibold text-[var(--accent-primary)]">
                BETA
              </span>
            </Link>
            <QuickCreateDialog technologies={technologiesData} />
          </div>
        </div>

        {showResumeBanner && (
            <ResumeBanner entry={mostRecent!} />
        )}

        <div className="flex flex-col gap-10">
          
          {/* ZONE 1: FOCUS AREA */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-[var(--text-muted)]">
              <Sparkles className="h-4 w-4" />
              <h2 className="text-sm font-bold uppercase tracking-widest">Focus</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentEntries.map((entry) => (
                    <Link
                        key={entry.id}
                        href={`/technology/${entry.technologyId}/edit/${entry.id}`}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 transition-all duration-300 hover:border-[var(--accent-primary)]/50 hover:shadow-md hover:-translate-y-0.5"
                    >
                        {/* Decorative gradient blob on hover */}
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-24 w-24 rounded-full bg-[var(--accent-primary)]/5 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />

                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-mono">
                                    {entry.technologyIcon ? (
                                        <span className="text-xs">{entry.technologyIcon}</span>
                                    ) : (
                                        entry.technologyName.substring(0, 1).toUpperCase()
                                    )}
                                </div>
                                <span className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                                    {entry.technologyName}
                                </span>
                            </div>
                            <h3 className="font-semibold text-[var(--text-primary)] text-lg leading-tight transition-colors line-clamp-1">
                                {entry.title}
                            </h3>
                        </div>
                        
                        <div className="mt-6 flex items-center justify-between border-t border-[var(--border-primary)]/50 pt-4">
                           <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                               {entry.lastViewedAt ? `Viewed ${formatDistanceToNow(new Date(entry.lastViewedAt), { addSuffix: true })}` : 'Recently viewed'}
                           </span>
                           <span className="text-xs font-medium text-[var(--accent-primary)] opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                               Resume →
                           </span>
                        </div>
                    </Link>
                ))}

                 {/* Rediscover Card - Styled identically to Recent Cards */}
                 <Link 
                    href="/review"
                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 transition-all duration-300 hover:border-[var(--accent-primary)]/50 hover:shadow-md hover:-translate-y-0.5"
                 >
                    {/* Decorative gradient */}
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 h-24 w-24 rounded-full bg-purple-500/5 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />

                    <div>
                        <div className="mb-3 flex items-center gap-2">
                             <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--bg-tertiary)] text-purple-400 group-hover:text-purple-500 transition-colors">
                                <Sparkles className="h-3.5 w-3.5" />
                             </div>
                             <span className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                                Review
                             </span>
                        </div>
                        <h3 className="font-semibold text-[var(--text-primary)] text-lg leading-tight transition-colors">
                            Rediscover
                        </h3>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between border-t border-[var(--border-primary)]/50 pt-4">
                        <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                            {reviewSnippets.length} snippets ready
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-[var(--text-secondary)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--text-primary)]" />
                    </div>
                 </Link>
            </div>
          </section>

          {/* ZONE 2: LIBRARY AREA */}
          <section>
             <div className="flex items-center gap-2 mb-6 text-[var(--text-muted)]">
               <div className="h-4 w-4 flex items-center justify-center">
                   <div className="h-3.5 w-[1px] bg-current opacity-50 rotate-12" />
               </div>
               <h2 className="text-sm font-bold uppercase tracking-widest">Library</h2>
             </div>

             {userTechnologies.length === 0 ? (
               <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 p-6 sm:p-8 text-center text-[var(--text-muted)]">
                 <p className="max-w-[420px] text-sm sm:text-base">
                   No technologies found. Start by adding a technology.
                 </p>
               </div>
             ) : (
               <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                 {userTechnologies.map((tech) => (
                   <TechCard
                     key={tech.id}
                     id={tech.id}
                     name={tech.name}
                     count={tech.entriesCount}
                     icon={tech.icon}
                   />
                 ))}
               </div>
             )}
          </section>
        </div>
      </main>
    </div>
  );
}
