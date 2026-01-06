import { createClient } from "@/lib/supabase/server";
import { StickyNav } from "@/components/landing/sticky-nav";
import { Footer } from "@/components/landing/footer";

export default async function ChangelogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <StickyNav isAuthenticated={!!user} />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 text-center">
                Changelog
            </h1>
            <p className="text-xl text-[var(--text-muted)] mb-16 text-center">
                New updates and improvements to Snippets.
            </p>

            <div className="space-y-12 relative border-l border-[var(--border-primary)] pl-8 ml-4 md:ml-0">
                {/* Latest Release */}
                <div className="relative">
                    <span className="absolute -left-[39px] top-1 h-5 w-5 rounded-full border-4 border-[var(--bg-primary)] bg-[var(--accent-primary)]" />
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-[var(--text-muted)]">January 6, 2026</span>
                        <span className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-xs font-bold px-2 py-0.5 rounded-full border border-[var(--accent-primary)]/20">
                            v1.2.0
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">AI-Powered Search & New Editor Theme</h2>
                    <ul className="list-disc list-outside ml-4 space-y-2 text-[var(--text-secondary)]">
                        <li>Introduced semantic search using vector embeddings for smarter results.</li>
                        <li>Overhauled the editor with a new high-contrast, clean aesthetic.</li>
                        <li>Added a solid background to full-screen mode for better focus.</li>
                        <li>Fixed sidebar padding and layout consistency.</li>
                    </ul>
                </div>

                {/* Previous Release */}
                <div className="relative">
                    <span className="absolute -left-[39px] top-1 h-5 w-5 rounded-full border-4 border-[var(--bg-primary)] bg-[var(--text-muted)]" />
                    <div className="flex items-center gap-3 mb-2">
                         <span className="text-sm font-medium text-[var(--text-muted)]">December 28, 2025</span>
                         <span className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs font-bold px-2 py-0.5 rounded-full border border-[var(--border-primary)]">
                            v1.1.0
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Review Mode & Continuity</h2>
                    <ul className="list-disc list-outside ml-4 space-y-2 text-[var(--text-secondary)]">
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
