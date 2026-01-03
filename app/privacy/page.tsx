import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Code2 } from "lucide-react";
import Link from "next/link";

export default async function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-[var(--text-muted)] mb-12">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Your Privacy Matters</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Snippets is built with privacy as a core principle. We collect minimal data and never sell 
                your information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">What We Collect</h2>
              <div className="space-y-4 text-[var(--text-muted)]">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">Account Information</h3>
                  <p>When you sign up, we collect your email address to create and manage your account.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">Content Data</h3>
                  <p>
                    Your snippets, notes, and code are stored securely in our database. This data is 
                    encrypted and protected by Row Level Security (RLS).
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">Usage Data</h3>
                  <p>
                    We collect basic analytics (page views, session duration) to improve the service. 
                    This data is anonymized and aggregated.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">How We Use Your Data</h2>
              <ul className="list-disc list-inside space-y-2 text-[var(--text-muted)] ml-4">
                <li>To provide and maintain the Snippets service</li>
                <li>To authenticate your account and prevent unauthorized access</li>
                <li>To sync your data across devices</li>
                <li>To send important service updates (you can opt out of marketing emails)</li>
                <li>To improve our service based on usage patterns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Your data is stored on Supabase's secure infrastructure with industry-standard encryption. 
                We implement Row Level Security to ensure that only you can access your snippets. 
                We never have access to your unencrypted data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--text-muted)] ml-4">
                <li><strong className="text-[var(--text-primary)]">Supabase:</strong> Database and authentication</li>
                <li><strong className="text-[var(--text-primary)]">Vercel:</strong> Hosting and deployment</li>
              </ul>
              <p className="text-[var(--text-muted)] leading-relaxed mt-4">
                These services have their own privacy policies and security measures.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--text-muted)] ml-4">
                <li>Access all your data at any time through your dashboard</li>
                <li>Export your data in a portable format</li>
                <li>Delete your account and all associated data</li>
                <li>Request corrections to your personal information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@snippets.app" className="text-[var(--text-primary)] hover:underline">
                  privacy@snippets.app
                </a>
              </p>
            </section>
          </div>
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
