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
              Most note-taking apps are built for everyone, which means they're optimized for no one. 
              Snippets is different. It's built exclusively for developers who need to store code, 
              configurations, and technical notes.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed">
              We believe in simplicity, speed, and a distraction-free interface. No bloat, 
              no unnecessary features—just a powerful editor and a clean organization system.
            </p>
          </section>

          {/* Key Features */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Key Features</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]">
                  <Code2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Professional Code Editor</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Powered by CodeMirror 6, the same editor used by Replit and Chrome DevTools. 
                    Features line numbers, syntax highlighting for 20+ languages, auto-indentation, 
                    and bracket matching.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Organized by Technology</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Group your snippets by language or framework. Create separate collections for 
                    React, Python, Docker, or any technology you work with.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Built on Next.js 16 and Supabase's edge network. Pages load instantly, 
                    and your data syncs in real-time across all your devices.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Secure & Private</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Your data is encrypted and protected by Supabase's Row Level Security. 
                    Only you can access your snippets—no one else, not even us.
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
