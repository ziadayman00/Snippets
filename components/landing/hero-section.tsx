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
import { HeroEditorVisual } from "@/components/landing/hero-editor-visual";
import { motion } from "motion/react";

function Pill({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300 font-mono">
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
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[520px] w-[1100px] rounded-full bg-purple-500/15 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Top: Value + CTA */}
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          {/* Badge */}
          <Link href="/changelog">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mx-auto inline-flex items-center gap-2 rounded-md border border-purple-500/30 bg-purple-500/10 backdrop-blur px-3 py-1 text-xs text-purple-200 font-mono hover:bg-purple-500/20 transition-colors cursor-pointer"
            >
              <span className="text-purple-500 mr-1">$</span>
              <span className="inline-flex items-center gap-1.5">
                sh snippets-init.sh
              </span>
              <span className="text-purple-500/50 mx-2">|</span>
              <span className="inline-flex items-center gap-1.5 text-purple-300">
                v1.3.0
              </span>
            </motion.div>
          </Link>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mt-6 text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] sm:leading-[1.05] font-mono"
          >
            <span className="text-white">
              Your second brain
            </span>{" "}
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-primary)] via-purple-400 to-pink-400">
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
          className="relative mx-auto mt-12 sm:mt-16 w-full max-w-[1200px] px-4"
        >
          <HeroEditorVisual />
        </motion.div>
      </div>
    </section>
  );
}