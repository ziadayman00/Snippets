"use client";

import { LogOut, Plus, Code2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CreateTechDialog } from "./create-tech-dialog";
import Link from "next/link";

export function Header({ email }: { email?: string }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
            <Code2 className="h-6 w-6" />
            <span>Snippets</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center gap-2 rounded-md bg-[var(--text-primary)] px-3 py-1.5 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              <span>New Technology</span>
            </button>

            {email && (
              <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                <span className="hidden sm:inline-block">{email}</span>
                <button
                  onClick={handleSignOut}
                  className="rounded-md p-2 hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <CreateTechDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
}
