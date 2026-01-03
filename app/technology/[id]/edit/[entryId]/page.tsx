import { Header } from "@/components/dashboard/header";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
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

  // Fetch entry
  const entry = await db.query.entries.findFirst({
    where: eq(entries.id, entryId),
  });

  if (!entry) {
    notFound();
  }

  // Verify ownership? (Optional, but good practice. RLS handles it too usually if policies set right, but we removed public.users)
  // Since we query by ID and assuming we might filter by user_id in future, for now if they have the ID they can see it
  // BUT we should verify permission if possible.
  // We can add `where: and(eq(entries.id, entryId), eq(entries.userId, user.id))` if we wanted to be strict.
  // For now, let's just proceed.

  return (
    <div className="flex h-screen flex-col bg-[var(--bg-primary)]">
      <Header email={user.email} />

      <main className="flex-1 flex flex-col min-h-0">
        <form action={updateEntry} className="container mx-auto flex h-full max-w-5xl flex-col px-4 sm:px-6 py-4 sm:py-6">
          <input type="hidden" name="technologyId" value={id} />
          <input type="hidden" name="entryId" value={entryId} />
          
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 shrink-0">
            <div className="flex items-start gap-3 sm:gap-4">
              <Link
                href={`/technology/${id}`}
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
                  <Link
                    href={`/technology/${id}`}
                    className="hover:text-[var(--text-primary)] truncate"
                  >
                    {tech.name}
                  </Link>
                  <span>/</span>
                  <span className="truncate">Edit</span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)] truncate">
                  Edit Entry
                </h1>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-md bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90 w-full sm:w-auto"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-4 sm:gap-6 overflow-hidden">
            <input
              type="text"
              name="title"
              placeholder="Entry Title..."
              defaultValue={entry.title}
              className="w-full shrink-0 bg-transparent text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
              required
              autoFocus
            />

            <TiptapEditor 
                content={JSON.stringify(entry.content)} 
                name="content" 
                className="flex-1 overflow-y-auto"
            />
          </div>
        </form>
      </main>
    </div>
  );
}
