"use client";

import Link from "next/link";
import { Sparkles, MessageSquare, Code2, HelpCircle } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  {
    icon: Code2,
    question: "How do React hooks work?",
    category: "React",
  },
  {
    icon: MessageSquare,
    question: "Best practices for API error handling",
    category: "Patterns",
  },
  {
    icon: HelpCircle,
    question: "Explain Docker multi-stage builds",
    category: "Docker",
  },
];

export function AISuggestions() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-[var(--accent-primary)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Try AI Search
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SUGGESTED_QUESTIONS.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={`/ask?q=${encodeURIComponent(item.question)}`}
              className="group relative rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 hover:border-[var(--accent-primary)]/50 hover:bg-[var(--bg-tertiary)] transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] group-hover:bg-[var(--accent-primary)]/20 transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--text-muted)] mb-1">
                    {item.category}
                  </p>
                  <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                    {item.question}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      <p className="text-xs text-[var(--text-muted)] mt-3 text-center">
        Ask anything about your code snippets
      </p>
    </div>
  );
}
