import { createClient } from "@/lib/supabase/server";
import { StickyNav } from "@/components/landing/sticky-nav";
import { Footer } from "@/components/landing/footer";
import { BookOpen } from "lucide-react";
import { DocsContent } from "@/components/docs/docs-content";

export default async function DocsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <StickyNav isAuthenticated={!!user} />

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 px-3 py-1 text-xs font-medium text-[var(--text-secondary)] mb-6">
                    <BookOpen className="h-3 w-3" />
                    <span>Knowledge Base</span>
                </span>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    Documentation
                </h1>
                <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto">
                    Guides, references, and examples to help you build your knowledge vault.
                </p>
            </div>
            
            {/* Interactive Content */}
            <DocsContent />
        </div>
      </main>

      <Footer />
    </div>
  );
}
