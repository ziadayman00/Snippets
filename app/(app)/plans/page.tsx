import { db } from "@/lib/drizzle/db";
import { plans } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { PlanList } from "@/components/plans/plan-list";
import { StickyNote } from "lucide-react";

export default async function PlansPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch plans
  const userPlans = await db.query.plans.findMany({
    where: eq(plans.userId, user.id),
    orderBy: [desc(plans.isPinned), desc(plans.updatedAt)],
    with: {
        category: true,
    }
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-3">
           <StickyNote className="h-8 w-8 text-[var(--accent-primary)]" />
           My Plans
        </h1>
        <p className="text-[var(--text-secondary)]">
            A playground for your ideas, tasks, and roadmaps.
        </p>
      </header>

      <PlanList initialPlans={userPlans} />
    </div>
  );
}
