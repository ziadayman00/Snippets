"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { createEntry } from "@/lib/actions/entry";

interface QuickCreateDialogProps {
  technologies: { id: string; name: string; icon: string | null }[];
}

export function QuickCreateDialog({ technologies }: QuickCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const result = await createEntry(formData);
      if (result.success && result.entryId) {
        const technologyId = formData.get("technologyId") as string;
        router.push(`/technology/${technologyId}/edit/${result.entryId}`);
        router.refresh();
      }
      setOpen(false);
    } catch (error) {
      console.error("Failed to create entry:", error);
      alert("Failed to create entry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-primary)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Quick Create</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight text-[var(--text-primary)]">
              Quick Create Snippet
            </Dialog.Title>
            <Dialog.Description className="text-sm text-[var(--text-muted)]">
              Capture a new idea instantly.
            </Dialog.Description>
          </div>

          <form action={handleSubmit} className="grid gap-4 py-4">
             <div className="grid gap-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Technology</label>
                <select 
                    name="technologyId" 
                    required
                    defaultValue=""
                    className="flex h-10 w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-[var(--text-primary)]"
                >
                    <option value="" disabled>Select a technology...</option>
                    {technologies.map(t => (
                        <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                    ))}
                </select>
             </div>
             
             <div className="grid gap-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Title</label>
                <input
                  name="title"
                  placeholder="What did you learn?"
                  required
                  className="flex h-10 w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-[var(--text-primary)]"
                />
             </div>

             <div className="flex justify-end gap-3 mt-4">
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                    {loading && <span className="animate-spin">⏳</span>}
                    Create & Edit
                </button>
             </div>
          </form>

          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-[var(--text-secondary)]">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
