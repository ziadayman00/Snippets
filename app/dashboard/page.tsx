import { Header } from "@/components/dashboard/header";
import { TechCard } from "@/components/dashboard/tech-card";
import { db } from "@/lib/drizzle/db";
import { entries, technologies } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { desc, eq } from "drizzle-orm";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
      // Should be handled by middleware, but safe fallback
      return null;
  }

  // 1. Fetch technologies
  const technologiesData = await db
    .select()
    .from(technologies)
    .where(eq(technologies.userId, user.id))
    .orderBy(desc(technologies.createdAt));

  // 2. Fetch all entries for this user (only id and technologyId needed)
  const entriesData = await db
    .select({
      id: entries.id,
      technologyId: entries.technologyId,
    })
    .from(entries)
    .where(eq(entries.userId, user.id));

  // 3. Map counts in memory
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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Dashboard
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">
            Manage your knowledge base
          </p>
        </div>

        {userTechnologies.length === 0 ? (
          <div className="flex min-h-[300px] sm:min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 p-6 sm:p-8 text-center text-[var(--text-muted)]">
            <p className="max-w-[420px] text-sm sm:text-base">
              No technologies found. Start by adding a technology to
              categorize your snippets.
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
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
