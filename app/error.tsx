"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-primary)] p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-900/10 text-red-500 mb-6">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="mb-2 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
        Something went wrong!
      </h2>
      <p className="mb-8 max-w-[400px] text-[var(--text-muted)]">
        An unexpected error occurred. We've been notified and are looking into it.
      </p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="flex items-center gap-2 rounded-full bg-[var(--text-primary)] px-8 py-3 text-sm font-semibold text-[var(--bg-primary)] transition-opacity hover:opacity-90"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
