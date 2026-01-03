import { Header } from "@/components/dashboard/header";
import { db } from "@/lib/drizzle/db";
import { entries, technologies } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { desc, eq } from "drizzle-orm";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EntryCard } from "@/components/dashboard/entry-card";

export default async function TechnologyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch technology details
  const tech = await db.query.technologies.findFirst({
    where: eq(technologies.id, id),
  });

  if (!tech) {
    notFound();
  }

  // Fetch entries
  const technologyEntries = await db
    .select()
    .from(entries)
    .where(eq(entries.technologyId, id))
    .orderBy(desc(entries.createdAt));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header email={user.email} />

      <main className="container mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text-secondary)]">
                <Link href="/dashboard" className="hover:text-[var(--text-primary)] truncate">
                  Dashboard
                </Link>
                <span>/</span>
                <span className="truncate">{tech.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] truncate">
                {tech.name}
              </h1>
            </div>
          </div>

          <Link
            href={`/technology/${id}/new`}
            className="flex items-center justify-center gap-2 rounded-md bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>New Entry</span>
          </Link>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {technologyEntries.length === 0 ? (
            <div className="flex min-h-[250px] sm:min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 p-6 sm:p-8 text-center text-[var(--text-muted)]">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base max-w-[320px]">
                No entries yet. Click "New Entry" to add your first snippet.
              </p>
            </div>
          ) : (
            technologyEntries.map((entry) => (
              <EntryCard 
                key={entry.id} 
                entry={entry} 
                technologyId={id} 
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
