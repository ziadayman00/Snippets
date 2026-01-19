"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Link as LinkIcon, ExternalLink } from "lucide-react";
import { getBacklinkContext, type BacklinkWithContext } from "@/lib/actions/links";
import { formatDistanceToNow } from "date-fns";

interface InlineBacklinksProps {
  entryId: string;
}

export function InlineBacklinks({ entryId }: InlineBacklinksProps) {
  const [links, setLinks] = useState<BacklinkWithContext[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const data = await getBacklinkContext(entryId);
        setLinks(data);
      } catch (error) {
        console.error("Failed to fetch backlinks:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (entryId) {
      fetchLinks();
    }
  }, [entryId]);

  if (isLoading) return null;
  if (links.length === 0) return null;

  return (
    <div className="mt-12 border-t border-[var(--border-primary)]/50 pt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-4 group"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        <span className="uppercase tracking-widest text-xs font-bold">Referenced by ({links.length})</span>
        <div className="h-px flex-1 bg-[var(--border-primary)]/50 group-hover:bg-[var(--border-primary)] transition-colors ml-2" />
      </button>

      {isExpanded && (
        <div className="space-y-4 pl-0 sm:pl-6">
          {links.map((link) => (
            <div key={link.id} className="group relative">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--border-primary)] group-hover:bg-[var(--accent-primary)] transition-colors rounded-full -ml-4 hidden sm:block" />
              
              <Link
                href={`/technology/${link.technologyId}/edit/${link.sourceId}`}
                className="block p-3 rounded-lg border border-[var(--border-primary)]/50 bg-[var(--bg-secondary)]/30 hover:bg-[var(--bg-secondary)] hover:border-[var(--border-primary)] transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
                    <span className="font-medium text-sm text-[var(--text-primary)]">
                       {link.sourceTitle}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {link.context ? (
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 italic pl-5 border-l-2 border-[var(--border-primary)]/30">
                    "{link.context}"
                  </p>
                ) : (
                  <p className="text-xs text-[var(--text-muted)] italic pl-5">
                    Mentioned in content
                  </p>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
