import { getPublicCollection } from "@/lib/actions/collection-sharing";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Library } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getPublicCollection(slug);
  
  if (!collection) return {};

  return {
    title: `${collection.title} | Snippets Collection`,
    description: collection.description || "A curated collection of snippets",
    openGraph: {
        images: [`/api/og?type=collection&slug=${slug}`],
    },
    twitter: {
         card: "summary_large_image",
         images: [`/api/og?type=collection&slug=${slug}`],
    },
  };
}

export default async function PublicCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  
  const collection = await getPublicCollection(slug, ip);

  if (!collection) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
       {/* Breadcrumb */}
       <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
                Home
            </Link>
            <span>/</span>
            <span>Collection</span>
        </div>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between gap-6 border-b border-[var(--border-primary)] pb-8">
        <div className="flex gap-5">
            <div className="flex-shrink-0 h-16 w-16 items-center justify-center rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] hidden sm:flex">
                <Library className="h-8 w-8" />
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                    {collection.title}
                </h1>
                <p className="text-[var(--text-secondary)] mt-2 max-w-xl text-lg relative leading-relaxed">
                    {collection.description}
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        {collection.entries.length} items
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        Updated {new Date(collection.updatedAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>

        <div className="flex-shrink-0">
             <Link
                href="/"
                className="flex items-center gap-2 rounded-lg bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] hover:opacity-90 transition-opacity whitespace-nowrap"
            >
                Start Your Own Collection
            </Link>
        </div>
      </header>

      {/* Content List */}
      <div className="space-y-4">
        {collection.entries.map((item: any, index: number) => {
             const isSnippet = item.type === 'snippet';
             const data = item.data;
             const href = isSnippet 
                ? `/shared/${data.slug}` 
                : `/shared/technology/${data.publicSlug}`;
             
             return (
                 <div 
                    key={`${item.type}-${data.id}`}
                    className="group relative flex gap-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 transition-all hover:border-[var(--accent-primary)]/50"
                 >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-mono text-sm">
                        {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <Link href={href} className="block">
                                    <h3 className="font-medium text-[var(--text-primary)] truncate hover:text-[var(--accent-primary)] transition-colors">
                                        {isSnippet ? data.title : data.name}
                                    </h3>
                                </Link>
                                <div className="flex items-center gap-2 mt-1">
                                    {isSnippet ? (
                                        <>
                                            <span className="inline-flex items-center rounded-full bg-[var(--bg-tertiary)] px-2 py-0.5 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-primary)]">
                                                {data.technologyIcon && <span className="mr-1">{data.technologyIcon}</span>}
                                                {data.technologyName}
                                            </span>
                                            <span className="text-xs text-[var(--text-muted)]">
                                                {new Date(data.updatedAt).toLocaleDateString()}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-[var(--bg-tertiary)] px-2 py-0.5 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-primary)]">
                                            {data.icon && <span className="mr-1">{data.icon}</span>}
                                            Technology Stack
                                        </span>
                                    )}
                                </div>
                            </div>
                            <Link 
                                href={href}
                                className="text-xs font-medium text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                            >
                                {isSnippet ? "View Snippet →" : "View Technology →"}
                            </Link>
                        </div>
                    </div>
                 </div>
             );
        })}
        {collection.entries.length === 0 && (
             <div className="text-center py-12 text-[var(--text-muted)]">
                No public entries in this collection yet.
             </div>
        )}
      </div>
    </div>
  );
}
