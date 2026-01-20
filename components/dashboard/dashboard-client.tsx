"use client";

import { useState } from "react";
import { DashboardViewSwitcher } from "./view-switcher";
import { PlanList } from "@/components/plans/plan-list";

type DashboardView = "snippets" | "plans";

interface DashboardClientProps {
  snippetsView: React.ReactNode;
  plansData: any[];
}

export function DashboardClient({ snippetsView, plansData }: DashboardClientProps) {
  const [currentView, setCurrentView] = useState<DashboardView>("snippets");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Header with View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
          Dashboard
        </h1>
        
        <DashboardViewSwitcher 
          onViewChange={setCurrentView}
          initialView={currentView}
        />
      </div>

      {/* Content */}
      {currentView === "snippets" ? (
        snippetsView
      ) : (
        <div className="space-y-6">
          <p className="text-[var(--text-secondary)]">
            A playground for your ideas, tasks, and roadmaps.
          </p>
          <PlanList initialPlans={plansData} />
        </div>
      )}
    </div>
  );
}
