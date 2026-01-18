"use client";

import { motion } from "motion/react";
import { CheckCircle2, Crown, ArrowRight } from "lucide-react";
import Link from "next/link";

export function PricingPreview() {
  return (
    <section className="relative py-32">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 font-mono">
            <span className="text-white">Simple pricing</span>
          </h2>
          <p className="text-xl text-zinc-400">
            Start free. Upgrade when you need more.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-10"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2 font-mono">Free</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold text-white font-mono">$0</span>
                <span className="text-zinc-500">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10">
              {["50 snippets", "3 technologies", "10 AI queries/month", "Semantic search"].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-300 text-lg">
                  <CheckCircle2 className="h-5 w-5 text-[var(--accent-primary)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className="block w-full text-center rounded-full border border-white/20 bg-white/5 px-6 py-4 font-semibold text-white transition-all hover:bg-white/10"
            >
              Start Free
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 rounded-3xl blur-2xl opacity-30" />
            
            <div className="relative rounded-3xl border-2 border-[var(--accent-primary)]/30 bg-gradient-to-b from-[var(--accent-primary)]/5 to-transparent backdrop-blur-xl p-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 px-4 py-1.5 text-sm font-semibold text-white">
                  <Crown className="h-4 w-4" />
                  <span>Popular</span>
                </div>
              </div>

              <div className="mb-8 mt-2">
                <h3 className="text-2xl font-bold text-white mb-2 font-mono">Pro</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold text-white font-mono">$9</span>
                  <span className="text-zinc-500">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {[
                  "Unlimited snippets",
                  "Unlimited technologies",
                  "Unlimited AI queries",
                  "Priority support",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white text-lg font-medium">
                    <CheckCircle2 className="h-5 w-5 text-[var(--accent-primary)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className="group flex items-center justify-center gap-2 w-full rounded-full bg-white px-6 py-4 font-semibold text-black transition-all hover:scale-105"
              >
                <span>Upgrade to Pro</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
