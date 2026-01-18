"use client";

import { motion } from "motion/react";
import { 
  ChevronLeft, PanelRight, Share2, Save, MoreHorizontal, 
  Bold, Italic, Code, List, Highlighter, Search, 
  Sparkles, Command, Hash
} from "lucide-react";

export function HeroEditorVisual() {
  return (
    <div className="relative mx-auto max-w-5xl">
        {/* Glow Effects */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-primary)]/30 via-purple-500/30 to-pink-500/30 rounded-xl blur-2xl opacity-50" />
        
        {/* Window Container */}
        <div className="relative rounded-xl border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
            
            {/* Window Header / Toolbar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
                {/* Left: Breadcrumbs & Actions */}
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span className="hover:text-white transition-colors cursor-default">Personal</span>
                        <ChevronLeft className="w-3 h-3 rotate-180 opacity-50" />
                        <span className="hover:text-white transition-colors cursor-default">Algorithms</span>
                        <ChevronLeft className="w-3 h-3 rotate-180 opacity-50" />
                        <span className="text-white font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                            Rate Limiting
                        </span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-zinc-400">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Saved
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <button className="text-zinc-400 hover:text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button className="text-zinc-400 hover:text-white transition-colors">
                        <PanelRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex relative min-h-[500px]">
                {/* Editor Surface */}
                <div className="flex-1 p-8 md:p-12 font-sans">
                    
                    {/* Title Area */}
                    <div className="mb-8 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Implementing Rate Limiting <br /> with Redis
                        </h1>
                        <div className="flex items-center gap-2">
                             <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-xs text-[var(--accent-primary)]">
                                <Hash className="w-3 h-3" />
                                redis
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
                                <Hash className="w-3 h-3" />
                                backend
                            </div>
                             <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400">
                                <Hash className="w-3 h-3" />
                                security
                            </div>
                        </div>
                    </div>

                    {/* Editor Content */}
                    <div className="space-y-6 text-lg text-zinc-300 leading-relaxed max-w-3xl">
                        <p>
                            Rate limiting is a critical strategy for protecting APIs from abuse. 
                            Using <span className="text-white font-medium bg-white/5 px-1 rounded">Redis</span> specifically allows for high-performance, distributed tracking of request counts.
                        </p>
                        
                        <p>
                            Here is a simple implementation using the sliding window algorithm:
                        </p>

                        {/* Code Block Visual */}
                        <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-[#0d1117] shadow-xl my-6">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                                <span className="text-xs text-zinc-500 font-mono">middleware.ts</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500">TypeScript</span>
                                </div>
                            </div>
                            <div className="p-5 font-mono text-sm overflow-x-auto">
                                <div className="grid grid-cols-[auto_1fr] gap-4">
                                    <div className="text-right text-zinc-700 select-none space-y-1">
                                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <div key={n}>{n}</div>)}
                                    </div>
                                    <div className="space-y-1">
                                        <div><span className="text-purple-400">import</span> <span className="text-zinc-300">{`{ Redis }`}</span> <span className="text-purple-400">from</span> <span className="text-green-400">"@upstash/redis"</span>;</div>
                                        <div><span className="text-purple-400">import</span> <span className="text-zinc-300">{`{ Ratelimit }`}</span> <span className="text-purple-400">from</span> <span className="text-green-400">"@upstash/ratelimit"</span>;</div>
                                        <div>&nbsp;</div>
                                        <div><span className="text-purple-400">const</span> <span className="text-blue-400">ratelimit</span> <span className="text-zinc-300">=</span> <span className="text-purple-400">new</span> <span className="text-yellow-300">Ratelimit</span><span className="text-zinc-300">({`{`}</span></div>
                                        <div className="pl-4"><span className="text-zinc-300">redis:</span> <span className="text-blue-400">Redis</span><span className="text-zinc-300">.</span><span className="text-yellow-300">fromEnv</span><span className="text-zinc-300">(),</span></div>
                                        <div className="pl-4"><span className="text-zinc-300">limiter:</span> <span className="text-blue-400">Ratelimit</span><span className="text-zinc-300">.</span><span className="text-yellow-300">slidingWindow</span><span className="text-zinc-300">(</span><span className="text-orange-400">10</span><span className="text-zinc-300">,</span> <span className="text-green-400">"10 s"</span><span className="text-zinc-300">),</span></div>
                                        <div className="pl-4"><span className="text-zinc-300">analytics:</span> <span className="text-blue-400">true</span><span className="text-zinc-300">,</span></div>
                                        <div><span className="text-zinc-300">{`});`}</span></div>
                                        <div>&nbsp;</div>
                                        <div><span className="text-purple-400">export default async function</span> <span className="text-yellow-300">middleware</span><span className="text-zinc-300">(</span><span className="text-orange-300">request</span><span className="text-zinc-300">:</span> <span className="text-blue-400">NextRequest</span><span className="text-zinc-300">) {`{`}</span></div>
                                        <div className="pl-4"><span className="text-purple-400">const</span> <span className="text-zinc-300">ip</span> <span className="text-zinc-300">=</span> <span className="text-orange-300">request</span><span className="text-zinc-300">.</span><span className="text-zinc-300">ip</span> <span className="text-zinc-300">??</span> <span className="text-green-400">"127.0.0.1"</span><span className="text-zinc-300">;</span></div>
                                        <div className="pl-4"><span className="text-purple-400">const</span> <span className="text-zinc-300">{`{ success }`}</span> <span className="text-zinc-300">=</span> <span className="text-purple-400">await</span> <span className="text-blue-400">ratelimit</span><span className="text-zinc-300">.</span><span className="text-yellow-300">limit</span><span className="text-zinc-300">(ip);</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p>
                            This setup ensures that we don't hit our database limits unexpectedly.
                        </p>
                    </div>

                    {/* Floating Slash Command Menu (Visual Cue) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="absolute bottom-20 left-12 md:left-20 bg-zinc-900 border border-white/10 rounded-lg shadow-2xl p-1 w-64 z-20"
                    >
                        <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            Basic Blocks
                        </div>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2 px-2 py-1.5 bg-white/10 rounded text-sm text-white cursor-pointer">
                                <Code className="w-4 h-4" />
                                <span>Code Block</span>
                            </div>
                             <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded text-sm text-zinc-400 cursor-pointer">
                                <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                                <span>Ask AI...</span>
                            </div>
                            <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded text-sm text-zinc-400 cursor-pointer">
                                <List className="w-4 h-4" />
                                <span>Bullet List</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Simulated Right Sidebar (Desktop only) */}
                <div className="hidden lg:flex w-64 border-l border-white/10 bg-white/[0.01] flex-col p-6 gap-6">
                    <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">AI Context</h3>
                        <div className="space-y-3">
                             <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3">
                                <div className="flex items-center gap-2 text-xs text-purple-300 font-medium mb-1">
                                    <Sparkles className="w-3 h-3" />
                                    <span>Related</span>
                                </div>
                                <p className="text-xs text-zinc-400">
                                    Linked to <span className="text-zinc-300">API Authentication</span> snippet.
                                </p>
                            </div>
                        </div>
                    </div>

                     <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Metadata</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-600">Created</span>
                                <span className="text-zinc-400">Just now</span>
                            </div>
                             <div className="flex justify-between text-sm">
                                <span className="text-zinc-600">Language</span>
                                <span className="text-zinc-400">TypeScript</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
