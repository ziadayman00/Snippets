"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Code, Database, Sparkles } from "lucide-react";

export function FeaturesDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className="flex items-center gap-1 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2"
        aria-expanded={isOpen}
      >
        Features
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Panel */}
      <div 
        className={`absolute top-full left-0 w-[400px] p-2 pt-4 transition-all duration-200 z-50 ${
          isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-2 invisible"
        }`}
      >
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl shadow-xl p-2 grid gap-1 relative overflow-hidden">
             {/* Gradient Border Effect */}
             <div className="absolute inset-0 bg-gradient-to-br from-[var(--border-primary)]/50 to-transparent pointer-events-none rounded-xl" />

             <Link 
                href="/features/editor" 
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors group"
             >
                <div className="mt-1 h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                    <Code className="h-4 w-4" />
                </div>
                <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">Unified Editor</div>
                    <div className="text-xs text-[var(--text-muted)] leading-relaxed">Distraction-free writing with powerful code tools.</div>
                </div>
             </Link>

             <Link 
                href="/features/knowledge-graph" 
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors group"
             >
                <div className="mt-1 h-8 w-8 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500/20 transition-colors">
                    <Database className="h-4 w-4" />
                </div>
                <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">Knowledge Graph</div>
                    <div className="text-xs text-[var(--text-muted)] leading-relaxed">Visualize connections between your snippets.</div>
                </div>
             </Link>

             <Link 
                href="/features/ai" 
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors group"
             >
                <div className="mt-1 h-8 w-8 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500/20 transition-colors">
                    <Sparkles className="h-4 w-4" />
                </div>
                <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">Ask AI</div>
                    <div className="text-xs text-[var(--text-muted)] leading-relaxed">Chat with your personal knowledge base.</div>
                </div>
             </Link>
             

        </div>
      </div>
    </div>
  );
}
