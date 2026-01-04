"use client";

import { Info, X } from "lucide-react";
import { useState } from "react";

export function EditorGuide() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="mb-2 flex items-start gap-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 text-sm text-[var(--text-secondary)] shadow-sm animate-in fade-in slide-in-from-top-2 relative group">
      <div className="flex items-center gap-2 font-medium text-[var(--text-primary)] shrink-0">
        <Info className="h-4 w-4 text-[var(--accent-primary)]" />
        <span>Quick Tips:</span>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
         <ul className="space-y-1 list-disc list-outside ml-4">
             <li>Click <span className="font-mono text-xs bg-[var(--bg-tertiary)] px-1 rounded">{"{ }"}</span> in the toolbar to insert a code block.</li>
             <li>Switch to <strong>Full Screen</strong> mode to see more tools (Undo, Redo, Alignment).</li>
         </ul>
          <ul className="space-y-1 list-disc list-outside ml-4">
             <li>Select any text to see a quick formatting menu.</li>
             <li>Use the "Printer" icon in Full Screen mode to export as PDF.</li>
         </ul>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors absolute top-2 right-2 md:static"
        title="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
