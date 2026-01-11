"use client";

import { useState } from "react";
import { AddEntryDialog } from "./add-entry-dialog";
import { Plus } from "lucide-react";

export function AddEntryButton({ collectionId }: { collectionId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-tertiary)]"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add Snippet</span>
      </button>
      <AddEntryDialog collectionId={collectionId} open={open} onOpenChange={setOpen} />
    </>
  );
}
