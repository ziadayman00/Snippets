import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/drizzle/db";
import { users } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { LayoutDashboard, Users, BarChart3, ShieldAlert } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check Admin Role
  const [dbUser] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!dbUser || dbUser.role !== "admin") {
    // If user is not found in users table or not admin, deny access
    // For first run, you might want to comment this check out or manually insert yourself in DB
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-[var(--border-primary)] bg-[var(--bg-secondary)] flex flex-col">
        <div className="p-6 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-2 text-[var(--accent-primary)]">
            <ShieldAlert className="w-6 h-6" />
            <span className="font-bold text-lg text-[var(--text-primary)]">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--text-secondary)] rounded-md hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </Link>
          <Link 
            href="/admin/users" 
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--text-secondary)] rounded-md hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Users className="w-5 h-5" />
            Users
          </Link>
          <Link 
            href="/admin/analytics" 
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--text-secondary)] rounded-md hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </Link>
        </nav>

        <div className="p-4 border-t border-[var(--border-primary)]">
           <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
             ← Back to App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[var(--bg-primary)]">
        {children}
      </main>
    </div>
  );
}
