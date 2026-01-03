import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Code2 } from "lucide-react";
import Link from "next/link";

export default async function DocsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Navigation */}
      <header className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
          <Code2 className="h-6 w-6" />
          <span>Snippets</span>
        </Link>
        
        {user ? (
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:text-[var(--text-secondary)] transition-colors"
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-sm font-medium hover:text-[var(--text-secondary)] transition-colors"
          >
            Sign In
          </Link>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-6 py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Documentation
          </h1>
          <p className="text-xl text-[var(--text-muted)] mb-12">
            Everything you need to know to get started with Snippets.
          </p>

          {/* Quick Start */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
                <h3 className="font-semibold mb-2">1. Create an Account</h3>
                <p className="text-[var(--text-muted)]">
                  Sign up with your email. We'll send you a magic link—no password needed.
                </p>
              </div>
              <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
                <h3 className="font-semibold mb-2">2. Create Your First Technology</h3>
                <p className="text-[var(--text-muted)]">
                  Click "New Technology" and name it after a language or framework (e.g., "React", "Python").
                </p>
              </div>
              <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
                <h3 className="font-semibold mb-2">3. Add Your First Snippet</h3>
                <p className="text-[var(--text-muted)]">
                  Click on a technology, then "New Entry". Give it a title and start writing. 
                  Use the toolbar to format text or insert code blocks.
                </p>
              </div>
            </div>
          </section>

          {/* Using the Editor */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Using the Editor</h2>
            <div className="space-y-4 text-[var(--text-muted)]">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Rich Text Formatting</h3>
                <p>
                  Use the toolbar to make text <strong>bold</strong>, <em>italic</em>, or add headings. 
                  You can also create lists and blockquotes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Code Blocks</h3>
                <p>
                  Click the <code className="rounded bg-[var(--bg-tertiary)] px-2 py-1 text-sm">{"{ }"}</code> button 
                  to insert a code block. The editor includes:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Line numbers</li>
                  <li>Syntax highlighting for 20+ languages</li>
                  <li>Auto-indentation</li>
                  <li>Bracket matching</li>
                  <li>Language switching (click the language name)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Saving</h3>
                <p>
                  Click "Save Entry" when you're done. Your work is automatically saved to the cloud.
                </p>
              </div>
            </div>
          </section>

          {/* Tips & Tricks */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Tips & Tricks</h2>
            <div className="space-y-3 text-[var(--text-muted)]">
              <p>
                <strong className="text-[var(--text-primary)]">Organize by Use Case:</strong> Create technologies 
                for specific projects or topics (e.g., "Docker Commands", "Git Workflows").
              </p>
              <p>
                <strong className="text-[var(--text-primary)]">Use Descriptive Titles:</strong> Name your entries 
                clearly so you can find them later (e.g., "React useEffect Cleanup Pattern").
              </p>
              <p>
                <strong className="text-[var(--text-primary)]">Copy Code Quickly:</strong> Click the "Copy" button 
                in any code block to copy it to your clipboard.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to start?</h2>
            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--text-primary)] px-8 text-sm font-semibold text-[var(--bg-primary)] transition-all hover:opacity-90"
            >
              {user ? "Go to Dashboard" : "Get Started Free"}
            </Link>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-primary)] py-8">
        <div className="container mx-auto px-6 text-center text-sm text-[var(--text-muted)]">
          <p>&copy; {new Date().getFullYear()} Snippets. Built for developers.</p>
        </div>
      </footer>
    </div>
  );
}
