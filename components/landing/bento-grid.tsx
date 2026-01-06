import { Zap, Database, Code2, Cpu, Network } from "lucide-react";

export function BentoGrid() {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
          Everything you need to <br />
          <span className="text-[var(--accent-primary)]">build your second brain.</span>
        </h2>
        <p className="text-lg text-[var(--text-muted)]">
          Snippets combines the speed of a notepad with the power of a vector database.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
        {/* Large Card: AI Intelligence (Spans 2 cols) */}
        <div className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-8 hover:border-[var(--accent-primary)]/50 transition-colors">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-48 h-48" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center rounded-full bg-[var(--accent-primary)]/10 px-3 py-1 text-xs font-medium text-[var(--accent-primary)] mb-4">
                Now with Gemini 1.5
              </div>
              <h3 className="text-2xl font-bold mb-2">Talk to your code</h3>
              <p className="text-[var(--text-muted)] max-w-sm">
                RAG-powered chat that understands your specific context. Ask questions like "How do we handle auth?" and get cited answers.
              </p>
            </div>
            
            {/* Visual: Chat Bubble */}
            <div className="mt-8 space-y-3">
              <div className="flex justify-end">
                <div className="bg-[var(--accent-primary)] text-white px-4 py-2 rounded-2xl rounded-tr-sm text-sm max-w-[80%]">
                  How do I fix the useEffect infinite loop?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-4 py-2 rounded-2xl rounded-tl-sm text-sm border border-[var(--border-primary)] max-w-[90%]">
                  It looks like a stale closure. Add <code className="bg-[var(--bg-secondary)] px-1 rounded text-[var(--accent-primary)]">count</code> to the dependency array.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tall Card: Knowledge Graph (Spans 1 col, 2 rows height-ish, but here just 1 row for now, maybe 2 if we want functionality) */}
        <div className="md:col-span-1 group relative overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-8 hover:border-[var(--accent-primary)]/50 transition-colors">
           <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Network className="w-64 h-64" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Connect Everything</h3>
              <p className="text-[var(--text-muted)] text-sm">
                Don't just store notes. Link them. Create a web of knowledge with <code>@mention</code> linking.
              </p>
            </div>
            {/* Visual: Connection Nodes */}
             <div className="mt-6 flex justify-center items-center h-32 relative">
                {/* CSS Nodes */}
                <div className="absolute w-3 h-3 bg-[var(--accent-primary)] rounded-full top-1/2 left-1/4 animate-pulse"></div>
                <div className="absolute w-3 h-3 bg-purple-400 rounded-full top-1/3 right-1/4 delay-75"></div>
                <div className="absolute w-3 h-3 bg-blue-400 rounded-full bottom-1/4 left-1/2 delay-150"></div>
                {/* Lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                  <line x1="25%" y1="50%" x2="50%" y2="75%" stroke="currentColor" strokeWidth="1" />
                  <line x1="50%" y1="75%" x2="75%" y2="33%" stroke="currentColor" strokeWidth="1" />
                  <line x1="25%" y1="50%" x2="75%" y2="33%" stroke="currentColor" strokeWidth="1" />
                </svg>
             </div>
          </div>
        </div>

        {/* Card: The Editor */}
        <div className="md:col-span-1 group relative overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-8 hover:border-[var(--accent-primary)]/50 transition-colors">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
            <Code2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Pro Code Editor</h3>
          <p className="text-[var(--text-muted)] text-sm mb-4">
            Powered by CodeMirror 6. Vim mode, multi-cursor, and syntax highlighting for 20+ languages.
          </p>
        </div>

        {/* Card: Performance/Vector */}
        <div className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-8 hover:border-[var(--accent-primary)]/50 transition-colors flex items-center justify-between">
          <div>
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">vector-ready</h3>
            <p className="text-[var(--text-muted)] text-sm max-w-md">
              Your snippets are automatically embedded and stored in Supabase with pgvector for millisecond-fast semantic retrieval.
            </p>
          </div>
           <div className="hidden md:block font-mono text-xs text-green-400 bg-black/20 p-4 rounded border border-green-500/20">
              {">"} embedding.generate()<br/>
              <span className="text-[var(--text-muted)]">... 1536 dimensions</span><br/>
              {">"} vector.query(0.89)<br/>
              <span className="text-[var(--text-muted)]">... 12ms latency</span>
          </div>
        </div>
      </div>
    </section>
  );
}
