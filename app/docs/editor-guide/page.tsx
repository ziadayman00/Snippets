
import { createClient } from "@/lib/supabase/server";
import { StickyNav } from "@/components/landing/sticky-nav";
import { Footer } from "@/components/landing/footer";
import { BookOpen, Command, Code2, Sparkles, CheckCircle, Clock, Link as LinkIcon, AlertCircle, Keyboard } from "lucide-react";
import Link from "next/link";

export default async function EditorGuidePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-white">
      <StickyNav isAuthenticated={!!user} />

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
            
            {/* Header */}
            <div className="mb-12 border-b border-[var(--border-primary)] pb-8">
                <Link href="/docs" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors mb-4 inline-flex items-center gap-1">
                    ← Back to Documentation
                </Link>
                <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-[var(--accent-primary)]" />
                    Editor Guide
                </h1>
                <p className="text-xl text-[var(--text-secondary)]">
                    Master the Snippets editor to create, manage, and connect your knowledge.
                </p>
            </div>

            <div className="space-y-16">

                {/* Section 1: The Basics */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                        <Keyboard className="h-6 w-6 text-blue-400" />
                        The Basics
                    </h2>
                    <div className="prose prose-invert max-w-none text-[var(--text-muted)]">
                        <p className="mb-4">
                            The editor is a rich-text environment designed for speed. It supports **Markdown shortcuts** and **Slash commands**.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <ShortcutCard 
                                shortcut="/" 
                                description="Opens the command menu to insert blocks" 
                            />
                            <ShortcutCard 
                                shortcut="# Space" 
                                description="Creates a Heading 1 (Type # then Space)" 
                            />
                             <ShortcutCard 
                                shortcut="```" 
                                description="Starts a code block immediately" 
                            />
                             <ShortcutCard 
                                shortcut="> Space" 
                                description="Creates a quote block (Type > then Space)" 
                            />
                        </div>
                    </div>
                </section>

                {/* Section 2: Code Blocks */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                        <Code2 className="h-6 w-6 text-green-400" />
                        Supercharged Code Blocks
                    </h2>
                    <div className="space-y-6">
                        <p className="text-[var(--text-muted)]">
                            Code blocks in Snippets are treated as managed assets, not just text.
                        </p>
                        
                        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-6">
                            <h3 className="text-lg font-medium text-white mb-3">1. Smart Defaults</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-4">
                                The editor automatically suggests languages based on your Technology (e.g., React → JSX) and your recent usage history.
                            </p>
                        </div>

                        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-6">
                            <h3 className="text-lg font-medium text-white mb-3">2. Metadata & Lifecycle</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-4">
                                Click the <span className="inline-block px-1.5 py-0.5 rounded bg-[#2a2a2a] border border-[#3a3a3a] text-xs">⚙️</span> gear icon on any code block to open the settings panel.
                            </p>
                            <ul className="grid gap-3 sm:grid-cols-3">
                                <li className="flex gap-3 items-start">
                                    <CheckCircle className="h-4 w-4 text-green-400 mt-1 shrink-0" />
                                    <div className="text-sm text-[var(--text-muted)]">
                                        <strong className="text-white block mb-1">Intent</strong>
                                        Tag code as Production, Ideation, or Deprecated.
                                    </div>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <CheckCircle className="h-4 w-4 text-blue-400 mt-1 shrink-0" />
                                    <div className="text-sm text-[var(--text-muted)]">
                                        <strong className="text-white block mb-1">Versioning</strong>
                                        Track version numbers (e.g., v1.0.2).
                                    </div>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <CheckCircle className="h-4 w-4 text-purple-400 mt-1 shrink-0" />
                                    <div className="text-sm text-[var(--text-muted)]">
                                        <strong className="text-white block mb-1">Verification</strong>
                                        Timestamp code as "Verified" to establish trust.
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Section 3: Smart Signals */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-purple-400" />
                        Smart Signals
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="h-5 w-5 text-yellow-400" />
                                <h3 className="text-lg font-medium text-white">Recency & Decay</h3>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mb-4">
                                Prevent "rotting knowledge". The sidebar shows a Freshness indicator.
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    <span className="text-[var(--text-muted)]">Fresh ({"<"} 30 days)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                                    <span className="text-[var(--text-muted)]">Aging (30-90 days)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                    <span className="text-[var(--text-muted)]">Stale ({">"} 90 days)</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <LinkIcon className="h-5 w-5 text-blue-400" />
                                <h3 className="text-lg font-medium text-white">Inline Context</h3>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mb-4">
                                When you mention a snippet in another entry (using <code>@SnippetName</code>), a backlink appears in the source snippet's footer.
                            </p>
                             <div className="rounded bg-[var(--bg-tertiary)] p-3 text-xs font-mono text-[var(--text-muted)]">
                                "Referenced in: <span className="text-blue-400">Auth Flow</span>"
                                <br/>
                                "...I used <span className="text-blue-400">@LoginComponent</span> to fix the bug..."
                            </div>
                        </div>
                    </div>
                </section>

                 <section className="rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 p-8 text-center">
                    <h2 className="text-xl font-semibold mb-2">Ready to write?</h2>
                    <p className="text-[var(--text-secondary)] mb-6">
                        Jump back into the editor and try out the new powers.
                    </p>
                     <Link 
                        href="/dashboard"
                        className="inline-flex items-center justify-center rounded-lg bg-[var(--accent-primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--accent-primary)]/90 transition-colors"
                    >
                        Go to Dashboard
                    </Link>
                 </section>

            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ShortcutCard({ shortcut, description }: { shortcut: string; description: string }) {
    return (
        <div className="flex items-center gap-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 p-4">
            <kbd className="h-8 min-w-[2rem] px-2 flex items-center justify-center rounded bg-[var(--bg-tertiary)] border border-[var(--border-primary)] font-mono text-sm font-bold text-[var(--text-primary)] shadow-sm">
                {shortcut}
            </kbd>
            <span className="text-sm text-[var(--text-secondary)]">{description}</span>
        </div>
    );
}
