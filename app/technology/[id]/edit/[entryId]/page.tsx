import { EntryEditorWrapper } from "@/components/editor/entry-editor-wrapper";
import { updateEntry } from "@/lib/actions/entry";
import { db } from "@/lib/drizzle/db";
import { entries, technologies } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function EditEntryPage({
 params,
}: {
  params: Promise<{ id: string; entryId: string }>;
}) {
  const { id, entryId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch technology
  const tech = await db.query.technologies.findFirst({
    where: eq(technologies.id, id),
  });

  if (!tech) {
    notFound();
  }

  // Fetch entry with relations
  const entry = await db.query.entries.findFirst({
    where: eq(entries.id, entryId),
    with: {
        outgoingLinks: {
            with: { target: true }
        },
        incomingLinks: {
            with: { source: true }
        }
    }
  });

  if (!entry) {
    notFound();
  }

  // Update last viewed
  await db.update(entries)
    .set({ lastViewedAt: new Date() })
    .where(eq(entries.id, entryId));

  return (
    <div className="flex min-h-screen lg:h-screen flex-col bg-[var(--bg-primary)]">
      <main className="flex-1 flex flex-col min-h-0">
        <form action={updateEntry} className="container mx-auto flex lg:h-full max-w-6xl flex-col px-4 sm:px-6 py-4 sm:py-6">
          <input type="hidden" name="technologyId" value={id} />
          <input type="hidden" name="entryId" value={entryId} />
          
          {/* Header Actions */}
          <div className="mb-8 flex items-center justify-between gap-4 sticky top-0 z-20 bg-[var(--bg-primary)]/95 backdrop-blur py-2">
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Link
                href={`/technology/${id}`}
                className="group flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] transition-colors hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              </Link>
              <div className="h-4 w-px bg-[var(--border-primary)] mx-2" />
              <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                 <span className="truncate max-w-[150px]">{tech.name}</span>
                 <span>/</span>
                 <span>Edit</span>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-md bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] shadow-sm transition-all hover:opacity-90 active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-6 overflow-hidden max-w-5xl mx-auto w-full">
             
            {/* Title Input */}
            <div className="px-6 lg:px-0">
                <input
                  type="text"
                  name="title"
                  placeholder="Untitled Snippet"
                  defaultValue={entry.title}
                  className="w-full bg-transparent text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none border-b border-transparent focus:border-[var(--border-primary)] pb-2 transition-colors"
                  required
                  autoFocus
                  autoComplete="off"
                />
            </div>

            <EntryEditorWrapper 
                entryId={entryId}
                initialContent={entry.content}
                incomingLinks={entry.incomingLinks}
                initialOutgoingLinks={entry.outgoingLinks}
                lastUpdated={entry.updatedAt}
            />
          </div>
        </form>
      </main>
    </div>
  );
}
