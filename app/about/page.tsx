import { createClient } from "@/lib/supabase/server";
import { StickyNav } from "@/components/landing/sticky-nav";
import { Footer } from "@/components/landing/footer";
import { Code2, Database, Shield, Zap, Stars } from "lucide-react";
import Link from "next/link";

export default async function AboutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-zinc-100 selection:bg-purple-500/30">
      <StickyNav isAuthenticated={!!user} />

      <main className="flex-1">
        {/* Hero Section - Bold & Centered */}
        <section className="relative pt-32 pb-32 overflow-hidden border-b border-white/10">
             {/* Subtle Glow - No Neural Network */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
             
             <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-zinc-400 mb-8">
                    <Stars className="h-4 w-4 text-purple-400" />
                    <span>Our Philosophy</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight font-mono">
                    We build for the <br />
                    <span className="text-white">builders.</span>
                </h1>
                <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
                    We're on a mission to organize the world's programming knowledge, one snippet at a time.
                </p>
             </div>
        </section>

        {/* The 'Why' Section - Glass Cards */}
        <section className="py-32 relative">
            <div className="container mx-auto px-6 relative">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="group relative p-8 rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-white/20 transition-all duration-300">
                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 border border-purple-500/20">
                                <Database className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 font-mono">Context Awareness</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Knowledge without context is just noise. Our graph engine understands how your snippets relate, transforming a flat list into a vibrant web of ideas.
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="group relative p-8 rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-white/20 transition-all duration-300">
                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 text-orange-400 border border-orange-500/20">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 font-mono">Speed by Design</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Every millisecond counts. From instant search results to optimistic UI updates, we obsess over performance so you never break your flow state.
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="group relative p-8 rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-white/20 transition-all duration-300">
                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400 border border-emerald-500/20">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 font-mono">Privacy Core</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Your intellectual property is yours alone. We employ enterprise-grade RLS (Row Level Security) and encryption to ensure your vault stays private.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Story Section - Minimalist Text */}
        <section className="py-32 bg-white/[0.02] border-y border-white/5">
            <div className="container mx-auto px-6 max-w-4xl text-center">
                 <h2 className="text-sm font-mono uppercase tracking-widest mb-12 text-zinc-500">Our Origins</h2>
                 <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-12 text-zinc-200">
                     "We built Snippets because we were tired of losing our best solutions in slack threads and lost browser bookmarks."
                 </p>
                 <div className="flex items-center justify-center gap-4 text-zinc-400">
                     <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                        <Code2 className="h-5 w-5" />
                     </div>
                     <div className="text-left">
                         <div className="font-semibold text-zinc-200 text-sm">The Snippets Team</div>
                         <div className="text-xs">Remote & Asynchronous</div>
                     </div>
                 </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32">
             <div className="container mx-auto px-6">
                 <div className="relative rounded-[32px] overflow-hidden border border-white/10 bg-white/[0.02] px-6 py-20 text-center sm:px-12 md:py-24">
                     
                     <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                         <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-mono">
                            Start building your <br className="hidden sm:block" />
                            <span className="text-purple-400">knowledge engine.</span>
                         </h2>
                         <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                             Stop letting your best ideas slip through the cracks. It's time to treat your code snippets like the assets they are.
                         </p>
                         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                             <Link href="/login" className="h-12 px-8 rounded-full bg-white text-black font-semibold text-sm flex items-center justify-center hover:bg-zinc-200 transition-all min-w-[160px]">
                                 Get Started Free
                             </Link>
                             <Link href="/docs" className="h-12 px-8 rounded-full border border-white/10 bg-white/5 text-zinc-200 font-medium text-sm flex items-center justify-center hover:bg-white/10 transition-colors min-w-[160px]">
                                 Read the Manifesto
                             </Link>
                         </div>
                     </div>
                 </div>
             </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
