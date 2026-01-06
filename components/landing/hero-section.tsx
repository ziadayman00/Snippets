import Link from "next/link";
import { ArrowRight, Bold, Italic, Code, List, Quote, Search, Link as LinkIcon, ArrowRightLeft } from "lucide-react";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { NeuralBackground } from "@/components/landing/neural-background";

export function HeroSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-48">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[var(--accent-primary)]/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Brain Overlay */}
      {/* Neural Network Overlay */}
      <div className="absolute inset-0 z-0">
         <NeuralBackground />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-[var(--accent-primary)] mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]"></span>
            </span>
            v1.2.0
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-[var(--text-primary)] to-[var(--text-secondary)]">
            The Knowledge Vault <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-zinc-200 to-zinc-500">for Developers.</span>
          </h1>

          <p className="text-xl text-[var(--text-muted)] max-w-2xl mb-10 leading-relaxed">
            Stop losing code in Slack and Notion. Organize, link, and query your snippets with AI-powered semantic search.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="h-12 px-8 rounded-full bg-[var(--accent-primary)] text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_-5px_rgba(var(--accent-primary-rgb),0.5)]"
            >
              {isAuthenticated ? "Go to Dashboard" : "Start for Free"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs"
              className="h-12 px-8 rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 backdrop-blur-sm text-[var(--text-primary)] font-medium flex items-center gap-2 hover:bg-[var(--bg-secondary)] transition-all"
            >
              Documentation
            </Link>
          </div>
        </div>

        {/* Real Editor Visualization */}
        <div className="relative max-w-5xl mx-auto z-20">
            {/* Desktop & Mobile Unified Version */}
            <div className="relative rounded-xl border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[9/16] md:aspect-[16/9] flex flex-col ring-1 ring-white/5">
            
            {/* Title Input Area */}
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <div>
                    <div className="text-lg md:text-xl font-bold text-white tracking-tight">Memoization Strategy</div>
                    <div className="flex items-center gap-2 mt-1 md:mt-1.5 text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                        <span className="flex items-center gap-1.5"><Code className="w-3 h-3" /> TypeScript</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-700"/>
                        <span>Updated just now</span>
                    </div>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-red-500/20 border border-red-500/50"/>
                    <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"/>
                    <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-green-500/20 border border-green-500/50"/>
                </div>
            </div>

            {/* Editor Toolbar */}
            <div className="flex items-center gap-1 border-b border-white/5 bg-black/40 px-3 md:px-4 py-2 overflow-x-auto scrollbar-hide">
                <div className="flex gap-0.5 shrink-0">
                <div className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"><Bold className="h-4 w-4" /></div>
                <div className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"><Italic className="h-4 w-4" /></div>
                <div className="p-1.5 bg-white/10 rounded text-white shadow-sm cursor-pointer"><Code className="h-4 w-4" /></div>
                </div>
                <div className="w-px h-4 bg-white/10 mx-2 shrink-0" />
                <div className="flex gap-0.5 shrink-0">
                <div className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"><List className="h-4 w-4" /></div>
                <div className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"><Quote className="h-4 w-4" /></div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Content Area */}
                <div className="flex-1 bg-[#0A0A0A] p-4 md:p-8 font-mono text-xs md:text-sm leading-relaxed overflow-hidden relative w-full">
                    {/* Line Numbers */}
                    <div className="absolute left-2 md:left-4 top-4 md:top-8 bottom-0 w-4 md:w-6 text-right text-zinc-800 select-none font-mono text-[10px] md:text-xs space-y-[1.62rem] md:space-y-[1.65rem]">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <div key={n}>{n}</div>)}
                    </div>

                    <div className="pl-6 md:pl-8 text-zinc-300 max-w-2xl mx-auto space-y-4 md:space-y-6">
                        <p className="text-zinc-400">
                        To prevent unnecessary re-renders in <span className="text-sky-400 bg-sky-400/10 px-1 py-0.5 md:px-1.5 md:py-0.5 rounded border border-sky-400/20">@React Performance</span> components, we use a proxy-based memoization pattern.
                        </p>
                        
                        <div className="bg-zinc-900/50 p-3 md:p-5 rounded-lg border border-white/5 ring-1 ring-black shadow-inner overflow-x-auto">
                            <div className="whitespace-pre"><span className="text-purple-400">export function</span> <span className="text-yellow-200">memoize</span>{"<T>(fn: T): T {"}</div>
                            <div className="flex items-center pl-4 mt-1">
                                <span className="mr-2 text-pink-400">return</span>
                                <TypingAnimation 
                                    text="new Proxy(fn, handler);" 
                                    className="text-emerald-300 whitespace-nowrap" 
                                    typingSpeed={80}
                                />
                                <span className="animate-pulse ml-0.5 inline-block w-2 h-5 bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                            </div>
                            <div>{"}"}</div>
                        </div>

                        <div className="text-zinc-400 flex items-center gap-1.5 flex-wrap">
                        This strategy is particularly useful when dealing with
                        <span className="inline-flex items-center gap-1 relative z-50">
                            
                            {/* The Simulated Mention Dropdown */}
                            <span className="relative">
                                <span className="bg-[var(--accent-primary)]/20 px-1.5 py-0.5 rounded text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">@Expensive</span>
                                
                                <div className="absolute top-8 left-0 w-64 md:w-72 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black z-[60]">
                                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-white/5 bg-white/5">
                                        Link to snippet
                                    </div>
                                    <div className="p-1.5 space-y-0.5">
                                        <div className="flex items-center gap-3 px-3 py-2.5 bg-[var(--accent-primary)] text-white rounded-lg shadow-md border border-[var(--accent-primary)]/50 cursor-pointer">
                                            <LinkIcon className="h-3.5 w-3.5" />
                                            <span className="font-medium truncate">Expensive Calculations</span>
                                            <span className="ml-auto text-[10px] opacity-70 border border-white/20 px-1 rounded shrink-0">NEW</span>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 hover:bg-white/5 hover:text-zinc-200 rounded-lg cursor-pointer transition-colors">
                                            <LinkIcon className="h-3.5 w-3.5 opacity-50" />
                                            <span className="truncate">Points System</span>
                                        </div>
                                    </div>
                                </div>
                            </span>

                        </span>
                        </div>
                    </div>
                </div>

                {/* Context Sidebar (Right) */}
                <div className="hidden lg:block w-80 border-l border-white/5 bg-black/20 backdrop-blur-sm p-5 space-y-8 shrink-0">
                <div>
                        <h3 className="font-bold text-[10px] uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                            mentioned in
                        </h3>
                        <div className="space-y-3">
                            <div className="group flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:border-[var(--accent-primary)]/50 hover:bg-[var(--accent-primary)]/10 transition-all cursor-pointer">
                                <div className="p-1.5 rounded bg-black/40 text-zinc-400 group-hover:text-[var(--accent-primary)] transition-colors">
                                    <LinkIcon className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                    <div className="font-medium text-xs text-zinc-200 group-hover:text-white">React Hooks</div>
                                    <div className="text-[10px] text-zinc-500 mt-0.5">Hooks • 2m ago</div>
                                </div>
                            </div>
                            <div className="group flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:border-[var(--accent-primary)]/50 hover:bg-[var(--accent-primary)]/10 transition-all cursor-pointer">
                                <div className="p-1.5 rounded bg-black/40 text-zinc-400 group-hover:text-[var(--accent-primary)] transition-colors">
                                    <LinkIcon className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                    <div className="font-medium text-xs text-zinc-200 group-hover:text-white">Data Fetching</div>
                                    <div className="text-[10px] text-zinc-500 mt-0.5">Patterns • 1h ago</div>
                                </div>
                            </div>
                        </div>
                </div>

                    <div>
                        <h3 className="font-bold text-[10px] uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                            Suggested Links
                            <span className="px-1.5 py-0.5 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[9px]">AI</span>
                        </h3>
                        <div className="p-4 border border-dashed border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                             <div className="text-xs text-zinc-300 font-medium mb-1 flex items-center gap-2">
                                <Search className="w-3 h-3 text-[var(--accent-primary)]" />
                                Proxy Pattern
                             </div>
                             <p className="text-[10px] text-zinc-500 leading-relaxed">
                                AI suggests linking to "Proxy Pattern" based on your usage of `new Proxy()`.
                             </p>
                        </div>
                </div>
                </div>
            </div>
            </div>
        </div>
      </div>
    </section>
  );
}
