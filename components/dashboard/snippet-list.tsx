"use client";

import { useState, useTransition } from "react";
import { EntryCard } from "./entry-card";
import { FileText, Trash2, X, CheckSquare, Square, Check, Loader2 } from "lucide-react";
import { deleteSnippets } from "@/lib/actions/bulk"; // You'll create this next
import { useRouter } from "next/navigation";

// Define the Entry type explicitly or import from schema type if available
type Entry = {
  id: string;
  title: string;
  updatedAt: Date;
};

type SnippetListProps = {
  entries: Entry[];
  technologyId: string;
  readonly?: boolean;
};

export function SnippetList({ entries, technologyId, readonly = false }: SnippetListProps) {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, startTransition] = useTransition();
  const router = useRouter();

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds(new Set()); // Clear selection when toggling
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === entries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(entries.map((e) => e.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} snippets?`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteSnippets(Array.from(selectedIds));
      if (result.success) {
        setIsSelectionMode(false);
        setSelectedIds(new Set());
        // Router refresh is handled in server action revalidatePath used there
      } else {
        alert("Failed to delete snippets");
      }
    });
  };

  return (
    <div>
      {/* List Header / Toolbar */}
      <div className="mb-4 flex items-center justify-end">
        {entries.length > 0 && !readonly && (
          <button
            onClick={toggleSelectionMode}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isSelectionMode
                ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {isSelectionMode ? (
              <>
                <X className="h-4 w-4" />
                Cancel Selection
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4" />
                Select Snippets
              </>
            )}
          </button>
        )}
      </div>

      {/* Selection Toolbar (Inline) */}
      {isSelectionMode && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
             <button
                onClick={selectAll}
                className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
             >
                {selectedIds.size === entries.length ? (
                    <CheckSquare className="h-4 w-4" />
                ) : (
                    <Square className="h-4 w-4" />
                )}
                Select All
             </button>
             <span className="text-sm text-[var(--text-muted)] border-l border-[var(--border-primary)] pl-3">
                {selectedIds.size} selected
             </span>
          </div>
          <div className="flex items-center gap-2">
             <button
                onClick={handleBulkDelete}
                disabled={selectedIds.size === 0 || isDeleting}
                className="flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Trash2 className="h-4 w-4" />
                )}
                Delete
             </button>
          </div>
        </div>
      )}

      {/* Snippet Grid */}
      <div className="space-y-3 sm:space-y-4">
        {entries.length === 0 ? (
            <div className="flex min-h-[250px] sm:min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 p-6 sm:p-8 text-center text-[var(--text-muted)]">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base max-w-[320px]">
                {readonly ? "No public snippets in this technology yet." : "No entries yet. Click \"New Entry\" to add your first snippet."}
              </p>
            </div>
        ) : (
          entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              technologyId={technologyId}
              selectable={isSelectionMode}
              selected={selectedIds.has(entry.id)}
              onToggleSelect={() => toggleSelect(entry.id)}
              readonly={readonly}
            />
          ))
        )}
      </div>
    </div>
  );
}
