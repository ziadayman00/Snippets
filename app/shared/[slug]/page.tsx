import { getPublicSnippet } from "@/lib/actions/sharing";
import { createClient } from "@/lib/supabase/server";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Eye, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const snippet = await getPublicSnippet(slug);

  if (!snippet) {
    return {
      title: 'Snippet Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: `${snippet.title} | Snippets`,
    description: `${snippet.technologyName} snippet - ${snippet.views} views`,
    openGraph: {
      title: snippet.title,
      description: `${snippet.technologyName} code snippet`,
      images: [`${siteUrl}/api/og?slug=${slug}`],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: snippet.title,
      description: `${snippet.technologyName} code snippet`,
      images: [`${siteUrl}/api/og?slug=${slug}`],
    },
  };
}


export default async function PublicSnippetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Get IP address from headers (works with most hosting providers)
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const ipAddress = 
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown';

  // Check if user is authenticated (to exclude owner from view count)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch snippet without incrementing view first
  const snippet = await getPublicSnippet(slug);

  if (!snippet) {
    notFound();
  }

  // Only increment view if:
  // 1. User is not the owner
  // 2. IP address is available
  const isOwner = user?.id === snippet.userId;
  
  if (!isOwner && ipAddress !== 'unknown') {
    // Re-fetch with IP to increment view
    const updatedSnippet = await getPublicSnippet(slug, ipAddress);
    if (updatedSnippet) {
      // Use updated snippet with new view count
      Object.assign(snippet, updatedSnippet);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img 
              src="/logo.svg" 
              alt="Snippets" 
              className="h-6 md:h-8 w-auto"
            />
          </Link>
          <Link 
            href="/login"
            className="px-4 py-2 rounded-md bg-[var(--accent-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Create Your Own
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Meta Info */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
              <Tag className="w-3.5 h-3.5" />
              <span>{snippet.technologyName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>{snippet.views} views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Updated {formatDistanceToNow(new Date(snippet.updatedAt))} ago</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
            {snippet.title}
          </h1>
        </div>

        {/* Editor (Read-only) */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden">
          <TiptapEditor
            content={JSON.stringify(snippet.content)}
            editable={false}
            variant="clean"
          />
        </div>

        {/* Footer CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/10 to-purple-500/10 border border-[var(--accent-primary)]/20 text-center">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Build your own knowledge vault
          </h3>
          <p className="text-[var(--text-muted)] mb-4">
            Organize your code snippets with AI-powered search and connections
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </Link>
        </div>
      </main>
    </div>
  );
}
