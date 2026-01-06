import { createClient } from "@/lib/supabase/server";
import { StickyNav } from "@/components/landing/sticky-nav";
import { Footer } from "@/components/landing/footer";
import { Code2, Database, Globe, Heart, Shield, Users, Zap } from "lucide-react";
import Image from "next/image";

export default async function AboutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <StickyNav isAuthenticated={!!user} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.1),transparent_70%)] pointer-events-none" />
             <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 px-3 py-1 text-xs font-medium text-[var(--text-secondary)] mb-8">
                    <Heart className="h-3 w-3 text-red-500 fill-red-500/20" />
                    <span>Built for Developers by Developers</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-[var(--text-primary)] to-[var(--text-muted)] p-2">
                    Code connects us.
                </h1>
                <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
                    We believe knowledge shouldn't be trapped in isolated snippets. 
                    It should be a living, breathing network that grows with you.
                </p>
             </div>
        </section>

        {/* Mission Grid */}
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="group rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-8 hover:bg-[var(--bg-secondary)]/50 transition-colors">
                        <div className="h-12 w-12 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center mb-6 text-[var(--text-primary)] group-hover:scale-110 transition-transform">
                            <Database className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">No More Silos</h3>
                        <p className="text-[var(--text-muted)] leading-relaxed">
                            Most note apps treat snippets as dead text. We treat them as nodes in a graph, 
                            automatically linking related concepts so you never lose context.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="group rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-8 hover:bg-[var(--bg-secondary)]/50 transition-colors">
                        <div className="h-12 w-12 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center mb-6 text-[var(--text-primary)] group-hover:scale-110 transition-transform">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Flow State First</h3>
                        <p className="text-[var(--text-muted)] leading-relaxed">
                            Friction kills creativity. Every interaction in Snippets, from Quick Create to 
                            keyboard shortcuts, is designed to keep you in the zone.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="group rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-8 hover:bg-[var(--bg-secondary)]/50 transition-colors">
                        <div className="h-12 w-12 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center mb-6 text-[var(--text-primary)] group-hover:scale-110 transition-transform">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Your Data, Your Rules</h3>
                        <p className="text-[var(--text-muted)] leading-relaxed">
                            We don't train AI on your private code without permission. Your vault is your 
                            sanctuary, encrypted and secure.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Team / Story Section */}
        <section className="py-20 border-t border-[var(--border-primary)]/50">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold mb-6">The Story</h2>
                        <p className="text-[var(--text-muted)] mb-6 text-lg leading-relaxed">
                            Snippets started as a weekend project to solve a personal frustration: 
                            "Where did I put that regex for email validation?"
                        </p>
                        <p className="text-[var(--text-muted)] text-lg leading-relaxed">
                            What began as a simple clipboard manager has evolved into a comprehensive 
                            knowledge management system used by thousands of developers to write better code, faster.
                        </p>
                    </div>
                     <div className="flex-1 relative">
                        {/* Placeholder for optional team image or graphic */}
                        <div className="aspect-video rounded-2xl bg-gradient-to-tr from-[var(--bg-tertiary)] to-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center relative overflow-hidden group">
                           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-repeat" />
                           <Code2 className="h-20 w-20 text-[var(--border-primary)]/50 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Global Impact */}
         <section className="py-20 border-t border-[var(--border-primary)]/50 bg-[var(--bg-secondary)]/20">
            <div className="container mx-auto px-6 text-center">
                 <h2 className="text-3xl font-bold mb-12">Global Impact</h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                     <div>
                         <div className="text-4xl font-bold text-[var(--accent-primary)] mb-2">10k+</div>
                         <div className="text-sm text-[var(--text-muted)] uppercase tracking-wider">Users</div>
                     </div>
                     <div>
                         <div className="text-4xl font-bold text-[var(--accent-primary)] mb-2">5M+</div>
                         <div className="text-sm text-[var(--text-muted)] uppercase tracking-wider">Snippets Saved</div>
                     </div>
                      <div>
                         <div className="text-4xl font-bold text-[var(--accent-primary)] mb-2">99.9%</div>
                         <div className="text-sm text-[var(--text-muted)] uppercase tracking-wider">Uptime</div>
                     </div>
                      <div>
                         <div className="text-4xl font-bold text-[var(--accent-primary)] mb-2">24/7</div>
                         <div className="text-sm text-[var(--text-muted)] uppercase tracking-wider">Support</div>
                     </div>
                 </div>
            </div>
         </section>

      </main>

      <Footer />
    </div>
  );
}
