"use client";

import { deleteTechnology, updateTechnology } from "@/lib/actions/technology";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Folder, MoreVertical, Trash, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TechCardProps {
  id: string;
  name: string;
  count?: number;
}

export function TechCard({ id, name, count = 0 }: TechCardProps) {
  const [loading, setLoading] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this technology?")) {
      setLoading(true);
      await deleteTechnology(id);
      setLoading(false);
    }
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", newName);

    const result = await updateTechnology(formData);
    
    setLoading(false);
    if (result?.success) {
      setIsRenameOpen(false);
    } else {
      alert("Failed to rename");
    }
  };

  return (
    <>
      <div className="group relative flex flex-col justify-between rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 transition-all hover:border-[var(--accent-primary)] hover:shadow-sm cursor-pointer">
        <Link href={`/technology/${id}`} className="absolute inset-0 z-0 pointer-events-none" />
        
        <div className="relative z-10 flex items-start justify-between" onClick={(e) => {
          // Only navigate if not clicking on dropdown
          if (!(e.target as HTMLElement).closest('[role="button"]')) {
            window.location.href = `/technology/${id}`;
          }
        }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
              <Folder className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium leading-none tracking-tight text-[var(--text-primary)]">
                {name}
              </h3>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {count} {count === 1 ? "entry" : "entries"}
              </p>
            </div>
          </div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button 
                role="button"
                className="rounded-md p-1 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4 text-[var(--text-secondary)]" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-1 shadow-md animate-in fade-in-80 zoom-in-95"
                align="end"
              >
                <DropdownMenu.Item
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRenameOpen(true);
                  }}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm font-medium text-[var(--text-primary)] outline-none hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={(e) => {
                   e.stopPropagation();
                   handleDelete();
                  }}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm font-medium text-[var(--destructive)] outline-none hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)]"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Technology</DialogTitle>
            <DialogDescription>
              Change the name of your technology category.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRename}>
            <div className="grid gap-4 py-4">
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
