"use client";

import { motion } from "motion/react";
import { X, CheckCircle2, ArrowRight } from "lucide-react";

const problems = [
  "Critical decisions buried in Slack threads",
  "Context lost between tickets and code",
  "Re-solving the same bugs quarterly",
  "Knowledge scattered across 5+ tools",
];

const solutions = [
  "Unified Technical Memory",
  "Knowledge Graph linking code & context",
  "AI that answers with your engineering wisdom",
  "One source of truth for your team",
];

export function ProblemSolution() {
  return (
    <section className="relative py-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Problem */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-red-500/5 rounded-3xl blur-2xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 text-sm font-semibold text-red-400 mb-6">
                  <X className="h-4 w-4" />
                  <span>The Problem</span>
                </div>
                
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                  Developer frustration
                </h3>
                
                <ul className="space-y-5">
                  {problems.map((problem, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start gap-4 group"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 shrink-0 mt-0.5 group-hover:bg-red-500/20 transition-colors">
                        <X className="h-4 w-4 text-red-400" />
                      </div>
                      <span className="text-lg text-zinc-300 group-hover:text-white transition-colors">
                        {problem}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-[var(--accent-primary)]/10 rounded-3xl blur-2xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/10 px-4 py-1.5 text-sm font-semibold text-[var(--accent-primary)] mb-6">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>The Solution</span>
                </div>
                
                <h3 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 mb-8">
                  Organized simplicity
                </h3>
                
                <ul className="space-y-5">
                  {solutions.map((solution, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start gap-4 group"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-primary)]/10 shrink-0 mt-0.5 group-hover:bg-[var(--accent-primary)]/20 transition-colors">
                        <CheckCircle2 className="h-4 w-4 text-[var(--accent-primary)]" />
                      </div>
                      <span className="text-lg text-zinc-300 group-hover:text-white transition-colors">
                        {solution}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="mt-8"
                >
                  <a
                    href="/login"
                    className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:gap-3 transition-all group/link"
                  >
                    <span className="font-semibold">Try it free</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
