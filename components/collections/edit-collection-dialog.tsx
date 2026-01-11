"use client";

import { updateCollection } from "@/lib/actions/collections";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function EditCollectionDialog({
  collection,
  open,
  onOpenChange,
}: {
  collection: { id: string; title: string; description?: string | null };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [title, setTitle] = useState(collection.title);
  const [description, setDescription] = useState(collection.description || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("id", collection.id);
    formData.append("title", title);
    formData.append("description", description);

    const result = await updateCollection(formData);

    setLoading(false);
    if (result.success) {
      toast.success("Collection updated");
      onOpenChange(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update collection");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
          <div className="flex flex-col space-y-1.5">
            <Dialog.Title className="text-lg font-semibold">
              Edit Collection
            </Dialog.Title>
            <Dialog.Description className="text-sm text-[var(--text-secondary)]">
              Update the details of your collection.
            </Dialog.Description>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex h-10 w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--focus-ring)] focus:outline-none focus:ring-0"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--focus-ring)] focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-10 rounded-md border border-[var(--border-primary)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--bg-secondary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title}
                className="flex h-10 items-center justify-center rounded-md bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
