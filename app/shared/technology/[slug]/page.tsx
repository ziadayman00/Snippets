import { getPublicTechnology } from "@/lib/actions/technology-sharing";
import { notFound } from "next/navigation";
import { SnippetList } from "@/components/dashboard/snippet-list";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tech = await getPublicTechnology(slug);
  
  if (!tech) return {};

  return {
    title: `${tech.name} Snippets | Snippets`,
    description: `Browse public entries for ${tech.name}`,
    openGraph: {
        images: [`/api/og?type=technology&slug=${slug}`],
    },
    twitter: {
        card: "summary_large_image",
        images: [`/api/og?type=technology&slug=${slug}`],
    },
  };
}

export default async function PublicTechnologyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  
  const tech = await getPublicTechnology(slug, ip);

  if (!tech) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Read-only Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2">
                <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
                    Home
                </Link>
                <span>/</span>
                <span>Technology</span>
            </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {tech.icon && <span className="mr-2">{tech.icon}</span>}
            {tech.name}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 truncate">
            {tech.snippets?.length || 0} public entries • {tech.views} views
          </p>
        </div>

        <Link
            href="/"
            className="flex items-center gap-2 rounded-lg bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
        >
            <PlayCircle className="w-4 h-4" />
            Create Your Own
        </Link>
      </header>

      {/* Entries Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <div className="h-4 w-4 flex items-center justify-center">
            <div className="h-3.5 w-[1px] bg-current opacity-50 rotate-12" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-widest">Public Entries</h2>
        </div>

        <SnippetList 
            entries={tech.snippets || []} 
            technologyId={tech.id} 
            readonly={true}
        />
      </div>
    </div>
  );
}
