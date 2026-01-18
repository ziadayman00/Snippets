"use client";

import { useState } from "react";
import Link from "next/link";
import type { LimitCheckResult } from "@/lib/limits/constants";

interface UsageProgressProps {
  snippets: LimitCheckResult;
  technologies: LimitCheckResult;
  aiQueries: LimitCheckResult;
}

export function UsageProgress({ snippets, technologies, aiQueries }: UsageProgressProps) {
  const getProgressColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-[var(--accent-primary)]";
  };

  const getProgressPercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const showWarning = (current: number, limit: number) => {
    return current >= limit * 0.8; // Show warning at 80%
  };

  return (
    <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">Usage</h3>
        <Link 
          href="/pricing" 
          className="text-xs text-[var(--text-primary)] hover:underline"
        >
          Upgrade
        </Link>
      </div>

      {/* Snippets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--text-secondary)]">Snippets</span>
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {snippets.current} / {snippets.limit}
          </span>
        </div>
        <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor(
              snippets.current,
              snippets.limit
            )}`}
            style={{ width: `${getProgressPercentage(snippets.current, snippets.limit)}%` }}
          />
        </div>
        {showWarning(snippets.current, snippets.limit) && (
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            You're running out of space.{" "}
            <Link href="/pricing" className="text-[var(--text-primary)] underline">
              Upgrade
            </Link>
          </p>
        )}
      </div>

      {/* Technologies */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--text-secondary)]">Technologies</span>
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {technologies.current} / {technologies.limit}
          </span>
        </div>
        <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor(
              technologies.current,
              technologies.limit
            )}`}
            style={{
              width: `${getProgressPercentage(technologies.current, technologies.limit)}%`,
            }}
          />
        </div>
      </div>

      {/* AI Queries */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            AI Queries (this month)
          </span>
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {aiQueries.current} / {aiQueries.limit}
          </span>
        </div>
        <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor(
              aiQueries.current,
              aiQueries.limit
            )}`}
            style={{ width: `${getProgressPercentage(aiQueries.current, aiQueries.limit)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
