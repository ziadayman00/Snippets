import { Header } from "@/components/dashboard/header";
import { getUserStats } from "@/lib/actions/stats";
import { createClient } from "@/lib/supabase/server";
import { BarChart3, FileText, Layers, Zap } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const stats = await getUserStats();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header email={user.email!} />

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Knowledge Analytics
          </h1>
          <p className="text-[var(--text-secondary)]">
            Track your learning progress and snippet collection
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Snippets"
            value={stats.totalSnippets}
            icon={FileText}
            color="text-blue-500"
            bg="bg-blue-500/10"
          />
          <StatCard
            title="Active Technologies"
            value={stats.totalTechnologies}
            icon={Layers}
            color="text-purple-500"
            bg="bg-purple-500/10"
          />
          <StatCard
            title="Recent Activity"
            value={stats.recentActivity}
            subtitle="last 7 days"
            icon={Zap}
            color="text-amber-500"
            bg="bg-amber-500/10"
          />
          <StatCard
            title="Completion Rate"
            value="--"
            subtitle="Coming soon"
            icon={BarChart3}
            color="text-green-500"
            bg="bg-green-500/10"
          />
        </div>

        {/* Technology Distribution */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
            Technology Distribution
          </h2>
          <div className="space-y-4">
            {stats.techDistribution.map((tech) => (
              <div key={tech.name}>
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <span className="font-medium text-[var(--text-primary)]">
                    {tech.name}
                  </span>
                  <span className="text-[var(--text-muted)]">
                    {tech.count} snippet{tech.count !== 1 ? "s" : ""} ({tech.percentage}%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${tech.percentage}%`,
                      backgroundColor: tech.color || "var(--accent-primary)",
                    }}
                  />
                </div>
              </div>
            ))}
            
            {stats.techDistribution.length === 0 && (
              <div className="text-center py-8 text-[var(--text-muted)]">
                No snippets created yet. Start adding snippets to see your stats!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  bg,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 transition-all hover:border-[var(--accent-primary)]/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            {title}
          </p>
          <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
            {value}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>
        <div className={`rounded-lg p-2 ${bg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
    </div>
  );
}
