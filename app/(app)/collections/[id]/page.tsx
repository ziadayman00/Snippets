import { getCollection } from "@/lib/actions/collections";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/dashboard/header";
import { redirect, notFound } from "next/navigation";
import { EntryCard } from "@/components/dashboard/entry-card";
import { AddEntryButton } from "@/components/collections/add-entry-button";
import { SortableList } from "@/components/collections/sortable-list";
import { ArrowLeft, BookOpen, GripVertical, ListMusic } from "lucide-react";
import Link from "next/link";

export default async function CollectionDetailsPage({
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

  const collection = await getCollection(id);

  if (!collection) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header email={user.email} />

      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-[var(--border-primary)]">
            <Link 
                href="/collections"
                className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Collections
            </Link>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex gap-4">
                    <div className="flex-shrink-0 h-16 w-16 items-center justify-center rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] hidden sm:flex">
                        <ListMusic className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                            {collection.title}
                        </h1>
                        <p className="text-[var(--text-secondary)] mt-2 max-w-2xl">
                            {collection.description || "No description provided."}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                     <AddEntryButton collectionId={collection.id} />
                     <Link
                        href={`/collections/${collection.id}/learn`}
                        className="flex items-center gap-2 rounded-lg bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:scale-105"
                     >
                        <BookOpen className="h-4 w-4" />
                        Start Learning
                     </Link>
                </div>
            </div>
        </div>

        {/* Entries List */}
        <div className="space-y-4">
            <SortableList collectionId={collection.id} items={collection.entries} />

            {collection.entries.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-[var(--border-primary)] rounded-xl bg-[var(--bg-secondary)]/50">
                    <p className="text-[var(--text-muted)] mb-4">This collection is empty.</p>
                    <AddEntryButton collectionId={collection.id} />
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
