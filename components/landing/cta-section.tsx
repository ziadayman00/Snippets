import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="py-24 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]/30">
      <div className="container mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
          Ready to organize your code?
            </h2>
        <p className="text-lg text-[var(--text-muted)] mb-8">
          Join developers who've ditched scattered notes for a clean, powerful knowledge vault.
            </p>
              <Link 
                href={isAuthenticated ? "/dashboard" : "/login"}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--text-primary)] px-8 text-sm font-semibold text-[var(--bg-primary)] transition-all hover:opacity-90 shadow-lg shadow-[var(--accent-primary)]/20"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
          <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
    </section>
  );
}
