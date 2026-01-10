import { Code, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EditorFeaturePage() {
  return (
    <div className="container mx-auto px-6 max-w-6xl">
       {/* Feature Header */}
       <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 mb-6">
                <Code className="h-3 w-3" />
                <span>Unified Editor</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Write code and prose <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">without switching context.</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
                A hybrid editing experience that combines the best of Tiptap's rich text capability with CodeMirror's professional coding environment.
            </p>
       </div>

       {/* Feature Visual */}
       <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] aspect-video relative overflow-hidden shadow-2xl mb-24 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            
            {/* Mock Editor UI */}
            <div className="absolute inset-0 p-8 flex flex-col">
                <div className="flex items-center gap-2 border-b border-[var(--border-primary)]/50 pb-4 mb-4">
                     <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                     </div>
                     <div className="ml-4 text-xs text-[var(--text-muted)] font-mono">auth-middleware.ts</div>
                </div>
                <div className="flex-1 font-mono text-sm text-[var(--text-secondary)] space-y-1">
                    <div className="flex gap-4"><span className="text-[var(--text-muted)] select-none">1</span> <span><span className="text-purple-400">import</span> &#123; NextResponse &#125; <span className="text-purple-400">from</span> <span className="text-green-400">'next/server'</span>;</span></div>
                    <div className="flex gap-4"><span className="text-[var(--text-muted)] select-none">2</span> <span></span></div>
                    <div className="flex gap-4"><span className="text-[var(--text-muted)] select-none">3</span> <span><span className="text-purple-400">export function</span> <span className="text-blue-400">middleware</span>(req) &#123;</span></div>
                    <div className="flex gap-4"><span className="text-[var(--text-muted)] select-none">4</span> <span className="pl-4"><span className="text-[var(--text-muted)]">// Check authentication status</span></span></div>
                    <div className="flex gap-4"><span className="text-[var(--text-muted)] select-none">5</span> <span className="pl-4"><span className="text-purple-400">const</span> token = req.cookies.<span className="text-blue-400">get</span>(<span className="text-green-400">'token'</span>);</span></div>
                    <div className="flex gap-4 bg-blue-500/10 -mx-8 px-8 border-l-2 border-blue-500"><span className="text-[var(--text-muted)] select-none">6</span> <span className="pl-4"></span></div>
                    <div className="flex gap-4"><span className="text-[var(--text-muted)] select-none">7</span> <span className="pl-4"><span className="text-purple-400">if</span> (!token) <span className="text-purple-400">return</span> NextResponse.<span className="text-blue-400">redirect</span>(<span className="text-green-400">'/login'</span>);</span></div>
                    <div className="flex gap-4"><span className="text-[var(--text-muted)] select-none">8</span> <span>&#125;</span></div>
                </div>
            </div>
       </div>

       {/* Detailed Points */}
       <div className="grid md:grid-cols-3 gap-12">
           <div className="space-y-4">
               <h3 className="text-xl font-bold flex items-center gap-2">
                   <div className="h-8 w-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-blue-500">
                       <Code className="h-4 w-4" />
                   </div>
                   Syntax Highlighting
               </h3>
               <p className="text-[var(--text-secondary)]">Support for over 20+ languages out of the box with the Atom One Dark theme you know and love.</p>
           </div>
           
           <div className="space-y-4">
               <h3 className="text-xl font-bold flex items-center gap-2">
                   <div className="h-8 w-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-purple-500">
                       <Check className="h-4 w-4" />
                   </div>
                   Smart Auto-Save
               </h3>
               <p className="text-[var(--text-secondary)]">Never lose a thought. Changes are saved locally and synced to the cloud instantaneously.</p>
           </div>
           
           <div className="space-y-4">
               <h3 className="text-xl font-bold flex items-center gap-2">
                   <div className="h-8 w-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-green-500">
                       <Check className="h-4 w-4" />
                   </div>
                   Markdown First
               </h3>
               <p className="text-[var(--text-secondary)]">Use standard keyboard shortcuts for headings, lists, and links without lifting your fingers.</p>
           </div>
       </div>
    </div>
  );
}
