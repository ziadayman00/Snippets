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
        className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-white/5"
        aria-expanded={isOpen}
      >
        Features
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Panel */}
      <div 
        className={`absolute top-full left-0 pt-2 w-[340px] transition-all duration-200 ease-out z-50 ${
          isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-1 invisible"
        }`}
      >
        <div className="rounded-2xl border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl shadow-2xl p-2 relative overflow-hidden">
             {/* Gradient glow */}
             <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

             <div className="relative z-10 space-y-1">
                 <Link 
                    href="/features/editor" 
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                 >
                    <div className="mt-0.5 h-9 w-9 shrink-0 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <Code className="h-4.5 w-4.5" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-zinc-100 group-hover:text-blue-300 transition-colors">Unified Editor</div>
                        <div className="text-xs text-zinc-500 leading-relaxed mt-0.5 group-hover:text-zinc-400">Distraction-free writing with code blocks</div>
                    </div>
                 </Link>

                 <Link 
                    href="/features/knowledge-graph" 
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                 >
                    <div className="mt-0.5 h-9 w-9 shrink-0 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                        <Database className="h-4.5 w-4.5" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">Knowledge Graph</div>
                        <div className="text-xs text-zinc-500 leading-relaxed mt-0.5 group-hover:text-zinc-400">Visualize connections between snippets</div>
                    </div>
                 </Link>

                 <Link 
                    href="/features/ai" 
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                 >
                    <div className="mt-0.5 h-9 w-9 shrink-0 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                        <Sparkles className="h-4.5 w-4.5" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-zinc-100 group-hover:text-amber-300 transition-colors">Ask AI</div>
                        <div className="text-xs text-zinc-500 leading-relaxed mt-0.5 group-hover:text-zinc-400">Chat with your personal codebase</div>
                    </div>
                 </Link>
             </div>
        </div>
      </div>
    </div>
  );
}
