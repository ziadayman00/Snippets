"use client";

import { useState } from "react";
import { Loader2, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpgradeButtonProps {
  isPro?: boolean;
}

export function UpgradeButton({ isPro }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAction() {
    setLoading(true);
    try {
      if (isPro) {
        // Manage Subscription (Customer Portal)
         const response = await fetch("/api/stripe/portal", {
          method: "POST",
        });
        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
             throw new Error("Failed to load portal");
        }
      } else {
        // Upgrade Checkout
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error("Failed to start checkout");
        }
      }
    } catch (error) {
      console.error("Action error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
        setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAction}
      disabled={loading}
      className={`group flex items-center justify-center gap-2 w-full rounded-full px-6 py-3 font-semibold transition-all ${
        isPro 
            ? "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10" 
            : "bg-white text-black hover:bg-zinc-200"
      }`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPro ? (
        <>
            <Settings className="h-4 w-4" />
            <span>Manage Subscription</span>
        </>
      ) : (
        <>
            <span>Upgrade to Pro</span>
             {/* We can re-add the arrow icon here if we want, or keep it simple */}
        </>
      )}
    </button>
  );
}
