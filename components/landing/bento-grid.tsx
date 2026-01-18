"use client";

import React from "react";
import { Sparkles, Network, Code2, Search } from "lucide-react";
import { motion } from "motion/react";
import { CodeEditorMockup, AIChatMockup, KnowledgeGraphMockup, SearchMockup } from "./visual-mockups";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Search",
    description: "Ask questions in natural language. Get answers from your knowledge base with sources.",
    visual: <AIChatMockup />,
    span: "md:col-span-2",
  },
  {
    icon: Network,
    title: "Knowledge Graph",
    description: "Connect ideas with @mentions and backlinks. Build a web of knowledge.",
    visual: <KnowledgeGraphMockup />,
    span: "md:col-span-1",
  },
  {
    icon: Code2,
    title: "Smart Editor",
    description: "Write docs and code in one place. Rich text with embedded code blocks.",
    visual: <CodeEditorMockup />,
    span: "md:col-span-1",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description: "Find snippets by meaning, not just keywords. Understands context and intent.",
    visual: <SearchMockup />,
    span: "md:col-span-2",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group relative ${feature.span}`}
    >
      {/* Glow on Hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-primary)]/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative h-full rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 hover:border-white/20 transition-all duration-300">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-primary)]/10 mb-6">
          <feature.icon className="h-6 w-6 text-[var(--accent-primary)]" />
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-3 font-mono">{feature.title}</h3>
        <p className="text-lg text-zinc-400 leading-relaxed mb-6">{feature.description}</p>

        {/* Visual */}
        <div className="mt-6">
          {feature.visual}
        </div>
      </div>
    </motion.div>
  );
}

export function BentoGrid() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 font-mono">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
              Built for developers
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-zinc-400 max-w-3xl mx-auto">
            Everything you need to build your second brain
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}