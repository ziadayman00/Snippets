import { createClient } from "@/lib/supabase/server";
import { StickyNav } from "@/components/landing/sticky-nav";
import { Footer } from "@/components/landing/footer";
import { Code2, Database, Globe, Heart, Shield, Users, Zap, ArrowRight, Stars, Coffee } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function AboutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <StickyNav isAuthenticated={!!user} />

      <main className="flex-1">
        {/* Hero Section - Bold & Centered */}
        <section className="relative pt-32 pb-32 overflow-hidden border-b border-[var(--border-primary)]/50">
             {/* Abstract Background Effects */}
             <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--bg-secondary)_100%)] pointer-events-none" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-primary)]/5 blur-[120px] rounded-full pointer-events-none" />
             
             <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-1.5 text-sm font-medium text-[var(--text-secondary)] mb-8 shadow-sm">
                    <Stars className="h-4 w-4 text-purple-500" />
                    <span>Our Philosophy</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-tight">
                    We build for the <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] via-[var(--text-secondary)] to-[var(--text-muted)]">builders.</span>
                </h1>
                <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed font-light">
                    We're on a mission to organize the world's programming knowledge, one snippet at a time.
                </p>
             </div>
        </section>

        {/* The 'Why' Section - Glass Cards */}
        <section className="py-32 relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--bg-secondary)]/50 to-transparent pointer-events-none" />
            <div className="container mx-auto px-6 relative">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="group relative p-8 rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 backdrop-blur-sm overflow-hidden hover:bg-[var(--bg-secondary)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--accent-primary)]/5">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Database className="h-24 w-24" />
                        </div>
                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-6 text-[var(--accent-primary)] border border-[var(--border-primary)] shadow-inner">
                                <Database className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Context Awareness</h3>
                            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                                Knowledge without context is just noise. Our graph engine understands how your snippets relate, transforming a flat list into a vibrant web of ideas.
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="group relative p-8 rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 backdrop-blur-sm overflow-hidden hover:bg-[var(--bg-secondary)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--accent-primary)]/5">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap className="h-24 w-24" />
                        </div>
                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-6 text-orange-500 border border-[var(--border-primary)] shadow-inner">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Speed by Design</h3>
                            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                                Every millisecond counts. From instant search results to optimistic UI updates, we obsess over performance so you never break your flow state.
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="group relative p-8 rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 backdrop-blur-sm overflow-hidden hover:bg-[var(--bg-secondary)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--accent-primary)]/5">
                         <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Shield className="h-24 w-24" />
                        </div>
                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-6 text-green-500 border border-[var(--border-primary)] shadow-inner">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Privacy Core</h3>
                            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                                Your intellectual property is yours alone. We employ enterprise-grade RLS (Row Level Security) and encryption to ensure your vault stays private.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Story Section - Minimalist Text */}
        <section className="py-32 bg-[var(--bg-secondary)]">
            <div className="container mx-auto px-6 max-w-4xl text-center">
                 <h2 className="text-3xl font-medium mb-12 text-[var(--text-secondary)]">Our Origins</h2>
                 <p className="text-2xl md:text-4xl font-semibold leading-tight mb-8">
                     "We built Snippets because we were tired of losing our best solutions in slack threads and lost browser bookmarks."
                 </p>
                 <div className="flex items-center justify-center gap-4 text-[var(--text-muted)]">
                     <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px]">
                        <div className="h-full w-full rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                            <Code2 className="h-6 w-6" />
                        </div>
                     </div>
                     <div className="text-left">
                         <div className="font-semibold text-[var(--text-primary)]">The Snippets Team</div>
                         <div className="text-sm">Remote & Asynchronous</div>
                     </div>
                 </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32">
             <div className="container mx-auto px-6">
                 <div className="relative rounded-[32px] overflow-hidden border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 px-6 py-20 text-center sm:px-12 md:py-24">
                     
                     {/* Background Effects */}
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-primary),transparent_60%)] opacity-[0.15] blur-3xl pointer-events-none" />
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
                     
                     <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                         <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)]">
                            Start building your <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">knowledge engine.</span>
                         </h2>
                         <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                             Stop letting your best ideas slip through the cracks. It's time to treat your code snippets like the assets they are.
                         </p>
                         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                             <Link href="/login" className="h-14 px-8 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-lg flex items-center justify-center hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 min-w-[180px]">
                                 Get Started Free
                             </Link>
                             <Link href="/docs" className="h-14 px-8 rounded-full border border-[var(--border-primary)] bg-[var(--bg-primary)]/50 backdrop-blur-sm text-[var(--text-primary)] font-medium text-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors min-w-[180px]">
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
