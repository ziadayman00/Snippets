import { getTagWithEntries } from "@/lib/actions/tags";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Header } from "@/components/dashboard/header";
import { EntryCard } from "@/components/dashboard/entry-card";
import { Tag } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header email={user.email} />

      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3 pb-6 border-b border-[var(--border-primary)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                <Tag className="h-6 w-6" />
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] capitalize">
                    {tagData.name}
                </h1>
                <p className="text-[var(--text-secondary)] mt-1">
                    {tagData.entries.length} snippet{tagData.entries.length !== 1 ? 's' : ''} tagged
                </p>
            </div>
        </div>

        {/* Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tagData.entries.map((entry) => (
                <EntryCard
                    key={entry.id}
                    entry={entry}
                    technologyId={entry.technologyId}
                    showTechnology={true}
                />
            ))}

            {tagData.entries.length === 0 && (
                <div className="col-span-full py-12 text-center text-[var(--text-muted)]">
                    <p>No snippets found for this tag.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
