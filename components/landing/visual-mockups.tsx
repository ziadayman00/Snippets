"use client";

import { motion } from "motion/react";
import { 
  ChevronRight, Search, Sparkles, Command, 
  Hash, LayoutGrid, ArrowRight
} from "lucide-react";

export function CodeEditorMockup() {
    // A simplified mini-version of the main editor for the bento grid
  return (
    <div className="rounded-lg border border-white/10 bg-[#0d1117] overflow-hidden shadow-inner">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
        </div>
        <span className="text-[10px] text-zinc-600 font-mono">auth.ts</span>
      </div>
      <div className="p-4 space-y-2 text-[10px] sm:text-xs font-mono">
        <div className="flex gap-2">
            <span className="text-zinc-700 w-4 block text-right">1</span>
            <div><span className="text-purple-400">import</span> <span className="text-zinc-300">{`{ NextAuth }`}</span> <span className="text-purple-400">from</span> <span className="text-green-400">"next-auth"</span>;</div>
        </div>
        <div className="flex gap-2">
            <span className="text-zinc-700 w-4 block text-right">2</span>
            <div>&nbsp;</div>
        </div>
        <div className="flex gap-2">
            <span className="text-zinc-700 w-4 block text-right">3</span>
            <div><span className="text-purple-400">export const</span> <span className="text-zinc-300">{`authOptions = {`}</span></div>
        </div>
        <div className="flex gap-2">
            <span className="text-zinc-700 w-4 block text-right">4</span>
            <div className="pl-2"><span className="text-zinc-300">providers: [</span></div>
        </div>
        <div className="flex gap-2 bg-blue-500/10 -mx-4 px-4 border-l-2 border-blue-500">
            <span className="text-zinc-700 w-4 block text-right">5</span>
            <div className="pl-4"><span className="text-yellow-300">GithubProvider</span><span className="text-zinc-300">({`{`}</span></div>
        </div>
         <div className="flex gap-2">
            <span className="text-zinc-700 w-4 block text-right">6</span>
            <div className="pl-6"><span className="text-zinc-300">clientId:</span> <span className="text-orange-300">process.env</span><span className="text-zinc-300">.GITHUB_ID,</span></div>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-1.5 bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded ml-8 mt-1 w-fit border border-blue-500/30">
                <Command className="w-3 h-3" />
                <span>Linked: env.local</span>
           </div>
        </div>
      </div>
    </div>
  );
}

export function AIChatMockup() {
  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="flex justify-end">
        <div className="bg-white/10 px-3 py-2 rounded-2xl rounded-tr-sm text-xs text-white max-w-[80%]">
            Explain the rate limiting logic?
        </div>
      </div>
      <div className="flex justify-start">
         <div className="bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 px-3 py-2 rounded-2xl rounded-tl-sm text-xs text-zinc-300 max-w-[90%] space-y-2">
            <p>Using a sliding window algorithm to limit requests to 10 per 10s.</p>
            <div className="flex gap-1.5 mt-2 overflow-x-auto">
                <div className="flex items-center gap-1 bg-[#0d1117] border border-white/10 px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
                    <Hash className="w-2.5 h-2.5 text-yellow-500" />
                    <span>middleware.ts</span>
                </div>
                <div className="flex items-center gap-1 bg-[#0d1117] border border-white/10 px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
                    <Hash className="w-2.5 h-2.5 text-blue-500" />
                    <span>redis.ts</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export function KnowledgeGraphMockup() {
    // Static representation of a graph
  return (
    <div className="relative h-full min-h-[200px] flex items-center justify-center p-4">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
             {/* Lines */}
            <line x1="50%" y1="50%" x2="20%" y2="30%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="30%" y2="80%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="70%" y2="70%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </svg>

        {/* Central Node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)] flex items-center justify-center shadow-[0_0_30px_rgba(var(--accent-primary),0.3)] animate-pulse">
            <div className="w-3 h-3 rounded-full bg-[var(--accent-primary)]" />
        </div>

        {/* Satellite Nodes */}
        <div className="absolute top-[30%] left-[20%] w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
        </div>
        <div className="absolute top-[20%] right-[20%] w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
             <div className="w-2 h-2 rounded-full bg-blue-500" />
        </div>
        <div className="absolute bottom-[20%] left-[30%] w-6 h-6 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
             <div className="w-1 h-1 rounded-full bg-yellow-500" />
        </div>
         <div className="absolute bottom-[30%] right-[30%] w-9 h-9 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
             <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
        </div>
    </div>
  );
}

export function SearchMockup() {
  return (
    <div className="flex flex-col gap-2 p-2 pt-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-lg">
            <Search className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-300">auth provider</span>
            <div className="ml-auto text-[10px] text-zinc-600 border border-white/5 rounded px-1">⌘K</div>
        </div>
        
        <div className="mt-2 space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                <div className="p-1 rounded bg-blue-500/20 text-blue-400">
                    <LayoutGrid className="w-3 h-3" />
                </div>
                <div className="text-xs">
                    <div className="text-zinc-200 font-medium">Authentication Config</div>
                    <div className="text-zinc-500 text-[10px]">Found in <span className="text-zinc-400">auth.ts</span></div>
                </div>
            </div>
        </div>
    </div>
  );
}
