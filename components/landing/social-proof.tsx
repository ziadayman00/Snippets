"use client";

import { motion } from "motion/react";
import { Users } from "lucide-react";

export function SocialProof() {
  return (
    <section className="relative py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* User Count */}
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-3 mb-8">
            <Users className="h-5 w-5 text-[var(--accent-primary)]" />
            <span className="text-lg font-semibold text-white font-mono">1,000+</span>
            <span className="text-zinc-400">developers building their knowledge base</span>
          </div>

          {/* Testimonial */}
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-2xl sm:text-3xl font-medium text-zinc-300 mb-6 font-mono">
              "Finally, a knowledge base built specifically for developers"
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-purple-500" />
              <div className="text-left">
                <p className="text-sm font-semibold text-white">Sarah Chen</p>
                <p className="text-xs text-zinc-500">Full Stack Developer</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
