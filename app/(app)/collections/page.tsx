import { getUserCollections } from "@/lib/actions/collections";
import { createClient } from "@/lib/supabase/server";
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
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      
      {/* Page Header & Actions */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Collections
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Organize your knowledge into learning playlists
          </p>
        </div>

        <CreateCollectionButton />
      </header>

      {/* Collections Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <div className="h-4 w-4 flex items-center justify-center">
            <div className="h-3.5 w-[1px] bg-current opacity-50 rotate-12" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-widest">Your Collections</h2>
        </div>

        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link 
                key={collection.id} 
                href={`/collections/${collection.id}`}
                className="group relative flex flex-col rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 transition-all duration-200 hover:border-[var(--accent-primary)]/50 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] group-hover:bg-[var(--accent-primary)]/10 group-hover:text-[var(--accent-primary)] transition-colors">
                  <Library className="h-5 w-5" />
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
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
      </div>
    </div>
  );
}
