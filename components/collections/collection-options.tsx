"use client";

import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { EditCollectionDialog } from "@/components/collections/edit-collection-dialog";
import { DeleteCollectionDialog } from "@/components/collections/delete-collection-dialog";

interface CollectionOptionsProps {
  collection: {
    id: string;
    title: string;
    description?: string | null;
  };
}

export function CollectionOptions({ collection }: CollectionOptionsProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Options</span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
            <DropdownMenu.Content className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-1 shadow-md animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2" align="end">
                <DropdownMenu.Item 
                    onSelect={() => setShowEdit(true)}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-[var(--bg-tertiary)] focus:text-[var(--accent-primary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item 
                    onSelect={() => setShowDelete(true)}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-red-500/10 focus:text-red-500 text-red-500 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <EditCollectionDialog
        collection={collection}
        open={showEdit}
        onOpenChange={setShowEdit}
      />

      <DeleteCollectionDialog
        collectionId={collection.id}
        open={showDelete}
        onOpenChange={setShowDelete}
      />
    </>
  );
}
