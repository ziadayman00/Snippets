import { X, Check } from "lucide-react";

export function ComparisonSection() {
  return (
    <section className="border-t border-[var(--border-primary)] py-24">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            From Chaos to Clarity
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            Stop searching through scattered notes. Organize your code knowledge in one clean, searchable place.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-start mb-16">
          {/* Before: Manual Search */}
          <div className="space-y-4 opacity-60 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="text-red-400 text-lg">✗</span>
              </div>
              <h3 className="text-xl font-semibold">The Old Way</h3>
            </div>
            <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 space-y-4 grayscale-[0.5]">
              <div className="flex items-center gap-2 border border-[var(--border-primary)] rounded px-3 py-2 bg-[var(--bg-primary)]">
                <span className="text-xs opacity-50">🔍</span>
                <span className="text-sm text-[var(--text-primary)]">react useEffect stale closure</span>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-[var(--bg-tertiary)]"></div>
                <div className="h-4 w-1/2 rounded bg-[var(--bg-tertiary)]"></div>
                <div className="h-4 w-5/6 rounded bg-[var(--bg-tertiary)]"></div>
              </div>
              <div className="pt-2 border-t border-[var(--border-primary)]">
                <p className="text-xs text-[var(--text-muted)] italic">
                  "Opening 15 tabs on StackOverflow... again."
                </p>
              </div>
            </div>
          </div>

          {/* After: AI Chat */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <span className="text-emerald-400 text-lg">✓</span>
              </div>
              <h3 className="text-xl font-semibold">The Snippets Way</h3>
            </div>
            <div className="rounded-lg border border-[var(--accent-primary)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-[0_0_30px_-10px_rgba(var(--accent-primary-rgb),0.3)]">
              <div className="space-y-3">
                {/* User Question */}
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-sm bg-[var(--accent-primary)] px-4 py-2 text-sm text-white">
                    Why is my useEffect loop stale?
                  </div>
                </div>
                {/* AI Answer */}
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm bg-[var(--bg-tertiary)] px-4 py-3 text-sm text-[var(--text-primary)] max-w-[90%] border border-[var(--border-primary)]">
                    <p className="mb-2">It's likely a <strong>stale closure</strong>. Your effect isn't including the state variable in its dependency array.</p>
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
