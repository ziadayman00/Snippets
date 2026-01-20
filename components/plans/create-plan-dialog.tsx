"use client";

import { createPlan } from "@/lib/actions/plans";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, X, Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CreatePlanDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    const result = await createPlan(formData);

    setLoading(false);
    if (result.success) {
      setTitle("");
      setDescription("");
      setOpen(false);
      // router.push(`/plans/${result.data.id}`); // Optional: navigate to plan or just refresh
      router.refresh(); 
      toast.success("Plan created successfully");
    } else {
      toast.error(result.error || "Failed to create plan");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
            <button className="flex items-center gap-2 rounded-md bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90">
                <Plus className="h-4 w-4" />
                <span>New Plan</span>
            </button>
        </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
              Create New Plan
            </Dialog.Title>
            <Dialog.Description className="text-sm text-[var(--text-secondary)]">
              Start a new plan to organize your tasks and ideas.
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
                placeholder="e.g. Migration Strategy"
                autoFocus
                required
              />
            </div>
            <div className="grid gap-2">
               <label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                 className="flex h-20 w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--focus-ring)] focus:outline-none focus:ring-0 resize-none"
                placeholder="Brief summary..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-10 rounded-md border border-[var(--border-primary)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--bg-secondary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title}
                className="flex h-10 items-center justify-center rounded-md bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Plan"}
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
