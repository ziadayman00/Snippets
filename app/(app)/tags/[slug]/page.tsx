import { getTagWithEntries } from "@/lib/actions/tags";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { EntryCard } from "@/components/dashboard/entry-card";
import { Tag, Hash } from "lucide-react";

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const tagData = await getTagWithEntries(slug);

  if (!tagData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] capitalize flex items-center gap-2">
          <Hash className="h-6 w-6 text-[var(--text-muted)]" />
          {tagData.name}
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {tagData.entries.length} snippet{tagData.entries.length !== 1 ? 's' : ''} tagged
        </p>
      </header>

      {/* Tagged Entries Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <div className="h-4 w-4 flex items-center justify-center">
            <div className="h-3.5 w-[1px] bg-current opacity-50 rotate-12" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-widest">Tagged Entries</h2>
        </div>

        {tagData.entries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tagData.entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                technologyId={entry.technologyId}
                showTechnology={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <p>No snippets found for this tag.</p>
          </div>
        )}
      </div>
    </div>
  );
}
