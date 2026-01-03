import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Code2 } from "lucide-react";
import Link from "next/link";

export default async function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm text-[var(--text-muted)] mb-12">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                By accessing or using Snippets, you agree to be bound by these Terms of Service. 
                If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Use License</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                We grant you a personal, non-transferable, non-exclusive license to use Snippets for your 
                personal or internal business purposes.
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                You may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--text-muted)] ml-4">
                <li>Modify or copy the service's code or materials</li>
                <li>Use the service for any commercial purpose without authorization</li>
                <li>Attempt to reverse engineer any part of the service</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the service to another person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
              <div className="space-y-4 text-[var(--text-muted)]">
                <p>
                  You are responsible for maintaining the confidentiality of your account and for all 
                  activities that occur under your account.
                </p>
                <p>
                  You agree to immediately notify us of any unauthorized use of your account. We will not 
                  be liable for any loss or damage arising from your failure to comply with this obligation.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Content</h2>
              <div className="space-y-4 text-[var(--text-muted)]">
                <p>
                  You retain all rights to the content you create and store in Snippets. By using our service, 
                  you grant us the right to store, display, and transmit your content solely for the purpose 
                  of providing the service to you.
                </p>
                <p>
                  You are responsible for the content you store. You agree not to use Snippets to store or 
                  share content that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violates any law or regulation</li>
                  <li>Infringes on intellectual property rights</li>
                  <li>Contains malware or harmful code</li>
                  <li>Is intended to harm or exploit others</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Service Availability</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                We strive to provide reliable service, but we do not guarantee that Snippets will be 
                available at all times. We may experience downtime for maintenance, updates, or due to 
                factors beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Termination</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice, if you breach 
                these Terms of Service. Upon termination, your right to use the service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Snippets is provided "as is" without warranties of any kind. We shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages resulting from your use of 
                or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify you of any changes 
                by posting the new Terms of Service on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                If you have questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:legal@snippets.app" className="text-[var(--text-primary)] hover:underline">
                  legal@snippets.app
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
