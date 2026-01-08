import { getUserCollections } from "@/lib/actions/collections";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/dashboard/header";
import { redirect } from "next/navigation";
import { CreateCollectionButton } from "@/components/collections/create-collection-button";
import { Folder, Library, ListMusic } from "lucide-react";
import Link from "next/link";

export default async function CollectionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const collections = await getUserCollections();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header email={user.email} />

      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between pb-6 border-b border-[var(--border-primary)]">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                    <Library className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                        Collections
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Organize your knowledge into learning playlists.
                    </p>
                </div>
            </div>
            
            <CreateCollectionButton />
        </div>

        {/* Collections Grid */}
        {collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                    <Link 
                        key={collection.id} 
                        href={`/collections/${collection.id}`}
                        className="group relative flex flex-col rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 transition-all duration-200 hover:border-[var(--accent-primary)]/50 hover:shadow-lg hover:-translate-y-1"
                    >
                         <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] group-hover:bg-[var(--accent-primary)]/10 group-hover:text-[var(--accent-primary)] transition-colors">
                            <ListMusic className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                            {collection.title}
                        </h3>
                        {collection.description && (
                            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4 flex-1">
                                {collection.description}
                            </p>
                        )}
                        <div className="mt-auto pt-4 border-t border-[var(--border-primary)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                            <span>{collection.entries.length} items</span>
                            <span>Updated {new Date(collection.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                <div className="mb-6 rounded-full bg-[var(--bg-secondary)] p-6">
                    <Folder className="h-12 w-12 text-[var(--text-muted)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    No collections yet
                </h3>
                <p className="text-[var(--text-secondary)] max-w-sm mb-6">
                    Create a collection to group related snippets together into a comprehensive guide or course.
                </p>
                <CreateCollectionButton />
            </div>
        )}
      </main>
    </div>
  );
}
