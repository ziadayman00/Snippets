"use client";

import { motion } from "motion/react";
import { Share2, Eye, Copy, Globe } from "lucide-react";
import Link from "next/link";

export function SharingShowcase() {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        
        {/* Left: Visual Demo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Mock Editor Window */}
          <div className="relative rounded-xl border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-medium"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Public
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <div className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs">
                  React
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>127 views</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white">Custom Hooks Guide</h3>
              <div className="bg-[#1A1A1A] rounded-lg p-4 font-mono text-xs text-zinc-300 space-y-1">
                <div><span className="text-purple-400">const</span> <span className="text-yellow-200">useDebounce</span> = (value, delay) =&gt; {"{"}</div>
                <div className="pl-4"><span className="text-purple-400">const</span> [debouncedValue, setDebouncedValue]...</div>
                <div className="pl-4"><span className="text-green-400">// Implementation</span></div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>

          {/* Floating Share Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute -bottom-4 -right-4 px-4 py-2 rounded-full bg-green-500 text-white text-sm font-medium shadow-lg flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Link Copied!
          </motion.div>
        </motion.div>

        {/* Right: Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium">
            <Share2 className="w-4 h-4" />
            New Feature
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Share your knowledge<br />in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">seconds</span>
          </h2>

          <p className="text-lg text-zinc-400 leading-relaxed">
            Turn any snippet into a beautiful, shareable link. Perfect for team collaboration, documentation, or showing off your code on social media.
          </p>

          <ul className="space-y-4">
            {[
              { icon: Globe, text: "Beautiful public links with syntax highlighting" },
              { icon: Eye, text: "Track views and see your impact" },
              { icon: Copy, text: "One-click copy - no formatting loss" },
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 shrink-0">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-zinc-300">{item.text}</span>
              </motion.li>
            ))}
          </ul>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Start Sharing Free
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
