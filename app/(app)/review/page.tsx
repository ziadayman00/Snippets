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
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <header className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-[var(--accent-primary)]" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Review Mode
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Spaced repetition learning session
          </p>
        </div>
      </header>

      {/* Review Session */}
      <ReviewSession snippets={snippets} />
    </div>
  );
}
