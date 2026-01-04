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
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Rich Text & Code</h3>
                <p>
                  The editor supports full markdown-style formatting. Use the toolbar or shortcuts to add headings, 
                  lists, and bold text. Insert code blocks with <code className="rounded bg-[var(--bg-tertiary)] px-2 py-1 text-sm">{"{ }"}</code> to 
                  get syntax highlighting.
                </p>
              </div>
            </div>
          </section>

          {/* Connected Knowledge */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Connected Knowledge</h2>
            <div className="space-y-4 text-[var(--text-muted)]">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Linking Snippets</h3>
                <p>
                  Type <code className="rounded bg-[var(--bg-tertiary)] px-2 py-1 text-sm">@</code> to open the connection menu. 
                  Select any other snippet to create a bidirectional link.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Context Sidebar</h3>
                <p>
                  The sidebar shows you exactly how your knowledge connects. "Connected To" shows what you've linked to, 
                  and "Referenced By" shows other snippets that link back to the current one.
                </p>
              </div>
            </div>
          </section>

          {/* Smart Workflows */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Smart Workflows</h2>
            <div className="space-y-4 text-[var(--text-muted)]">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Resume Working</h3>
                <p>
                  If you leave the app and come back within 48 hours, the dashboard will offer a "Resume" banner 
                  to take you straight back to your last edit.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Quick Create</h3>
                <p>
                  Need to capture a thought instantly? Use the "Quick Create" button on the dashboard to 
                  start a new snippet without navigating through technology folders.
                </p>
              </div>
            </div>
          </section>

          {/* Review Mode */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Keeping Knowledge Fresh</h2>
            <div className="space-y-4 text-[var(--text-muted)]">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Review Mode</h3>
                <p>
                  Click the "Rediscover" card on your dashboard to enter Review Mode. We surface snippets you 
                  haven't viewed in a while to help you refresh your memory. It's like spaced repetition for your code.
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
