"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import { SemanticSearchBar } from "./semantic-search-bar";

export function AskAiDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 rounded-md bg-[var(--bg-secondary)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] border border-[var(--border-primary)] shadow-sm transition-all hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]">
            <Search className="h-4 w-4" />
            <span>Ask AI</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[20%] z-50 grid w-full max-w-lg translate-x-[-50%] gap-4 border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
             <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <Dialog.Title className="text-lg font-semibold text-[var(--text-primary)]">Ask Snippets</Dialog.Title>
                        <Dialog.Description className="text-sm text-[var(--text-muted)]">
                            Search your knowledge base using natural language.
                        </Dialog.Description>
                     </div>
                     <Dialog.Close className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                         <X className="h-4 w-4" />
                     </Dialog.Close>
                 </div>
                 
                 {/* Search Bar Wrapper */}
                 <div className="pt-2 pb-20"> {/* Padding bottom for dropdown space */}
                    <SemanticSearchBar />
                 </div>
             </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
