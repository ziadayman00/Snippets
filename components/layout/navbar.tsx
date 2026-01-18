"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Sparkles } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { CreateTechDialog } from "@/components/dashboard/create-tech-dialog";
import { ManageSubscriptionButton } from "@/components/upgrade/manage-subscription-button";

interface NavbarProps {
  user: User;
  userRole?: string;
  onSignOut: () => Promise<void>;
  breadcrumbs?: { label: string; href?: string }[];
}

export function Navbar({ user, userRole, onSignOut, breadcrumbs }: NavbarProps) {
  const [createTechOpen, setCreateTechOpen] = useState(false);
  const pathname = usePathname();
  const isFreeUser = !userRole || userRole === "user";

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
        <div className="flex h-12 items-center justify-between px-4">
          {/* Left: Icon / Email / Dynamic Breadcrumbs */}
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-x-auto scrollbar-hide">
            <Link href="/dashboard" className="flex items-center hover:opacity-80 transition-opacity shrink-0">
              <Image
                src="/icon.svg"
                alt="Snippets"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </Link>
            <span className="text-[var(--text-muted)] shrink-0">/</span>
            {/* Hide email on mobile, show on sm+ */}
            <span className="hidden sm:inline text-xs text-[var(--text-muted)] truncate">{user.email}</span>
            
            {/* Dynamic breadcrumbs */}
            {breadcrumbs && breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2 shrink-0">
                <span className="text-[var(--text-muted)]">/</span>
                {crumb.href ? (
                  <Link href={crumb.href} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors truncate max-w-[120px] sm:max-w-[200px]">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-xs text-[var(--text-primary)] truncate max-w-[120px] sm:max-w-[200px]">{crumb.label}</span>
                )}
              </div>
            ))}
          </div>

          {/* Right: Create + Upgrade (free only) / Pro badge + Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setCreateTechOpen(true)}
              className="flex items-center gap-1.5 rounded-md bg-[var(--text-primary)] px-2 sm:px-3 py-1.5 text-xs font-medium text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Create</span>
            </button>
            
            {/* Show Upgrade button for free users, Pro badge for Pro users */}
            {isFreeUser ? (
              <Link
                href="/pricing"
                className="flex items-center gap-1.5 rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-2 sm:px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Upgrade</span>
              </Link>
            ) : (
              <ManageSubscriptionButton />
            )}
            
            <button
              onClick={onSignOut}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors hidden sm:inline"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <CreateTechDialog open={createTechOpen} onOpenChange={setCreateTechOpen} />
    </>
  );
}
