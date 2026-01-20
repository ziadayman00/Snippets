"use client";

import { PlanCard } from "./plan-card";
import { CreatePlanDialog } from "./create-plan-dialog";
import { Search } from "lucide-react";
import { useState } from "react";

interface PlanListProps {
  initialPlans: any[]; // Using any for brevity, should use proper type from schema select
}

export function PlanList({ initialPlans }: PlanListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlans = initialPlans.filter(plan => 
    plan.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (plan.description && plan.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Filters & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
           <input 
              type="text"
              placeholder="Search plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-sm outline-none focus:border-[var(--accent-primary)] transition-colors"
           />
        </div>
        <CreatePlanDialog />
      </div>

       {/* Grid */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlans.map(plan => (
                <PlanCard key={plan.id} plan={plan} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center text-[var(--text-muted)] border border-dashed border-[var(--border-primary)] rounded-xl bg-[var(--bg-secondary)]/30">
            <p className="text-lg font-medium mb-1">No plans found</p>
            <p className="text-sm">
                {searchQuery ? "Try searching for something else." : "Get started by creating your first plan."}
            </p>
            {!searchQuery && (
                <div className="mt-4">
                     <CreatePlanDialog />
                </div>
            )}
        </div>
      )}
    </div>
  );
}
