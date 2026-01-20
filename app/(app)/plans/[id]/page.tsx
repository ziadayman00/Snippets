import { db } from "@/lib/drizzle/db";
import { plans } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { PlanEditor } from "@/components/plans/plan-editor";

export default async function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const plan = await db.query.plans.findFirst({
    where: eq(plans.id, id),
  });

  if (!plan) {
    notFound();
  }

  if (plan.userId !== user.id) {
      return <div>Unauthorized</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <PlanEditor plan={plan} />
    </div>
  );
}
