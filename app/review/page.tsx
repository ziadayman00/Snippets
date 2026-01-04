import { Header } from "@/components/dashboard/header";
import { ReviewSession } from "@/components/review/review-session";
import { getReviewSnippets } from "@/lib/actions/review";
import { createClient } from "@/lib/supabase/server";
import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ReviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const snippets = await getReviewSnippets();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header email={user.email} />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl flex items-center gap-2 mb-6 sm:mb-8 text-[var(--accent-primary)] animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Review Mode</span>
        </div>

        <ReviewSession snippets={snippets} />
      </main>
    </div>
  );
}
