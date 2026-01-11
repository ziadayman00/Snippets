import { db } from "@/lib/drizzle/db";
import { entries, technologies } from "@/lib/drizzle/schema";
import { sql, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminAnalyticsPage() {
  // Most viewed technologies
  const topTechs = await db
    .select({
      name: technologies.name,
      views: technologies.views,
      snippetCount: sql<number>`count(${entries.id})::int`
    })
    .from(technologies)
    .leftJoin(entries, sql`${entries.technologyId} = ${technologies.id}`)
    .groupBy(technologies.id, technologies.name, technologies.views)
    .orderBy(desc(technologies.views))
    .limit(5);

  // Most active snippets (by views)
  const topSnippets = await db
    .select({
      title: entries.title,
      views: entries.views,
      techName: technologies.name
    })
    .from(entries)
    .leftJoin(technologies, sql`${entries.technologyId} = ${technologies.id}`)
    .orderBy(desc(entries.views))
    .limit(10);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Analytics</h1>
        <p className="text-[var(--text-secondary)] mt-2">Detailed system performance metrics.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Top Technologies */}
        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)]">Most Viewed Technologies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTechs.map((tech) => (
                <div key={tech.name} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">{tech.name}</div>
                    <div className="text-sm text-[var(--text-muted)]">{tech.snippetCount} snippets</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[var(--text-primary)]">{tech.views}</div>
                    <div className="text-xs text-[var(--text-muted)]">views</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Snippets */}
        <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)]">Top Performing Snippets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSnippets.map((snippet) => (
                <div key={snippet.title} className="flex items-center justify-between">
                  <div className="min-w-0 pr-4">
                    <div className="font-medium text-[var(--text-primary)] truncate">{snippet.title}</div>
                    <div className="text-sm text-[var(--text-muted)]">{snippet.techName}</div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="font-bold text-[var(--text-primary)]">{snippet.views}</div>
                    <div className="text-xs text-[var(--text-muted)]">views</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
