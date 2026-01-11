"use client";

import { useState, useTransition, useOptimistic } from "react";
import { EntryCard } from "./entry-card";
import { FileText, Trash2, X, CheckSquare, Square, Check, Loader2 } from "lucide-react";
import { deleteSnippets } from "@/lib/actions/bulk"; 
import { toggleEntryPin } from "@/lib/actions/entry"; // Import the action here
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

// Define the Entry type explicitly or import from schema type if available
type Entry = {
  id: string;
  title: string;
  updatedAt: Date;
  isPinned: boolean;
  technologyName?: string;
  createdAt?: Date; // Needed for sorting if not present, assume present or use updatedAt as fallback
  technologyId?: string;
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

  // Optimistic UI for Pinning
  const [optimisticEntries, setOptimisticEntries] = useOptimistic(
    entries,
    (state, toggledEntryId: string) => {
      const newState = state.map((entry) => 
        entry.id === toggledEntryId ? { ...entry, isPinned: !entry.isPinned } : entry
      );
      
      // Re-sort: Pinned first, then by date (assuming input entries are sorted by date or we stick to existing)
      // Usually Server sends sorted. But here we must enforce sort order to see movement.
      // Assuming original sort was CreatedAt DESC.
      return newState.sort((a, b) => {
        if (a.isPinned === b.isPinned) {
            // Tie-break with updatedAt if available (or keep relative order conceptually)
            // Ideally we need the exact sort logic server uses (CreatedAt).
            // For now, let's use updatedAt as proxy or just rely on stable sort if sufficient, 
            // but accurate sorting needs timestamps.
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        return a.isPinned ? -1 : 1;
      });
    }
  );

  const handleTogglePin = (entryId: string, currentPinnedState: boolean) => {
    startTransition(async () => {
        setOptimisticEntries(entryId);
        
        const formData = new FormData();
        formData.append("id", entryId);
        formData.append("isPinned", String(currentPinnedState));
        formData.append("technologyId", technologyId);
        
        await toggleEntryPin(formData);
    });
  };

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
    if (selectedIds.size === optimisticEntries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(optimisticEntries.map((e) => e.id)));
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
      } else {
        alert("Failed to delete snippets");
      }
    });
  };

  return (
    <div>
      {/* List Header / Toolbar */}
      <div className="mb-4 flex items-center justify-end">
        {optimisticEntries.length > 0 && !readonly && (
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
                {selectedIds.size === optimisticEntries.length ? (
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
      <div className="space-y-3 sm:space-y-4 relative">
        {optimisticEntries.length === 0 ? (
            <div className="flex min-h-[250px] sm:min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 p-6 sm:p-8 text-center text-[var(--text-muted)]">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base max-w-[320px]">
                {readonly ? "No public snippets in this technology yet." : "No entries yet. Click \"New Entry\" to add your first snippet."}
              </p>
            </div>
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {optimisticEntries.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <EntryCard
                  entry={entry}
                  technologyId={technologyId}
                  selectable={isSelectionMode}
                  selected={selectedIds.has(entry.id)}
                  onToggleSelect={() => toggleSelect(entry.id)}
                  readonly={readonly}
                  onTogglePin={() => handleTogglePin(entry.id, entry.isPinned)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
