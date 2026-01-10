"use client";

import { Zap, Database, Code2, Cpu, Network, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function BentoGrid() {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
          Everything you need to <br />
          <span className="text-[var(--accent-primary)]">build your second brain.</span>
        </h2>
        <p className="text-lg text-[var(--text-muted)]">
          Snippets combines the speed of a notepad with the power of a vector database.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
        
        {/* Card 1: AI (Double Width) */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0F0F10] p-8 hover:border-[var(--accent-primary)]/50 transition-colors shadow-xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
            <Zap className="w-64 h-64 rotate-12" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 mb-4 border border-blue-500/20">
                <Sparkles className="w-3 h-3" />
                Gemini
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Talk to your code</h3>
              <p className="text-zinc-400 max-w-sm leading-relaxed">
                RAG-powered chat that understands your specific context. Ask "How do I handle auth?" and get answers cited from your own snippets.
              </p>
            </div>
            
            {/* Visual: Chat UI */}
            <div className="space-y-3 w-full max-w-md ml-auto">
              <div className="flex justify-end">
                <div className="bg-[#2A2A2A] text-zinc-100 px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm border border-white/10 shadow-sm">
                  Why is the API route failing 403?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm shadow-sm">
                  It looks like <code className="bg-black/20 px-1 rounded font-mono text-xs">middleware.ts</code> is blocking the request.
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Knowledge Graph (Single Width) */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0F0F10] p-8 hover:border-purple-500/50 transition-colors shadow-xl"
        >
          <div className="relative z-10 h-full flex flex-col">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Connect Everything</h3>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              Don't just store notes. Create a web of knowledge with <code>@mention</code> linking.
            </p>

            {/* Visual: Mini Nodes */}
            <div className="flex-1 min-h-[120px] relative">
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-32 h-32">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 z-10 flex items-center justify-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                     </div>
                     <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center animate-pulse">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                     </div>
                     <div className="absolute bottom-2 right-0 w-6 h-6 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center animate-pulse delay-75">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                     </div>
                     <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-white/10">
                        <line x1="50%" y1="50%" x2="0%" y2="0%" />
                        <line x1="50%" y1="50%" x2="100%" y2="90%" />
                     </svg>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Pro Editor (Single Width) */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0F0F10] p-8 hover:border-blue-500/50 transition-colors shadow-xl"
        >
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
            <Code2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">Pro Editor</h3>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Vim mode, multi-cursor, and syntax highlighting for 20+ languages.
          </p>
          
          {/* Visual: Mini Editor Frame */}
          <div className="bg-[#1A1A1A] rounded-lg border border-white/5 p-3 font-mono text-[10px] text-zinc-400 shadow-inner">
             <div className="flex gap-1.5 mb-2 opacity-50">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
             </div>
             <div><span className="text-purple-400">def</span> <span className="text-yellow-200">hello</span>():</div>
             <div className="pl-2 text-green-400">print("Hello World")</div>
          </div>
        </motion.div>

        {/* Card 4: Vector Performance (Double Width) */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0F0F10] p-8 hover:border-green-500/50 transition-colors shadow-xl flex flex-col md:flex-row items-center gap-8"
        >
           <div className="flex-1">
             <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 mb-6 border border-green-500/20">
               <Cpu className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold mb-3 text-white">Vector-Ready Performance</h3>
             <p className="text-zinc-400 max-w-md leading-relaxed">
               Your snippets are automatically embedded and stored with pgvector for millisecond-fast semantic retrieval.
             </p>
           </div>
           
           {/* Visual: Terminal Block */}
           <div className="w-full md:w-auto min-w-[300px]">
              <div className="bg-[#050505] rounded-xl border border-white/10 p-4 font-mono text-xs shadow-2xl">
                 <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-zinc-500 text-[10px]">
                    <span>TERMINAL</span>
                    <span>BASH</span>
                 </div>
                 <div className="space-y-1">
                     <div className="flex gap-2">
                        <span className="text-green-500">➜</span>
                        <span className="text-zinc-300">embedding.generate()</span>
                     </div>
                     <div className="pl-4 text-zinc-500">... 1536 dimensions generated</div>
                     <div className="flex gap-2 mt-2">
                        <span className="text-green-500">➜</span>
                        <span className="text-zinc-300">vector.query(0.89)</span>
                     </div>
                     <div className="pl-4 text-emerald-400">✓ 12ms latency</div>
                 </div>
              </div>
           </div>
        </motion.div>

      </div>
    </section>
  );
}
