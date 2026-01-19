"use client";

import { motion } from "motion/react";
import { CodeEditorMockup } from "./visual-mockups";

export function ProductDemo() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
            <div className="flex flex-col items-center text-center mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 font-mono">
                    <span className="text-white">Build your personal </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-primary)] to-purple-500">
                        knowledge graph
                    </span>
                 </h2>
                 <p className="text-zinc-400 max-w-2xl text-lg leading-relaxed">
                    Stop losing useful code in Slack or bookmark folders. <br className="hidden sm:block" />
                    Link snippets together, search by concept, and never rewrite the same function twice.
                 </p>
            </div>

          {/* Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
          
          {/* We reuse the Bento visuals or create a variation if needed. 
              But for now, sticking to the bento visuals or we can add a new one.
              Actually, the user asked for visuals in Hero and Bento grid. Product Demo is redundant if Hero has the big editor.
              Let's keep Product Demo simple or remove it? Use Cases handles "Features".
              Let's keep it but maybe reuse the CodeEditorMockup in a larger container.
           */}
           <div className="relative transform-gpu scale-110">
                <CodeEditorMockup />
           </div>

        </motion.div>
      </div>
    </section>
  );
}
