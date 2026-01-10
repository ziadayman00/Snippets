import { Database, Network, GitBranch } from "lucide-react";
import { GraphVisualization } from "@/components/landing/graph-visualization";

export default function GraphFeaturePage() {
  return (
    <div className="container mx-auto px-6 max-w-6xl">
       <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400 mb-6">
                <Network className="h-3 w-3" />
                <span>Knowledge Graph</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Connect the dots <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">across your codebase.</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
                Snippets aren't isolated islands. Our graph engine automatically links related concepts, creating a wikipedia-style web of your own knowledge.
            </p>
       </div>

       {/* Visual Placeholder */}
       <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] aspect-video relative overflow-hidden shadow-2xl mb-24 flex items-center justify-center p-1">
            <GraphVisualization />
       </div>

    </div>
  );
}
