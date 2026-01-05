"use client";

import { useState } from "react";
import { createSampleData } from "@/lib/actions/onboarding";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function OnboardingCard() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateSample = async () => {
    setIsLoading(true);
    try {
      await createSampleData();
      router.refresh();
    } catch (error) {
      console.error("Failed to create sample data", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-4 rounded-full bg-[var(--accent-primary)]/10 p-4">
        <Sparkles className="h-8 w-8 text-[var(--accent-primary)]" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-[var(--text-primary)]">
        Welcome to Snippets!
      </h3>
      <p className="mb-6 max-w-md text-[var(--text-muted)]">
        It looks like you're new here. Would you like to add some sample snippets to see how everything works?
      </p>
      
      <div className="flex gap-4">
        <button
          onClick={handleCreateSample}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-md bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add Sample Data
        </button>
      </div>
      <p className="mt-4 text-xs text-[var(--text-muted)]">
        Includes JavaScript, CSS, and Git examples
      </p>
    </div>
  );
}
