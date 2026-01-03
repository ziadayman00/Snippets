import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Code2, Database, Zap } from "lucide-react";
import Link from "next/link";
import { StickyNav } from "@/components/landing/sticky-nav";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- UNAUTHENTICATED STATE: LANDING PAGE ---
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Sticky Navigation */}
      <StickyNav isAuthenticated={!!user} />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 lg:py-32 text-center min-h-screen">
          <div className="mb-4 sm:mb-6 inline-flex items-center rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
            <span>v1.0 Public Beta</span>
          </div>
          <h1 className="max-w-4xl text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
            Your programming <br className="hidden sm:inline" />
            <span className="text-[var(--text-secondary)]">knowledge vault.</span>
          </h1>
          <p className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg lg:text-xl text-[var(--text-muted)] px-4">
            A minimal, distraction-free space to store your code snippets, 
            configuration files, and technical notes. Built for developers who value clarity.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto px-4">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="group flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[var(--text-primary)] px-8 text-sm font-semibold text-[var(--bg-primary)] transition-all hover:opacity-90"
            >
              {user ? "Go to Dashboard" : "Get Started"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://github.com" 
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold leading-6 hover:text-[var(--text-secondary)] transition-colors"
            >
              View on GitHub <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        {/* Feature Section (Minimal) */}
        <section className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid gap-8 sm:gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-4 fade-in-up-delay-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Lightning Fast</h3>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Zero bloat. Built on the edge with Supabase and Next.js for instant page loads.
                </p>
              </div>
              <div className="flex flex-col gap-4 fade-in-up-delay-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Structured Data</h3>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Organize by technology. Strict schema ensures your knowledge base scales with you.
                </p>
              </div>
              <div className="flex flex-col gap-4 fade-in-up-delay-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Code-First Editor</h3>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Rich text editor with first-class support for syntax highlighting and code blocks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section - Minimal */}
        <section className="border-t border-[var(--border-primary)] py-24">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                From Chaos to Clarity
              </h2>
              <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
                Stop searching through scattered notes. Organize your code knowledge in one clean, searchable place.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Before */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                    <span className="text-red-400 text-lg">✗</span>
                  </div>
                  <h3 className="text-xl font-semibold">Before</h3>
                </div>
                <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 space-y-3">
                  <div className="text-sm text-[var(--text-muted)] space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-50">📝</span>
                      <span>random-notes.txt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-50">📝</span>
                      <span>code-snippets-final-v2.md</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-50">📝</span>
                      <span>docker-commands-BACKUP.txt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-50">📝</span>
                      <span>react-hooks-maybe-delete.md</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[var(--border-primary)]">
                    <p className="text-xs text-[var(--text-muted)] italic">
                      "Where did I save that Docker command...?"
                    </p>
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <span className="text-green-400 text-lg">✓</span>
                  </div>
                  <h3 className="text-xl font-semibold">After</h3>
                </div>
                <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs opacity-50">📁</span>
                        <span className="font-semibold">Docker</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">12 snippets</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs opacity-50">📁</span>
                        <span className="font-semibold">React</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">8 snippets</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs opacity-50">📁</span>
                        <span className="font-semibold">Python</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">15 snippets</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs opacity-50">📁</span>
                        <span className="font-semibold">Git</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">6 snippets</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[var(--border-primary)]">
                    <p className="text-xs text-[var(--text-muted)] italic">
                      "Found it in 2 seconds. Perfect."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Editor Preview */}
            <div className="mt-12 rounded-lg border border-[var(--border-primary)] overflow-hidden shadow-lg">
              <div className="flex items-center justify-between border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/50"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500/50"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <span className="ml-2 text-xs text-[var(--text-muted)]">example.js</span>
                </div>
                <div className="text-xs text-[var(--text-muted)]">Professional code editor built-in</div>
              </div>
              <div className="bg-[var(--bg-tertiary)] p-6 font-mono text-sm">
                <div className="space-y-1 text-[var(--text-muted)]">
                  <div><span className="text-[var(--text-secondary)]">1</span>  <span className="text-purple-400">function</span> <span className="text-blue-400">organizeCode</span>() {"{"}</div>
                  <div><span className="text-[var(--text-secondary)]">2</span>    <span className="text-purple-400">const</span> snippets = <span className="text-green-400">"all in one place"</span>;</div>
                  <div><span className="text-[var(--text-secondary)]">3</span>    <span className="text-purple-400">return</span> snippets;</div>
                  <div><span className="text-[var(--text-secondary)]">4</span>  {"}"}</div>
                  <div className="pt-2 text-xs opacity-50">// Line numbers, syntax highlighting, auto-indentation ✓</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-t border-[var(--border-primary)] py-24">
          <div className="container mx-auto max-w-3xl px-6">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-center text-[var(--text-muted)] mb-12">
              Everything you need to know about Snippets
            </p>
            <div className="space-y-4">
              <details className="group rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 transition-all hover:bg-[var(--bg-tertiary)]">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-lg list-none">
                  Is Snippets free to use?
                  <span className="ml-4 shrink-0 transition-transform group-open:rotate-180">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
                  Yes! Snippets is completely free during the public beta. We believe developers should have access to powerful tools without barriers. There are no hidden fees, credit card requirements, or premium tiers—just a clean, functional knowledge vault for your code.
                </p>
              </details>

              <details className="group rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 transition-all hover:bg-[var(--bg-tertiary)]">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-lg list-none">
                  How is my data stored and secured?
                  <span className="ml-4 shrink-0 transition-transform group-open:rotate-180">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
                  Your snippets are stored in Supabase's PostgreSQL database with enterprise-grade security. We implement Row Level Security (RLS) to ensure only you can access your data. All connections are encrypted with SSL, and your data is backed up regularly. We never have access to your unencrypted content.
                </p>
              </details>

              <details className="group rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 transition-all hover:bg-[var(--bg-tertiary)]">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-lg list-none">
                  Can I export or migrate my data?
                  <span className="ml-4 shrink-0 transition-transform group-open:rotate-180">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
                  Absolutely. You own your data, period. Export functionality is planned for a future update—you'll be able to download all your snippets in standard formats (JSON, Markdown). Your data is stored in a standard PostgreSQL database, so it's never locked in a proprietary format.
                </p>
              </details>

              <details className="group rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 transition-all hover:bg-[var(--bg-tertiary)]">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-lg list-none">
                  What programming languages are supported?
                  <span className="ml-4 shrink-0 transition-transform group-open:rotate-180">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
                  The editor supports 20+ languages including JavaScript, TypeScript, Python, Go, Rust, CSS, HTML, JSON, SQL, and more. Powered by CodeMirror 6, you get professional-grade syntax highlighting, auto-indentation, bracket matching, and line numbers—just like VS Code.
                </p>
              </details>

              <details className="group rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 transition-all hover:bg-[var(--bg-tertiary)]">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-lg list-none">
                  Do I need to install anything?
                  <span className="ml-4 shrink-0 transition-transform group-open:rotate-180">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
                  No installation required! Snippets is a modern web application that works on any device with a browser. Sign in with your email (magic link authentication—no password to remember), and you're ready to go. Your snippets sync automatically across all your devices.
                </p>
              </details>

              <details className="group rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 transition-all hover:bg-[var(--bg-tertiary)]">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-lg list-none">
                  How is Snippets different from other note-taking apps?
                  <span className="ml-4 shrink-0 transition-transform group-open:rotate-180">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
                  Snippets is built exclusively for developers. Unlike general note-taking apps, we prioritize code over everything else. You get a professional code editor (not just syntax highlighting), organized by technology, with zero bloat. No unnecessary features, no distractions—just a fast, clean interface for storing technical knowledge.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 py-24">
          <div className="container mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Ready to organize your code?
            </h2>
            <p className="text-lg text-[var(--text-muted)] mb-8">
              Join developers who've ditched scattered notes for a clean, powerful knowledge vault.
            </p>
            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--text-primary)] px-8 text-sm font-semibold text-[var(--bg-primary)] transition-all hover:opacity-90"
            >
              {user ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-primary)] py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 font-bold text-lg tracking-tight mb-3">
                <Code2 className="h-5 w-5" />
                <span>Snippets</span>
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                Your programming knowledge vault.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get Started */}
            <div>
              <h3 className="font-semibold mb-3">Get Started</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/login" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--border-primary)] pt-8 text-center text-sm text-[var(--text-muted)]">
            <p>&copy; {new Date().getFullYear()} Snippets. Built for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
