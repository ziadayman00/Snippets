import { createClient } from "@/lib/supabase/server";
import { StickyNav } from "@/components/landing/sticky-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { SocialProof } from "@/components/landing/social-proof";
import { ProductDemo } from "@/components/landing/product-demo";
import { BentoGrid } from "@/components/landing/bento-grid";
import { PricingPreview } from "@/components/landing/pricing-preview";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { SharingShowcase } from "@/components/landing/sharing-showcase";
import { ChaosToClarity } from "@/components/landing/feature-chaos-clarity";
import { ProblemSolution } from "@/components/landing/problem-solution";





export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      <StickyNav isAuthenticated={!!user} />

      <main className="flex-1">
        <HeroSection isAuthenticated={!!user} />
        <SocialProof />
        <ProductDemo />
        <SharingShowcase />
        <ProblemSolution />
        <ChaosToClarity />
        <BentoGrid />
        <PricingPreview />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
