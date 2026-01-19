"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Share2, Eye, Copy, Globe, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export function SharingShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax for different elements
  const leftX = useTransform(scrollYProgress, [0, 0.5], [-100, 0]);
  const rightX = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={sectionRef} className="py-32 container mx-auto px-6 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto relative z-10">
        
        {/* Left: Visual Demo - Slide in from left */}
        <motion.div
          style={{ x: leftX, opacity }}
          className="relative group"
        >
            {/* Window Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          {/* Mock Editor Window */}
          <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-medium border border-blue-500/20">
                  <Globe className="w-3 h-3" />
                  <span>Public Access</span>
                </div>
              </div>
            </div>

            {/* Address Bar Mock */}
            <div className="px-4 py-2 border-b border-white/5 bg-black/20 flex items-center justify-center">
                 <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-zinc-500 w-full max-w-[240px] justify-center">
                    <span className="text-zinc-600">snippets.dev/s/</span>
                    <span className="text-zinc-300">custom-hooks-guide</span>
                 </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                        TypeScript
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> 1.2k
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                     <Copy className="w-4 h-4" />
                  </motion.button>
              </div>

              <div>
                  <h3 className="text-xl font-bold text-white mb-2 font-mono">The Ultimate Hook Pattern</h3>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex gap-2">
                        <span className="text-zinc-600 select-none">1</span>
                        <div><span className="text-purple-400">export function</span> <span className="text-blue-400">useDebounce</span>&lt;<span className="text-yellow-400">T</span>&gt;(value: <span className="text-yellow-400">T</span>, delay?: <span className="text-orange-400">number</span>) {"{"}</div>
                    </div>
                    <div className="flex gap-2">
                         <span className="text-zinc-600 select-none">2</span>
                         <div className="pl-4"><span className="text-purple-400">const</span> [debouncedValue, setDebouncedValue] = useState(value);</div>
                    </div>
                    <div className="flex gap-2">
                         <span className="text-zinc-600 select-none">3</span>
                         <div className="pl-4 text-zinc-500">// ... implementation details</div>
                    </div>
                    <div className="flex gap-2">
                         <span className="text-zinc-600 select-none">4</span>
                         <div>{"}"}</div>
                    </div>
                  </div>
              </div>
              
              {/* Copy Notification Toast Animation */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
                className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium backdrop-blur-md shadow-lg"
              >
                <Share2 className="w-3 h-3" />
                <span>Link copied to clipboard</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right: Content - Slide in from right */}
        <motion.div
          style={{ x: rightX, opacity }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium font-mono">
            <Globe className="w-3 h-3" />
            <span>Public Access</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight font-mono">
            Share your knowledge <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">with a single link.</span>
          </h2>

          <p className="text-lg text-zinc-400 leading-relaxed max-w-md">
            No more screenshots or messy pastes. Turn any snippet into a beautiful, shareable page that looks great on any device.
          </p>

          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-1">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-white font-medium mb-1">Instant Previews</h4>
                    <p className="text-sm text-zinc-400">Auto-generated social cards ensure your snippets look stunning on Twitter, Slack, and Discord.</p>
                </div>
            </motion.div>
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
             >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-1">
                    <Eye className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-white font-medium mb-1">Engagement Analytics</h4>
                    <p className="text-sm text-zinc-400">Track how many developers are learning from your code with built-in view counting.</p>
                </div>
            </motion.div>
          </div>

           <Link
                href="/login"
                className="inline-flex items-center gap-2 text-white font-medium hover:text-blue-400 transition-colors group"
            >
                <span className="border-b border-white/20 group-hover:border-blue-400/50 pb-0.5 transition-colors">Start sharing for free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </motion.div>
      </div>
    </section>
  );
}
