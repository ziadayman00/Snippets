"use client";

import { useTransition } from "react";
import Link from "next/link";
import { MoreVertical, Trash2, Pencil, Pin, PinOff } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { deleteEntry } from "@/lib/actions/entry";

type EntryCardProps = {
  entry: {
    id: string;
    title: string;
    updatedAt: Date;
    isPinned: boolean;
    technologyName?: string;
    technologyId?: string; // Add this
  };
  technologyId: string;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
  showTechnology?: boolean;
  readonly?: boolean;
  onTogglePin?: () => void;
};

export function EntryCard({ 
  entry, 
  technologyId, 
  selectable = false, 
  selected = false, 
  onToggleSelect,
  showTechnology = false,
  readonly = false,
  onTogglePin
}: EntryCardProps) {
  const [isPending, startTransition] = useTransition(); 

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this entry?")) {
      startTransition(async () => {
        await deleteEntry(entry.id, technologyId);
      });
    }
  };

  const navTechnologyId = entry.technologyId || technologyId;

  return (
    <div 
      className={`group relative rounded-lg border bg-[var(--bg-secondary)] p-4 transition-all hover:shadow-sm ${
        selected 
          ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/5" 
          : "border-[var(--border-primary)] hover:border-[var(--accent-primary)]"
      }`}
    >
      {/* Pinned Indicator */}
      {entry.isPinned && !selectable && (
          <div className="absolute top-0 right-0 p-2 z-10 text-[var(--accent-primary)]">
              <Pin className="h-4 w-4 fill-current rotate-45" />
          </div>
      )}

      {/* Selection Checkbox Overlay */}
      {selectable && (
        <div className="absolute top-4 right-4 z-20">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect?.();
            }}
            className="h-5 w-5 rounded border-gray-300 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] cursor-pointer"
          />
        </div>
      )}

       {/* Main Click Area */}
       {selectable ? (
         // In selection mode, clicking anywhere toggles selection
         <div 
           onClick={onToggleSelect}
           className="absolute inset-0 z-10 cursor-pointer"
         />
       ) : !readonly ? (
         // Normal mode: Link to edit
         <Link
           href={`/technology/${navTechnologyId}/edit/${entry.id}`}
           className="absolute inset-0 z-0"
         >
           <span className="sr-only">View {entry.title}</span>
         </Link>
       ) : (
          // Read-only mode: Link to public snippet view
          <Link
            href={`/shared/${entry.id ? (entry as any).slug || entry.id : '#'}`} // Fallback for type safety
            className="absolute inset-0 z-0"
          >
            <span className="sr-only">View {entry.title}</span>
          </Link>
       )}

      <div className="flex items-start justify-between relative z-10 pointer-events-none">
        <div className="pr-8"> 
          <div className="flex items-center gap-2">
              <h3 className="font-medium text-[var(--text-primary)] group-hover:text-[var(--text-primary)]">
                {entry.title}
              </h3>
          </div>
          <div className="flex items-center gap-2 mt-1">
             <p className="text-xs text-[var(--text-muted)]">
                {new Date(entry.updatedAt).toLocaleDateString()}
             </p>
             {showTechnology && entry.technologyName && (
                 <>
                    <span className="text-[var(--text-muted)]">•</span>
                    <span className="text-xs font-medium text-[var(--accent-primary)]/80">
                        {entry.technologyName}
                    </span>
                 </>
             )}
          </div>
        </div>

        {/* Options Menu - Hide in selection mode and readonly mode */}
        {!selectable && !readonly && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button 
                className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] transition-all hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] focus:outline-none focus:bg-[var(--bg-tertiary)] active:scale-95 opacity-100 lg:opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-1 shadow-md animate-in fade-in-0 zoom-in-95"
                align="end"
                sideOffset={5}
              >
                <DropdownMenu.Item 
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm font-medium text-[var(--text-secondary)] outline-none hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] focus:bg-[var(--bg-primary)] focus:text-[var(--text-primary)] pointer-events-auto"
                    onSelect={(e) => {
                        onTogglePin?.(); // Prop call
                    }}
                >
                    {entry.isPinned ? (
                        <>
                            <PinOff className="mr-2 h-4 w-4" />
                            Unpin
                        </>
                    ) : (
                        <>
                            <Pin className="mr-2 h-4 w-4" />
                            Pin
                        </>
                    )}
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <Link
                    href={`/technology/${navTechnologyId}/edit/${entry.id}`}
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
        )}
      </div>
    </div>
  );
}
