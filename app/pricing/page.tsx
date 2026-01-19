import { createClient } from "@/lib/supabase/server";
import { StickyNav } from "@/components/landing/sticky-nav";
import { Footer } from "@/components/landing/footer";
import { CheckCircle2, Crown, Sparkles } from "lucide-react";
import { UpgradeButton } from "@/components/upgrade/upgrade-button";
import { db } from "@/lib/drizzle/db";
import { users } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isPro = false;

  if (user) {
    const [userRecord] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);
    
    isPro = userRecord?.role === "pro";
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-zinc-100 selection:bg-purple-500/30">
      <StickyNav isAuthenticated={!!user} />

      <main className="flex-1 relative pt-32 pb-20 overflow-hidden">
        {/* Clean Background - specific request to remove Neural visuals from this page */}
        <div className="absolute inset-0 z-0 pointer-events-none">
             {/* Simple subtle glow instead of full neural network */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
            {/* Header */}
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 rounded-md border border-purple-500/30 bg-purple-500/10 backdrop-blur px-3 py-1 text-xs text-purple-200 font-mono mb-6">
                    <Sparkles className="h-3 ml-1 w-3 text-pink-400" />
                    <span className="mr-1">Simple. Transparent.</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-mono">
                    <span className="text-white">Pricing that scales</span>
                </h1>
                <p className="text-xl text-zinc-400 leading-relaxed">
                    Start building your knowledge graph for free. <br className="hidden sm:block" />
                    Upgrade when you're ready to power up your workflow.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
                {/* Free Tier */}
                <div 
                    className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 sm:p-10 relative overflow-hidden group hover:border-white/20 transition-colors"
                >
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-2 font-mono">Hobby</h3>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-5xl font-bold text-white">$0</span>
                            <span className="text-zinc-500">/month</span>
                        </div>
                        <p className="text-zinc-400 mb-8 h-12">
                            Perfect for personal notes and learning.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                "50 snippets", 
                                "3 technologies", 
                                "10 AI queries/month", 
                                "Semantic search",
                                "Basic formatting"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-zinc-300">
                                    <CheckCircle2 className="h-5 w-5 text-[var(--accent-primary)] shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                         {/* Free tier doesn't need a specific button action other than generic 'Get Started' linking to login */}
                        <a href="/login" className="flex items-center justify-center w-full rounded-full border border-white/10 bg-white/5 py-3 text-sm font-semibold hover:bg-white/10 transition-colors text-white">
                            Get Started
                        </a>
                    </div>
                </div>

                {/* Pro Tier */}
                <div 
                    className="relative rounded-3xl border border-purple-500/30 bg-black/40 backdrop-blur-xl p-8 sm:p-10 overflow-hidden"
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
                    <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                    
                    <div className="relative z-10">
                         <div className="absolute top-0 right-0">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 px-3 py-1 text-xs font-medium text-purple-200">
                                <Crown className="h-3 w-3" />
                                <span>Most Popular</span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2 font-mono">Pro</h3>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-5xl font-bold text-white">$9</span>
                            <span className="text-zinc-500">/month</span>
                        </div>
                        <p className="text-zinc-400 mb-8 h-12">
                            For serious developers building a knowledge base.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                "Unlimited snippets", 
                                "Unlimited technologies", 
                                "Unlimited AI queries", 
                                "Priority support",
                                "Early access to features",
                                "Advanced export options"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-white font-medium">
                                    <CheckCircle2 className="h-5 w-5 text-purple-400 shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                         <UpgradeButton isPro={isPro} />
                    </div>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
