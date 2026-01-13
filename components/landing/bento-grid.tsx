"use client";

import React from "react";
import { Zap, Code2, Cpu, Network, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type Tint = "accent" | "blue" | "purple" | "green";

const tintStyles: Record<
  Tint,
  {
    ring: string;
    borderHover: string;
    badgeBg: string;
    badgeText: string;
    iconBg: string;
    iconText: string;
    glow: string;
  }
> = {
  accent: {
    ring: "ring-[var(--accent-primary)]/10",
    borderHover: "hover:border-[var(--accent-primary)]/45",
    badgeBg: "bg-[var(--accent-primary)]/10",
    badgeText: "text-[var(--accent-primary)]",
    iconBg: "bg-[var(--accent-primary)]/10",
    iconText: "text-[var(--accent-primary)]",
    glow: "shadow-[0_0_28px_-12px_rgba(var(--accent-primary-rgb),0.9)]",
  },
  blue: {
    ring: "ring-blue-500/10",
    borderHover: "hover:border-blue-500/45",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-300",
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-300",
    glow: "shadow-[0_0_28px_-14px_rgba(59,130,246,0.55)]",
  },
  purple: {
    ring: "ring-purple-500/10",
    borderHover: "hover:border-purple-500/45",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-300",
    iconBg: "bg-purple-500/10",
    iconText: "text-purple-300",
    glow: "shadow-[0_0_28px_-14px_rgba(168,85,247,0.55)]",
  },
  green: {
    ring: "ring-emerald-500/10",
    borderHover: "hover:border-emerald-500/45",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-300",
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-300",
    glow: "shadow-[0_0_28px_-14px_rgba(16,185,129,0.55)]",
  },
};

function GlassCard({
  tint,
  className = "",
  children,
}: {
  tint: Tint;
  className?: string;
  children: React.ReactNode;
}) {
  const t = tintStyles[tint];
  const [mousePos, setMousePos] = React.useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={[
        "group relative overflow-hidden rounded-3xl",
        "border border-white/10 bg-white/[0.03] backdrop-blur-xl",
        "shadow-[0_0_40px_-18px_rgba(0,0,0,0.65)]",
        "ring-1 ring-white/10",
        t.ring,
        t.borderHover,
        "transition-colors",
        className,
      ].join(" ")}
    >
      {/* subtle inner gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-black/10 opacity-70" />

      {/* mouse spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.08), transparent 45%)`,
          willChange: "opacity",
        }}
      />

      {/* edge glow */}
      <div
        className={`pointer-events-none absolute -inset-1 opacity-0 transition-opacity duration-500 ${t.glow}`}
        style={{ opacity: isHovered ? 1 : 0 }}
      />

      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

function IconBadge({ tint, icon: Icon }: { tint: Tint; icon: any }) {
  const t = tintStyles[tint];
  return (
    <div
      className={[
        "h-12 w-12 rounded-2xl border border-white/10",
        "flex items-center justify-center",
        t.iconBg,
      ].join(" ")}
    >
      <Icon className={`w-6 h-6 ${t.iconText}`} />
    </div>
  );
}

function Pill({ tint, children }: { tint: Tint; children: React.ReactNode }) {
  const t = tintStyles[tint];
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs",
        "bg-white/[0.04] text-zinc-300/90",
      ].join(" ")}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${t.badgeBg}`} />
      {children}
    </span>
  );
}

export function BentoGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 sm:mb-14 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Everything you need to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
              build your second brain
            </span>
            .
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-300/75 leading-relaxed">
            Snippets combines the speed of a notepad with the power of semantic
            retrieval — capture, connect, and query your knowledge.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Pill tint="accent">Semantic Search</Pill>
            <Pill tint="purple">@mentions + backlinks</Pill>
            <Pill tint="blue">Fast capture</Pill>
            <Pill tint="green">Private by default</Pill>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 auto-rows-fr">
          {/* Card 1: AI (Double Width) */}
          <GlassCard tint="accent" className="md:col-span-2 p-6 sm:p-8">
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <div className="flex items-center gap-3">
                  <IconBadge tint="accent" icon={Zap} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-semibold text-white">
                        Talk to your code
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                        <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                        Gemini 2.0 Flash
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-300/75 max-w-xl leading-relaxed">
                      RAG-powered chat that understands your context. Ask "How
                      do I handle auth?" and get answers referenced from your
                      own snippets.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual: Chat UI */}
              <div className="ml-auto w-full max-w-xl space-y-3 font-mono text-xs">
                <div className="flex justify-end">
                  <div className="max-w-[88%] rounded-2xl rounded-tr-sm border border-white/10 bg-white/[0.06] px-4 py-3 text-zinc-100 shadow-sm">
                    Why is the API route failing 403?
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-white/10 bg-[var(--accent-primary)]/90 px-4 py-3 text-white shadow-sm">
                    It looks like{" "}
                    <code className="rounded bg-black/20 px-1.5 py-0.5 font-semibold">
                      middleware.ts
                    </code>{" "}
                    is blocking the request.
                    <div className="mt-2 text-[10px] text-white/80">
                      Source: auth/middleware.ts • line 14
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Card 2: Knowledge Graph */}
          <GlassCard tint="purple" className="p-6 sm:p-8">
            <div className="h-full flex flex-col">
              <IconBadge tint="purple" icon={Network} />
              <h3 className="mt-5 text-xl font-semibold text-white">
                Connect everything
              </h3>
              <p className="mt-2 text-sm text-zinc-300/75 leading-relaxed">
                Don't just store notes. Create a web of knowledge with{" "}
                <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-zinc-200">
                  @mention
                </code>{" "}
                linking and backlinks.
              </p>

              {/* Visual: nodes */}
              <div className="mt-6 flex-1 min-h-[140px] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-36 h-36">
                    <div className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.02]" />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-purple-500/40 bg-purple-500/15 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-purple-400 rounded-full" />
                    </div>

                    <div
                      className={[
                        "absolute top-2 left-2 w-7 h-7 rounded-full",
                        "border border-blue-500/30 bg-blue-500/10 flex items-center justify-center",
                        reduceMotion ? "" : "animate-pulse",
                      ].join(" ")}
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    </div>

                    <div
                      className={[
                        "absolute bottom-3 right-2 w-7 h-7 rounded-full",
                        "border border-pink-500/30 bg-pink-500/10 flex items-center justify-center",
                        reduceMotion ? "" : "animate-pulse",
                      ].join(" ")}
                    >
                      <div className="w-2 h-2 bg-pink-400 rounded-full" />
                    </div>

                    <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-white/10">
                      <line x1="50%" y1="50%" x2="12%" y2="12%" />
                      <line x1="50%" y1="50%" x2="88%" y2="82%" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Pill tint="purple">Backlinks</Pill>
                <Pill tint="purple">Auto-linking</Pill>
                <Pill tint="purple">Context graph</Pill>
              </div>
            </div>
          </GlassCard>

          {/* Card 3: Pro Editor */}
          <GlassCard tint="blue" className="p-6 sm:p-8">
            <div className="h-full flex flex-col">
              <IconBadge tint="blue" icon={Code2} />
              <h3 className="mt-5 text-xl font-semibold text-white">
                Pro editor
              </h3>
              <p className="mt-2 text-sm text-zinc-300/75 leading-relaxed">
                Fast writing experience with syntax highlighting and a clean
                focus mode.
              </p>

              {/* Visual: Mini Editor Frame */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 font-mono text-[11px] text-zinc-300/85 shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1.5 opacity-60">
                    <div className="w-2 h-2 rounded-full bg-red-400/60" />
                    <div className="w-2 h-2 rounded-full bg-yellow-300/60" />
                    <div className="w-2 h-2 rounded-full bg-green-400/60" />
                  </div>
                  <span className="text-[10px] text-zinc-500">snippet.py</span>
                </div>

                <div className="whitespace-pre leading-relaxed">
                  <span className="text-purple-300">def</span>{" "}
                  <span className="text-yellow-200">hello</span>():
                  {"\n"}
                  <span className="pl-3 text-emerald-300">
                    print("Hello World")
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Pill tint="blue">Syntax highlight</Pill>
                <Pill tint="blue">Fast capture</Pill>
                <Pill tint="blue">Clean focus</Pill>
              </div>
            </div>
          </GlassCard>

          {/* Card 4: Vector Performance (Double Width) */}
          <GlassCard tint="green" className="md:col-span-2 p-6 sm:p-8">
            <div className="h-full flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <IconBadge tint="green" icon={Cpu} />
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Vector-ready performance
                    </h3>
                    <p className="mt-1 text-sm text-zinc-300/75 leading-relaxed max-w-xl">
                      Snippets are embedded and stored for fast semantic
                      retrieval — so search feels instant, even as your vault
                      grows.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Pill tint="green">pgvector</Pill>
                  <Pill tint="green">Millisecond queries</Pill>
                  <Pill tint="green">Auto-embeddings</Pill>
                </div>
              </div>

              {/* Visual: Terminal Block */}
              <div className="w-full md:w-auto md:min-w-[360px]">
                <div className="rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl p-4 font-mono text-xs shadow-[0_0_40px_-18px_rgba(0,0,0,0.7)]">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 text-zinc-500 text-[10px]">
                    <span>TERMINAL</span>
                    <span>BASH</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <span className="text-emerald-400">➜</span>
                      <span className="text-zinc-200">
                        embedding.generate()
                      </span>
                    </div>
                    <div className="pl-4 text-zinc-400">
                      … 1536 dimensions generated
                    </div>

                    <div className="flex gap-2 mt-3">
                      <span className="text-emerald-400">➜</span>
                      <span className="text-zinc-200">vector.query(0.89)</span>
                    </div>
                    <div className="pl-4 text-emerald-300">✓ 12ms latency</div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}