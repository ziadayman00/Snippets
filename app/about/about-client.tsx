"use client";

import { Code2, Database, Shield, Zap, Stars, Users, Rocket, Heart, TrendingUp, CheckCircle2, Sparkles, Brain, Network } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export function AboutPageClient() {
  const stats = [
    { label: "Active Developers", value: "1,000+", icon: Users },
    { label: "Snippets Created", value: "50K+", icon: Code2 },
    { label: "Daily Searches", value: "10K+", icon: TrendingUp },
    { label: "Uptime", value: "99.9%", icon: Rocket },
  ];

  const timeline = [
    { year: "2024", title: "The Problem", description: "Lost too many code snippets in Slack threads and browser bookmarks" },
    { year: "Q1 2025", title: "First Prototype", description: "Built MVP with basic snippet storage and search" },
    { year: "Q2 2025", title: "AI Integration", description: "Added semantic search and AI-powered knowledge graph" },
    { year: "Q4 2025", title: "Public Launch", description: "Opened to developers worldwide with 1,000+ early adopters" },
  ];

  const principles = [
    {
      icon: Brain,
      title: "Developer-First",
      description: "Built by developers, for developers. Every feature is designed around your workflow."
    },
    {
      icon: Zap,
      title: "Speed Obsessed",
      description: "Sub-100ms search results. Instant UI updates. Your flow state is sacred."
    },
    {
      icon: Network,
      title: "Context is King",
      description: "Knowledge graphs and backlinks transform isolated snippets into connected insights."
    },
    {
      icon: Shield,
      title: "Privacy by Default",
      description: "Your code is yours. Enterprise-grade security with zero-knowledge architecture."
    },
    {
      icon: Sparkles,
      title: "AI-Enhanced",
      description: "Semantic search that understands intent, not just keywords."
    },
    {
      icon: Heart,
      title: "Open & Honest",
      description: "Transparent pricing. No dark patterns. No vendor lock-in."
    },
  ];

  return (
    <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-zinc-400 mb-8"
            >
              <Stars className="h-4 w-4 text-purple-400" />
              <span>About Snippets</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight font-mono"
            >
              We build for the{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                builders.
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed"
            >
              We're on a mission to organize the world's programming knowledge, one snippet at a time.
            </motion.p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-4">
                    <stat.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white font-mono mb-2">{stat.value}</div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem/Solution Narrative */}
        <section className="py-32">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-16"
            >
              {/* The Problem */}
              <div>
                <h2 className="text-sm font-mono uppercase tracking-widest mb-6 text-zinc-500">The Problem</h2>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white font-mono">
                  Knowledge scattered everywhere.
                </h3>
                <p className="text-lg text-zinc-400 leading-relaxed mb-4">
                  As developers, we constantly solve problems, write clever solutions, and discover useful patterns. But where do they go?
                </p>
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Lost in Slack threads that disappear after 90 days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Buried in browser bookmarks you'll never find again</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Scattered across Notion pages with no connections</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Rewriting the same function for the third time</span>
                  </li>
                </ul>
              </div>

              {/* The Solution */}
              <div>
                <h2 className="text-sm font-mono uppercase tracking-widest mb-6 text-zinc-500">The Solution</h2>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white font-mono">
                  Your second brain for code.
                </h3>
                <p className="text-lg text-zinc-400 leading-relaxed mb-4">
                  Snippets is designed specifically for developers who want to build a personal knowledge base that actually works.
                </p>
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Semantic search that understands what you mean, not just what you type</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Knowledge graphs that connect related snippets automatically</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>AI-powered insights from your entire knowledge base</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Private by default with enterprise-grade security</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-32 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-sm font-mono uppercase tracking-widest mb-6 text-zinc-500">Our Journey</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white font-mono">From idea to reality</h3>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />

              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-20"
                  >
                    <div className="absolute left-0 w-16 h-16 rounded-full bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-400 font-mono">{item.year}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                      <h4 className="text-xl font-bold text-white mb-2 font-mono">{item.title}</h4>
                      <p className="text-zinc-400">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Principles Grid */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 max-w-3xl mx-auto"
            >
              <h2 className="text-sm font-mono uppercase tracking-widest mb-6 text-zinc-500">Our Principles</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white font-mono mb-4">
                What we believe in
              </h3>
              <p className="text-lg text-zinc-400">
                These principles guide every decision we make, from product design to customer support.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {principles.map((principle, index) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                    <principle.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-mono text-white">{principle.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{principle.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-32 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-mono uppercase tracking-widest mb-12 text-zinc-500">Our Team</h2>
              <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-12 text-zinc-200">
                "We built Snippets because we were tired of losing our best solutions in Slack threads and browser bookmarks."
              </p>
              <div className="flex items-center justify-center gap-4 text-zinc-400">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Code2 className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-zinc-200 text-lg">The Snippets Team</div>
                  <div className="text-sm">Remote & Asynchronous • Building in Public</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-[32px] overflow-hidden border border-white/10 bg-white/[0.02] px-6 py-20 text-center sm:px-12 md:py-24 max-w-4xl mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10 space-y-8">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-mono">
                  Start building your{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    knowledge engine.
                  </span>
                </h2>
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                  Join 1,000+ developers who are building their second brain with Snippets.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link
                    href="/login"
                    className="h-12 px-8 rounded-full bg-white text-black font-semibold text-sm flex items-center justify-center hover:bg-zinc-200 transition-all min-w-[160px]"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/docs"
                    className="h-12 px-8 rounded-full border border-white/10 bg-white/5 text-zinc-200 font-medium text-sm flex items-center justify-center hover:bg-white/10 transition-colors min-w-[160px]"
                  >
                    Read Documentation
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
    </main>
  );
}
