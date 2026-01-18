import { createClient } from "@/lib/supabase/server";
import { StickyNav } from "@/components/landing/sticky-nav";
import { Footer } from "@/components/landing/footer";

export default async function ChangelogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-zinc-100 selection:bg-purple-500/30">
      <StickyNav isAuthenticated={!!user} />

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 text-center font-mono">
                Changelog
            </h1>
            <p className="text-xl text-zinc-400 mb-16 text-center">
                New updates and improvements to Snippets.
            </p>

            <div className="space-y-12 relative border-l border-white/10 pl-8 ml-4 md:ml-0">
                {/* Latest Release */}
                {/* Release 1.3.0 */}
                <div className="relative">
                    <span className="absolute -left-[39px] top-1.5 h-5 w-5 rounded-full border-4 border-[#0A0A0A] bg-purple-500" />
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-medium text-zinc-500 font-mono">January 11, 2026</span>
                        <span className="bg-purple-500/10 text-purple-400 text-xs font-mono px-2 py-0.5 rounded border border-purple-500/20">
                            v1.3.0
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 font-mono">Public Snippet Sharing</h2>
                    <ul className="list-disc list-outside ml-4 space-y-2 text-zinc-300">
                        <li>Share snippets publicly with beautiful, shareable links.</li>
                        <li>Auto-generated Open Graph images for social media previews.</li>
                        <li>View analytics with IP-based deduplication (24-hour window).</li>
                        <li>Owner exclusion - your own views don't count.</li>
                        <li>New homepage section showcasing the sharing feature.</li>
                    </ul>
                </div>

                {/* Release 1.2.0 */}
                <div className="relative">
                    <span className="absolute -left-[39px] top-1.5 h-5 w-5 rounded-full border-4 border-[#0A0A0A] bg-zinc-700" />
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-medium text-zinc-500 font-mono">January 6, 2026</span>
                        <span className="bg-white/5 text-zinc-400 text-xs font-mono px-2 py-0.5 rounded border border-white/10">
                            v1.2.0
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 font-mono">AI-Powered Search & New Editor Theme</h2>
                    <ul className="list-disc list-outside ml-4 space-y-2 text-zinc-300">
                        <li>Introduced semantic search using vector embeddings for smarter results.</li>
                        <li>Overhauled the editor with a new high-contrast, clean aesthetic.</li>
                        <li>Added a solid background to full-screen mode for better focus.</li>
                        <li>Fixed sidebar padding and layout consistency.</li>
                    </ul>
                </div>

                {/* Release 1.1.0 */}
                <div className="relative">
                    <span className="absolute -left-[39px] top-1.5 h-5 w-5 rounded-full border-4 border-[#0A0A0A] bg-zinc-700" />
                    <div className="flex items-center gap-3 mb-3">
                         <span className="text-sm font-medium text-zinc-500 font-mono">December 28, 2025</span>
                         <span className="bg-white/5 text-zinc-400 text-xs font-mono px-2 py-0.5 rounded border border-white/10">
                            v1.1.0
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 font-mono">Review Mode & Continuity</h2>
                    <ul className="list-disc list-outside ml-4 space-y-2 text-zinc-300">
                        <li>Added "Rediscover" cards to the dashboard for active recall.</li>
                        <li>Implemented "Resume Working" banner to quickly jump back into tasks.</li>
                        <li>Improved mobile navigation and responsiveness.</li>
                    </ul>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
