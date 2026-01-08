"use client";

import { addEntryToCollection } from "@/lib/actions/collections";
import { searchSnippets } from "@/lib/actions/links";
import { searchTechnologies } from "@/lib/actions/technology";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, Plus, Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function AddEntryDialog({
  collectionId,
  open,
  onOpenChange,
}: {
  collectionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; title?: string; name?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'entry' | 'technology'>('entry');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuery("");
    setResults([]);
  }, [type]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
        setResults([]);
        return;
    }

    debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
            if (type === 'entry') {
                const data = await searchSnippets(value);
                setResults(data);
            } else {
                const data = await searchTechnologies(value);
                setResults(data);
            }
        } finally {
            setLoading(false);
        }
    }, 300);
  };

  const handleAdd = async (item: any) => {
    try {
        await addEntryToCollection(collectionId, item.id, type);
        onOpenChange(false);
        setQuery("");
        setResults([]);
    } catch (error) {
        alert("Failed to add entry");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
          <div className="flex flex-col space-y-1.5">
            <Dialog.Title className="text-lg font-semibold">
              Add to Collection
            </Dialog.Title>
            <Dialog.Description className="text-sm text-[var(--text-secondary)]">
              Search for content to add to your collection.
            </Dialog.Description>
          </div>

          <div className="flex items-center gap-2 p-1 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
              <button
                onClick={() => setType('entry')}
                className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${type === 'entry' ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              >
                Snippets
              </button>
              <button
                onClick={() => setType('technology')}
                className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${type === 'technology' ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              >
                Technologies
              </button>
          </div>
          
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
             <input
                value={query}
                onChange={handleSearch}
                className="flex h-10 w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] pl-9 pr-3 py-2 text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--focus-ring)] focus:outline-none focus:ring-0"
                placeholder={`Search ${type === 'entry' ? 'snippets' : 'technologies'}...`}
                autoFocus
             />
          </div>

          <div className="min-h-[200px] max-h-[300px] overflow-y-auto border border-[var(--border-primary)] rounded-md bg-[var(--bg-secondary)]/50">
             {loading ? (
                 <div className="flex items-center justify-center py-8 text-[var(--text-muted)]">
                     <Loader2 className="h-5 w-5 animate-spin" />
                 </div>
             ) : results.length > 0 ? (
                 <div className="divide-y divide-[var(--border-primary)]">
                    {results.map(r => (
                        <button
                            key={r.id}
                            onClick={() => handleAdd(r)}
                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--bg-tertiary)] transition-colors group"
                        >
                            <span className="text-sm font-medium text-[var(--text-primary)]">{r.title || r.name}</span>
                            <Plus className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]" />
                        </button>
                    ))}
                 </div>
             ) : query ? (
                 <div className="p-4 text-center text-sm text-[var(--text-muted)]">
                     No results found.
                 </div>
             ) : (
                <div className="p-4 text-center text-sm text-[var(--text-muted)]">
                    Type to search...
                </div>
             )}
          </div>

          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
