import { createClient } from "@/lib/supabase/server";
import { StickyNav } from "@/components/landing/sticky-nav";
import { Footer } from "@/components/landing/footer";
import { Check } from "lucide-react";

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <StickyNav isAuthenticated={!!user} />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-[var(--text-muted)] mb-16 max-w-2xl mx-auto">
                Start for free, upgrade when you need more power. No hidden fees.
            </p>

            {/* Pricing Cards Placeholder */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
                {/* Free Tier */}
                <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 p-8 flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">Hobby</h3>
                    <div className="text-3xl font-bold mb-6">$0 <span className="text-base font-normal text-[var(--text-muted)]">/mo</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-sm">
                            <Check className="h-4 w-4 text-[var(--text-primary)]" /> 100 Snippets
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <Check className="h-4 w-4 text-[var(--text-primary)]" /> 5 Technologies
                        </li>
                         <li className="flex items-center gap-3 text-sm">
                            <Check className="h-4 w-4 text-[var(--text-primary)]" /> Community Support
                        </li>
                    </ul>
                    <button className="w-full rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] py-2.5 text-sm font-semibold hover:bg-[var(--bg-tertiary)] transition-colors">
                        Get Started
                    </button>
                </div>

                {/* Pro Tier */}
                <div className="rounded-2xl border border-[var(--accent-primary)]/50 bg-[var(--bg-secondary)] p-8 flex flex-col relative shadow-2xl shadow-[var(--accent-primary)]/5">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent-primary)] text-[var(--bg-primary)] px-3 py-1 rounded-full text-xs font-bold">
                        MOST POPULAR
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-[var(--accent-primary)]">Pro</h3>
                    <div className="text-3xl font-bold mb-6">$12 <span className="text-base font-normal text-[var(--text-muted)]">/mo</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-sm">
                            <Check className="h-4 w-4 text-[var(--accent-primary)]" /> Unlimited Snippets
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <Check className="h-4 w-4 text-[var(--accent-primary)]" /> Unlimited Technologies
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <Check className="h-4 w-4 text-[var(--accent-primary)]" /> AI Search & Chat
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <Check className="h-4 w-4 text-[var(--accent-primary)]" /> Priority Support
                        </li>
                    </ul>
                    <button className="w-full rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
                        Start Free Trial
                    </button>
                </div>

                {/* Team Tier */}
                <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 p-8 flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">Team</h3>
                    <div className="text-3xl font-bold mb-6">$49 <span className="text-base font-normal text-[var(--text-muted)]">/mo</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-sm">
                            <Check className="h-4 w-4 text-[var(--text-primary)]" /> 5 Team Members
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <Check className="h-4 w-4 text-[var(--text-primary)]" /> Shared Library
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <Check className="h-4 w-4 text-[var(--text-primary)]" /> Advanced Permissions
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <Check className="h-4 w-4 text-[var(--text-primary)]" /> Audit Logs
                        </li>
                    </ul>
                    <button className="w-full rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] py-2.5 text-sm font-semibold hover:bg-[var(--bg-tertiary)] transition-colors">
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
