"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Sparkles } from "lucide-react";
import Link from "next/link";
import type { LimitType } from "@/lib/limits/constants";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitType: LimitType;
  current: number;
  limit: number;
}

const LIMIT_MESSAGES = {
  snippets: {
    title: "You've reached your snippet limit",
    description: "Upgrade to Pro for unlimited snippets, technologies, and AI queries.",
    label: "Snippets",
  },
  technologies: {
    title: "You've reached your technology limit",
    description: "Upgrade to Pro to organize snippets across unlimited technologies.",
    label: "Technologies",
  },
  aiQueries: {
    title: "You've used all your AI queries this month",
    description: "Upgrade to Pro for unlimited AI-powered search and answers.",
    label: "AI Queries",
  },
};

export function UpgradeModal({
  open,
  onOpenChange,
  limitType,
  current,
  limit,
}: UpgradeModalProps) {
  const message = LIMIT_MESSAGES[limitType];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
          
          {/* Header */}
          <div className="flex flex-col gap-2 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-tertiary)]">
              <Sparkles className="h-6 w-6 text-[var(--text-secondary)]" />
            </div>
            <Dialog.Title className="text-xl font-semibold text-[var(--text-primary)]">
              {message.title}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-[var(--text-secondary)]">
              {message.description}
            </Dialog.Description>
          </div>

          {/* Current Usage */}
          <div className="mt-6 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">{message.label}</span>
              <span className="font-medium text-[var(--text-primary)]">
                {current} / {limit}
              </span>
            </div>
          </div>

          {/* Pro Features */}
          <div className="mt-4 space-y-2 text-sm">
            <p className="font-medium text-[var(--text-primary)]">Pro includes:</p>
            <ul className="space-y-1 text-[var(--text-secondary)]">
              <li className="flex items-center gap-2">
                <span className="text-[var(--accent-primary)]">✓</span>
                Unlimited snippets
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--accent-primary)]">✓</span>
                Unlimited technologies
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--accent-primary)]">✓</span>
                Unlimited AI queries
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--accent-primary)]">✓</span>
                Priority support
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              Cancel
            </button>
            <Link
              href="/pricing"
              className="flex-1 rounded-md bg-[var(--text-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--bg-primary)] hover:opacity-90 transition-opacity text-center"
            >
              Upgrade to Pro
            </Link>
          </div>

          {/* Close button */}
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none text-[var(--text-secondary)]">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
