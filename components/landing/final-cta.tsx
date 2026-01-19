"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 font-mono">
            <span className="text-white">Build your knowledge base</span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-zinc-400 mb-10">
            Start free. No credit card required.
          </p>

          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-10 py-5 text-xl font-semibold text-black transition-all hover:scale-105"
          >
            <span>Get Started</span>
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
