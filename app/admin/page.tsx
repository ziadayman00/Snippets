import { db } from "@/lib/drizzle/db";
import { entries, technologies, users, resourceViews } from "@/lib/drizzle/schema";
import { sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileCode, Layers, Eye } from "lucide-react";

async function getAdminStats() {
  const [userCount] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
  const [snippetCount] = await db.select({ count: sql<number>`count(*)::int` }).from(entries);
  const [techCount] = await db.select({ count: sql<number>`count(*)::int` }).from(technologies);
  const [viewCount] = await db.select({ count: sql<number>`count(*)::int` }).from(resourceViews);
  
  return {
    users: userCount.count,
    snippets: snippetCount.count,
    technologies: techCount.count,
    views: viewCount.count,
  };
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard Overview</h1>
        <p className="text-[var(--text-secondary)] mt-2">Welcome back, Admin.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-[var(--text-secondary)]">Total Users</h3>
                <Users className="h-4 w-4 text-[var(--text-muted)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.users}</div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
                Registered platform users
            </p>
        </div>

        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-[var(--text-secondary)]">Total Snippets</h3>
                <FileCode className="h-4 w-4 text-[var(--text-muted)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.snippets}</div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
                Across all technologies
            </p>
        </div>

        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-[var(--text-secondary)]">Technologies</h3>
                <Layers className="h-4 w-4 text-[var(--text-muted)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.technologies}</div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
                Active tech categories
            </p>
        </div>

        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-[var(--text-secondary)]">Total Views</h3>
                <Eye className="h-4 w-4 text-[var(--text-muted)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.views}</div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
                Public resource views
            </p>
        </div>
      </div>
    </div>
  );
}
