"use client";

import { useState } from "react";
import { Sparkles, Code2, FileCode, Container, Loader2 } from "lucide-react";
import { createSampleSnippets } from "@/lib/actions/onboarding";
import { useRouter } from "next/navigation";

export function EmptyState() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAddSamples() {
    setLoading(true);
    try {
      const result = await createSampleSnippets();
      if (result.success) {
        router.refresh();
      } else {
        alert(result.message || "Failed to create sample snippets");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create sample snippets");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to Snippets! 🎉
        </h1>
        <p className="text-[var(--text-muted)] text-lg">
          Your developer knowledge base starts here
        </p>
      </div>

      {/* Sample Preview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 w-full max-w-2xl">
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 text-center">
          <Code2 className="h-8 w-8 mx-auto mb-2 text-[var(--accent-primary)]" />
          <h3 className="font-medium text-sm mb-1">React Hook</h3>
          <p className="text-xs text-[var(--text-muted)]">useLocalStorage</p>
        </div>
        
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 text-center">
          <FileCode className="h-8 w-8 mx-auto mb-2 text-[var(--accent-primary)]" />
          <h3 className="font-medium text-sm mb-1">Python Script</h3>
          <p className="text-xs text-[var(--text-muted)]">File Upload</p>
        </div>
        
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 text-center">
          <Container className="h-8 w-8 mx-auto mb-2 text-[var(--accent-primary)]" />
          <h3 className="font-medium text-sm mb-1">Docker Build</h3>
          <p className="text-xs text-[var(--text-muted)]">Multi-stage</p>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={handleAddSamples}
          disabled={loading}
          className="flex items-center gap-2 rounded-md bg-[var(--text-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--bg-primary)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Add Sample Snippets
            </>
          )}
        </button>
        
        <button
          onClick={() => {
            // Trigger the quick create dialog
            const createButton = document.querySelector('[data-quick-create]') as HTMLButtonElement;
            createButton?.click();
          }}
          className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          Create First Snippet
        </button>
      </div>

      {/* AI Badge */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Sparkles className="h-4 w-4 text-[var(--accent-primary)]" />
        <span>AI-powered search included</span>
      </div>
    </div>
  );
}
