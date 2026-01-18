"use client";

import { motion } from "motion/react";
import { FileText, FolderGit2, Search, ArrowRight, LayoutGrid, Library } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ChaosToClarity() {
  return (
    <section className="py-32 container mx-auto px-6 overflow-hidden">
        <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
                From Chaos to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Clarity</span>
            </h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
                Stop searching through scattered notes and forgotten bookmarks. <br className="hidden md:block"/>
                Organize your code knowledge in one clean, searchable place.
            </p>
        </div>

      <div className="relative max-w-6xl mx-auto bg-[#0A0A0A] rounded-3xl border border-white/5 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            
            <div className="grid lg:grid-cols-2 min-h-[500px]">
                
                {/* LEFT: Chaos (Scattered) */}
                <div className="relative border-r border-white/5 p-12 overflow-hidden bg-black/40">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/0 via-black/0 to-black/80 pointer-events-none z-10" />
                    <div className="absolute top-6 left-6 text-sm font-mono text-zinc-500 uppercase tracking-widest z-20">Before</div>
                    
                    {/* Floating Scattered Cards */}
                    {[
                        { title: "react-hook.txt", x: 20, y: 80, rotate: -6, color: "bg-zinc-800" },
                        { title: "Untitled-1.js", x: 180, y: 40, rotate: 12, color: "bg-zinc-800" },
                         { title: "db-schema.sql", x: 50, y: 220, rotate: 8, color: "bg-zinc-800" },
                         { title: "Note from meeting", x: 240, y: 180, rotate: -12, color: "bg-zinc-700" },
                         { title: "AWS Config", x: 120, y: 340, rotate: -4, color: "bg-zinc-800" },
                    ].map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ // Random float animation
                                y: card.y,
                                x: card.x,
                                rotate: card.rotate,
                            }}
                            animate={{
                                y: [card.y, card.y - 10, card.y],
                                rotate: [card.rotate, card.rotate + 2, card.rotate - 2, card.rotate],
                            }}
                            transition={{
                                duration: 4 + i,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className={cn(
                                "absolute w-40 h-28 rounded-xl border border-white/10 shadow-2xl flex flex-col items-center justify-center gap-2 p-4",
                                card.color
                            )}
                        >
                            <FileText className="w-8 h-8 text-zinc-500 opacity-50" />
                            <div className="w-20 h-2 bg-white/10 rounded-full" />
                            <span className="text-[10px] text-zinc-500 font-mono">{card.title}</span>
                        </motion.div>
                    ))}
                </div>

                {/* RIGHT: Clarity (Organized) */}
                <div className="relative p-12 bg-gradient-to-br from-purple-500/5 to-transparent">
                     <div className="absolute top-6 left-6 text-sm font-mono text-purple-400 uppercase tracking-widest">After</div>

                     {/* Structured Grid */}
                     <div className="grid grid-cols-2 gap-4 mt-12 relative z-10">
                        {[
                            { title: "Authentication", icon: Shield, count: "12 snippets" },
                            { title: "UI Components", icon: LayoutGrid, count: "24 snippets" },
                            { title: "Database", icon: Database, count: "8 snippets" },
                            { title: "Hooks library", icon: Library, count: "15 snippets" },
                        ].map((item, i) => {
                             const Icon = item.icon;
                             return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <h4 className="text-zinc-200 font-medium text-sm mb-1">{item.title}</h4>
                                    <p className="text-zinc-500 text-xs">{item.count}</p>
                                </motion.div>
                             )
                        })}
                     </div>
                     
                     {/* Search Bar Overlay */}
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute bottom-12 left-12 right-12 p-3 rounded-full border border-white/10 bg-[#0A0A0A] shadow-xl flex items-center gap-3"
                    >
                        <Search className="w-4 h-4 text-zinc-500 ml-2" />
                        <div className="text-zinc-500 text-sm font-mono w-full">Search your knowledge...</div>
                        <div className="flex gap-1 pr-2">
                             <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-zinc-400 border border-white/5">⌘</span>
                             <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-zinc-400 border border-white/5">K</span>
                        </div>
                     </motion.div>
                </div>
            </div>
      </div>
    </section>
  );
}

// Sub-components for icon imports to work without cluttering top
import { Shield, Database } from "lucide-react";
