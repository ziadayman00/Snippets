"use client";

import { deleteCollection } from "@/lib/actions/collections";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteCollectionDialog({
  collectionId,
  open,
  onOpenChange,
}: {
  collectionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);

    const result = await deleteCollection(collectionId);

    if (result.success) {
      toast.success("Collection deleted");
      onOpenChange(false);
      router.push("/collections");
    } else {
      setLoading(false);
      toast.error(result.error || "Failed to delete collection");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
          <div className="flex flex-col items-center gap-4 text-center sm:text-left sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="space-y-1 text-center sm:text-left">
               <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                Delete Collection
              </Dialog.Title>
              <Dialog.Description className="text-sm text-[var(--text-secondary)]">
                Are you sure you want to delete this collection? This action cannot be undone.
                <br />
                <span className="font-medium text-[var(--text-primary)] mt-2 block">
                    Your snippets will NOT be deleted. They will remain in your library.
                </span>
              </Dialog.Description>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-md border border-[var(--border-primary)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--bg-secondary)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex h-10 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Collection"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
