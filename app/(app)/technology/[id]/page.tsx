import { db } from "@/lib/drizzle/db";
import { entries, technologies } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { desc, eq } from "drizzle-orm";
import { Plus, Folder } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SnippetList } from "@/components/dashboard/snippet-list";
import { ShareButton } from "@/components/editor/share-button";

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
  const [tech] = await db
    .select()
    .from(technologies)
    .where(eq(technologies.id, id))
    .limit(1);

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
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      
      {/* Page Header & Actions */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            {tech.icon && <span className="mr-2">{tech.icon}</span>}
            {tech.name}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {technologyEntries.length} {technologyEntries.length === 1 ? "entry" : "entries"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ShareButton 
            resourceType="technology"
            resourceId={id}
            isPublic={tech.isPublic}
            currentSlug={tech.publicSlug}
          />
          <Link
            href={`/technology/${id}/new`}
            className="flex items-center justify-center gap-2 rounded-md bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90 w-full md:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>New Entry</span>
          </Link>
        </div>
      </header>

      {/* Entries Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <div className="h-4 w-4 flex items-center justify-center">
            <div className="h-3.5 w-[1px] bg-current opacity-50 rotate-12" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-widest">Entries</h2>
        </div>

        <SnippetList entries={technologyEntries} technologyId={id} />
      </div>
    </div>
  );
}
