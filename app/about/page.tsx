import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Check, Code2, Database, Lock, Zap } from "lucide-react";
import Link from "next/link";

export default async function AboutPage() {
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
            About Snippets
          </h1>
          <p className="text-xl text-[var(--text-muted)] mb-12">
            A minimal, powerful knowledge vault built specifically for developers.
          </p>

          {/* Philosophy */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4">Our Philosophy</h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              Code doesn't exist in a vacuum. It's connected. Most note-taking apps treat your snippets as isolated islands, 
              but your knowledge is a network. Snippets is built to mirror how your brain works: connected, contextual, and always ready.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed">
              We believe in friction-free workflows. Whether you're jumping back into a complex problem after the weekend 
              or connecting two related concepts, the interface should get out of your way and let you flow.
            </p>
          </section>

          {/* Key Features */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Key Features</h2>
            <div className="space-y-6">
              
              {/* Feature: Editor */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]">
                  <Code2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Professional Code Editor</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Powered by CodeMirror 6. Features line numbers, syntax highlighting for 20+ languages, 
                    auto-indentation, and bracket matching. It feels like your IDE.
                  </p>
                </div>
              </div>

              {/* Feature: Context/Linking */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contextual Knowledge Graph</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Don't just store code—connect it. Use <code className="bg-[var(--bg-tertiary)] px-1 rounded">@</code> mentions 
                    to link snippets together. See what's connected and traverse your knowledge base like a graph.
                  </p>
                </div>
              </div>

              {/* Feature: Continuity */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Smart Continuity</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Pick up exactly where you left off. The dashboard remembers what you were working on 
                    and offers a one-click resume. Capture ideas instantly with Quick Create.
                  </p>
                </div>
              </div>

              {/* Feature: Review */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Active Recall</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Keep your knowledge fresh. The "Rediscover" mode surfaces snippets you haven't seen in a while, 
                    helping you retain syntax and solutions you might otherwise forget.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Tech Stack */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4">Built With</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {["Next.js 16", "Supabase", "CodeMirror 6", "TipTap", "Drizzle ORM", "Tailwind CSS"].map((tech) => (
                <div
                  key={tech}
                  className="flex items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-3"
                >
                  <Check className="h-4 w-4 text-[var(--text-secondary)]" />
                  <span className="text-sm">{tech}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-[var(--text-muted)] mb-6">
              Join developers who've already organized their knowledge with Snippets.
            </p>
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
