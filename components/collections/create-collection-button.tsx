"use client";

import { useState } from "react";
import { CreateCollectionDialog } from "./create-collection-dialog";
import { Plus } from "lucide-react";

export function CreateCollectionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:scale-105"
      >
        <Plus className="h-4 w-4" />
        New Collection
      </button>
      <CreateCollectionDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
