"use client";

import { useEffect, useState } from "react";
import { Sparkles, GitCommit, Clock, Link as LinkIcon, X, ArrowRight } from "lucide-react";

export function FeatureAnnouncement() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen this version update
    // We use a specific key for this "V2" update
    const hasSeen = localStorage.getItem("snippets-update-v2-features");
    if (!hasSeen) {
      // Small delay for better UX on load (don't flash immediately)
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem("snippets-update-v2-features", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#1e1e1e] border border-[var(--border-primary)] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-32 w-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />

        {/* Header */}
        <div className="relative p-6 pt-8 text-center border-b border-[var(--border-primary)]/50 bg-[#252526]/50">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-inner">
             <Sparkles className="h-6 w-6 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mb-1">New Powers Unlocked</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            We've upgraded the editor to help you manage code like a pro.
          </p>
          
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white transition-colors p-1 hover:bg-white/10 rounded-md"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-[#1e1e1e]/80">
          
          <div className="flex gap-4 group">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
              <GitCommit className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--text-primary)]">Code Metadata</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                Add context to your snippets. Mark code as <span className="text-green-400 font-medium">Production</span>, <span className="text-yellow-400 font-medium">Ideation</span>, or <span className="text-red-400 font-medium">Deprecated</span> via the block settings.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group">
             <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-colors">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--text-primary)]">Recency Signals</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                Spot stale code instantly. The sidebar now shows a <span className="text-green-400">Fresh</span>/<span className="text-yellow-400">Aging</span> status so you know what to trust.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group">
             <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
              <LinkIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--text-primary)]">Contextual Backlinks</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                See exactly where your snippets are referenced. The new footer reveals the incoming links and the sentence context.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] flex justify-end">
          <button 
            onClick={handleDismiss}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-[#e0e0e0] transition-colors shadow-lg hover:shadow-xl transform active:scale-95 duration-100"
          >
            Got it
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
