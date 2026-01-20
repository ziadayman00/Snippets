"use client";

import { useState, useEffect } from "react";
import { Library, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardView = "snippets" | "plans";

interface ViewSwitcherProps {
  onViewChange: (view: DashboardView) => void;
  initialView?: DashboardView;
}

export function DashboardViewSwitcher({ onViewChange, initialView = "snippets" }: ViewSwitcherProps) {
  const [activeView, setActiveView] = useState<DashboardView>(initialView);

  // Load preference from localStorage on mount
  useEffect(() => {
    const savedView = localStorage.getItem("dashboard-view") as DashboardView | null;
    if (savedView && (savedView === "snippets" || savedView === "plans")) {
      setActiveView(savedView);
      onViewChange(savedView);
    }
  }, [onViewChange]);

  const handleViewChange = (view: DashboardView) => {
    setActiveView(view);
    localStorage.setItem("dashboard-view", view);
    onViewChange(view);
  };

  return (
    <div className="inline-flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
      <button
        onClick={() => handleViewChange("snippets")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
          activeView === "snippets"
            ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
            : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        )}
      >
        <Library className="h-3.5 w-3.5" />
        <span>Snippets</span>
      </button>
      
      <button
        onClick={() => handleViewChange("plans")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
          activeView === "plans"
            ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
            : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        )}
      >
        <StickyNote className="h-3.5 w-3.5" />
        <span>Plans</span>
      </button>
    </div>
  );
}
