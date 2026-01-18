"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  async function handleManage() {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Customer Portal
        window.location.href = data.url;
      } else {
        alert("Failed to open billing portal");
        setLoading(false);
      }
    } catch (error) {
      console.error("Portal error:", error);
      alert("Failed to open billing portal");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-2 sm:px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span className="hidden sm:inline">Loading...</span>
        </>
      ) : (
        <>
          <span className="text-[var(--accent-primary)]">★</span>
          <span className="hidden sm:inline">Pro</span>
        </>
      )}
    </button>
  );
}
