export function FAQSection() {
  return (
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
  );
}
