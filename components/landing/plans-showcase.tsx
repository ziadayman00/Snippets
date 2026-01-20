"use client";

import React, { useRef } from "react";
import { StickyNote, Palette, Folder } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

export function PlansShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 font-mono">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
              Planning Playground
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-zinc-400 max-w-3xl mx-auto">
            Transform scattered ideas into organized action plans
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Rich Text Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="group relative md:col-span-2"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-primary)]/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-full rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 hover:border-white/20 transition-all duration-300">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-primary)]/10 mb-6"
              >
                <StickyNote className="h-6 w-6 text-[var(--accent-primary)]" />
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-3 font-mono">Rich Text Planning</h3>
              <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                Free-form writing with checklists, code blocks, and formatting. Your plans, your way.
              </p>

              {/* Visual Mockup */}
              <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-zinc-500 text-xs">Q1 Roadmap</span>
                </div>
                <div className="space-y-2 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" checked readOnly />
                    <span>Launch new feature</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" readOnly />
                    <span>Update documentation</span>
                  </div>
                  <div className="mt-3 p-2 bg-blue-500/10 rounded border border-blue-500/20 text-blue-400 text-xs">
                    💡 Remember to test on staging first
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Color Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-primary)]/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-full rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 hover:border-white/20 transition-all duration-300">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-primary)]/10 mb-6"
              >
                <Palette className="h-6 w-6 text-[var(--accent-primary)]" />
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-3 font-mono">Color Categories</h3>
              <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                Organize with muted, beautiful colors. Subtle aesthetics that don't distract.
              </p>

              {/* Color Swatches */}
              <div className="mt-6 space-y-2">
                {[
                  { name: "Work", color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
                  { name: "Personal", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
                  { name: "Ideas", color: "bg-violet-500/10 border-violet-500/20 text-violet-400" },
                ].map((cat) => (
                  <div key={cat.name} className={`px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider ${cat.color}`}>
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
