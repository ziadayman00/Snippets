import { createClient } from "@/lib/supabase/server";
import { StickyNav } from "@/components/landing/sticky-nav";
import { Footer } from "@/components/landing/footer";
import { AboutPageClient } from "./about-client";

export default async function AboutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-zinc-100 selection:bg-purple-500/30">
      <StickyNav isAuthenticated={!!user} />
      <AboutPageClient />
      <Footer />
    </div>
  );
}
