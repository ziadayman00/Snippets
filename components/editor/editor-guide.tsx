"use client";

import { Info, X, Keyboard } from "lucide-react";
import { useState } from "react";

export function EditorGuide() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="mt-4 rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-3 text-xs text-[var(--text-secondary)]">
      <div className="mb-2 flex items-center justify-between">
         <h4 className="flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
            <Keyboard className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
            Shortcuts
         </h4>
         <button 
            onClick={() => setIsVisible(false)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            title="Dismiss Tips"
         >
            <X className="h-3 w-3" />
         </button>
      </div>
      
      <ul className="space-y-1.5 opacity-80">
          <li className="flex items-start gap-2">
             <kbd className="shrink-0 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] px-1 rounded text-[10px] font-mono">@</kbd>
             <span>Link another snippet</span>
          </li>
          <li className="flex items-start gap-2">
             <kbd className="shrink-0 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] px-1 rounded text-[10px] font-mono">{"{ }"}</kbd>
             <span>Code block</span>
          </li>
          <li className="flex items-start gap-2">
             <kbd className="shrink-0 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] px-1 rounded text-[10px] font-mono">Cmd+K</kbd>
             <span>Full screen</span>
          </li>
      </ul>
    </div>
  );
}
