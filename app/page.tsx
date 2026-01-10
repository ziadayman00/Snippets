import { createClient } from "@/lib/supabase/server";
import { StickyNav } from "@/components/landing/sticky-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { BentoGrid } from "@/components/landing/bento-grid";
import { SharingShowcase } from "@/components/landing/sharing-showcase";
import { FeatureList } from "@/components/landing/feature-list";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <StickyNav isAuthenticated={!!user} />

      <main className="flex-1">
        <HeroSection isAuthenticated={!!user} />
        <BentoGrid />
        <SharingShowcase />
        <FeatureList />
        <ComparisonSection />
        <FAQSection />
        <CTASection isAuthenticated={!!user} />
      </main>

      <Footer />
    </div>
  );
}
