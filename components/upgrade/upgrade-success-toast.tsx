"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export function UpgradeSuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const showSuccess = searchParams.get("upgrade") === "success";

  useEffect(() => {
    if (showSuccess) {
      // Show success message
      const toast = document.createElement("div");
      toast.className = "fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-500 shadow-lg animate-in fade-in slide-in-from-top-2";
      toast.innerHTML = `
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Welcome to Pro! You now have unlimited access.</span>
      `;
      document.body.appendChild(toast);

      // Remove toast after 5 seconds
      setTimeout(() => {
        toast.classList.add("animate-out", "fade-out", "slide-out-to-top-2");
        setTimeout(() => toast.remove(), 300);
      }, 5000);

      // Clean up URL
      router.replace("/dashboard");
    }
  }, [showSuccess, router]);

  return null;
}
