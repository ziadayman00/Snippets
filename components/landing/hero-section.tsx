"use client";

import Link from "next/link";
import {
  ArrowRight,
  Play,
  Sparkles,
  Shield,
  Zap,
  Search,
  Code,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  Quote,
} from "lucide-react";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { NeuralBackground } from "@/components/landing/neural-background";
import { motion } from "motion/react";

function Pill({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
      <Icon className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
      <span className="whitespace-nowrap">{children}</span>
    </div>
  );
}

export function HeroSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="relative overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-28 md:pt-32 md:pb-44">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <NeuralBackground />
        {/* Cleaner overlay */}
<div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" />
        {/* Accent bloom */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[520px] w-[1100px] rounded-full bg-[var(--accent-primary)]/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Top: Value + CTA */}
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur px-3 py-1 text-xs text-zinc-300"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]" />
              </span>
              v1.3.0
            </span>
            <span className="text-zinc-500">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
              Semantic Search + Backlinks
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mt-6 text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
              Your second brain
            </span>{" "}
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-zinc-200 to-zinc-500">
              for code & knowledge.
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mx-auto mt-5 max-w-2xl text-base sm:text-lg md:text-xl text-zinc-300/80 leading-relaxed"
          >
            Capture snippets, link ideas, and search everything instantly — without losing context in Slack or Notion.
          </motion.p>

          {/* Pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="mt-6 flex flex-wrap justify-center gap-2"
          >
            <Pill icon={Search}>Semantic Search</Pill>
            <Pill icon={LinkIcon}>Mentions & Backlinks</Pill>
            <Pill icon={Zap}>Instant capture</Pill>
            <Pill icon={Shield}>Private by default</Pill>
          </motion.div>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="h-12 px-7 rounded-full bg-[var(--accent-primary)] text-white font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition shadow-[0_0_30px_-12px_rgba(var(--accent-primary-rgb),0.9)]"
            >
              {isAuthenticated ? "Open Dashboard" : "Start for Free"}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/docs"
              className="h-12 px-7 rounded-full border border-white/10 bg-white/[0.05] text-zinc-200 font-medium inline-flex items-center justify-center gap-2 hover:bg-white/[0.08] transition"
            >
              {/* <Play className="h-4 w-4 text-[var(--accent-primary)]" /> */}
              Documentation
            </Link>
          </motion.div>

          
        </div>

        {/* Product Preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.38 }}
          className="relative mx-auto mt-10 sm:mt-12 max-w-5xl"
        >
          {/* Shadow */}
          <div className="absolute -inset-6 bg-black/50 blur-3xl -z-10 rounded-[34px]" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]/85 backdrop-blur ring-1 ring-white/10">
            {/* Top mini bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>

              <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300">
                <span className="font-mono">⌘K</span>
                <span className="text-zinc-500">Search snippets</span>
              </div>

              <div className="inline-flex items-center gap-2 text-xs text-zinc-500">
                <Code className="h-4 w-4 text-[var(--accent-primary)]" />
                memoization-strategy.ts
              </div>
            </div>

            {/* Body */}
            <div className="grid lg:grid-cols-[1fr_320px]">
              {/* Editor */}
              <div className="relative p-4 sm:p-6 md:p-8">
                {/* Toolbar */}
                <div className="mb-4 flex items-center gap-1 overflow-x-auto scrollbar-hide">
                  <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 shrink-0">
                    <Bold className="h-4 w-4" />
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 shrink-0">
                    <Italic className="h-4 w-4" />
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.07] border border-white/10 text-white shrink-0">
                    <Code className="h-4 w-4" />
                  </div>
                  <div className="mx-2 h-5 w-px bg-white/10 shrink-0" />
                  <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 shrink-0">
                    <List className="h-4 w-4" />
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 shrink-0">
                    <Quote className="h-4 w-4" />
                  </div>
                  <div className="ml-auto text-[11px] text-zinc-500 font-mono shrink-0">
                    TypeScript
                  </div>
                </div>

                {/* Content */}
                <div className="rounded-xl border border-white/10 bg-black/40 p-4 sm:p-5 font-mono text-[11px] sm:text-xs md:text-sm text-zinc-200/90 overflow-x-auto">
                  <div className="text-zinc-400 mb-3">
                    Tip: Mention <span className="text-[var(--accent-primary)]">@snippets</span> to auto-link related notes.
                  </div>

                  <div className="whitespace-pre">
                    <span className="text-purple-400">export function</span>{" "}
                    <span className="text-yellow-200">memoize</span>
                    {"<T>(fn: T): T {"}
                  </div>

                  <div className="flex items-center pl-4 mt-2 whitespace-nowrap">
                    <span className="mr-2 text-pink-400">return</span>
                    <TypingAnimation
                      text="new Proxy(fn, handler);"
                      className="text-emerald-300"
                      typingSpeed={70}
                    />
                    <span className="animate-pulse ml-1 inline-block w-2 h-5 bg-[var(--accent-primary)]/70" />
                  </div>

                  <div className="whitespace-pre mt-2">{"}"}</div>
                </div>

                {/* Feature chips under editor */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                    Auto-tags
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                    Backlinks
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                    Snippet graph
                  </div>
                </div>
              </div>

              {/* Right panel */}
              <div className="hidden lg:block border-l border-white/10 bg-white/[0.02] p-5">
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3">
                  Connected context
                </div>

                <div className="space-y-2">
                  <div className="rounded-xl border border-white/10 bg-black/30 p-3 hover:bg-black/40 transition">
                    <div className="flex items-center gap-2 text-sm text-zinc-200">
                      <LinkIcon className="h-4 w-4 text-[var(--accent-primary)]" />
                      React Hooks
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">Mentioned in • 2m ago</div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/30 p-3 hover:bg-black/40 transition">
                    <div className="flex items-center gap-2 text-sm text-zinc-200">
                      <LinkIcon className="h-4 w-4 text-[var(--accent-primary)]" />
                      Data Fetching
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">Patterns • 1h ago</div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-dashed border-white/15 bg-black/30 p-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-200">
                    <Search className="h-4 w-4 text-[var(--accent-primary)]" />
                    Suggested: Proxy Pattern
                  </div>
                  <div className="mt-2 text-xs text-zinc-500 leading-relaxed">
                    Based on your snippet content and linked mentions.
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile feature cards instead of hidden sidebar */}
            <div className="lg:hidden border-t border-white/10 bg-white/[0.02] p-4">
              <div className="grid sm:grid-cols-3 gap-2">
                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="text-xs text-zinc-500 mb-1">Linked</div>
                  <div className="text-sm text-zinc-200">React Hooks</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="text-xs text-zinc-500 mb-1">Mentioned</div>
                  <div className="text-sm text-zinc-200">Data Fetching</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="text-xs text-zinc-500 mb-1">AI</div>
                  <div className="text-sm text-zinc-200">Proxy Pattern</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
