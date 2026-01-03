"use client";

import { useTransition } from "react";
import Link from "next/link";
import { MoreVertical, Trash2, Pencil } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { deleteEntry } from "@/lib/actions/entry";

type EntryCardProps = {
  entry: {
    id: string;
    title: string;
    updatedAt: Date;
  };
  technologyId: string;
};

export function EntryCard({ entry, technologyId }: EntryCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this entry?")) {
      startTransition(async () => {
        await deleteEntry(entry.id, technologyId);
      });
    }
  };

  return (
    <div className="group relative rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 transition-all hover:border-[var(--accent-primary)] hover:shadow-sm">
      <Link
        href={`/technology/${technologyId}/edit/${entry.id}`} // Clicking the card goes to Edit (or View/Edit)
        className="absolute inset-0 z-0"
      >
        <span className="sr-only">View {entry.title}</span>
      </Link>

      <div className="flex items-start justify-between relative z-10 pointer-events-none">
        <div>
          <h3 className="font-medium text-[var(--text-primary)] group-hover:text-[var(--text-primary)]">
            {entry.title}
          </h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Last updated {new Date(entry.updatedAt).toLocaleDateString()}
          </p>
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="pointer-events-auto rounded-md p-1 pb-4 text-[var(--text-secondary)] opacity-0 transition-opacity hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] group-hover:opacity-100 focus:opacity-100 focus:outline-none">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Options</span>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-1 shadow-md animate-in fade-in-0 zoom-in-95"
              align="end"
              sideOffset={5}
            >
              <DropdownMenu.Item asChild>
                <Link
                  href={`/technology/${technologyId}/edit/${entry.id}`}
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm font-medium text-[var(--text-secondary)] outline-none hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] focus:bg-[var(--bg-primary)] focus:text-[var(--text-primary)]"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="-mx-1 my-1 h-px bg-[var(--border-primary)]" />
              <DropdownMenu.Item
                disabled={isPending}
                onSelect={(e) => {
                    e.preventDefault(); // Prevent closing immediately to allow transition? No, confirm blocks.
                    handleDelete();
                }}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm font-medium text-red-400 outline-none hover:bg-red-900/10 hover:text-red-300 focus:bg-red-900/10 focus:text-red-300 pointer-events-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isPending ? "Deleting..." : "Delete"}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}
