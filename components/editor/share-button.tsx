"use client";

import { useState, useEffect } from "react";
import { Share2, Check, Copy, Globe, Lock } from "lucide-react";
import { togglePublicVisibility } from "@/lib/actions/sharing";
import { toast } from "sonner";

interface ShareButtonProps {
  entryId: string;
  isPublic: boolean;
  currentSlug?: string | null;
}

export function ShareButton({ entryId, isPublic: initialIsPublic, currentSlug }: ShareButtonProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [slug, setSlug] = useState(currentSlug);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [publicUrl, setPublicUrl] = useState("");

  useEffect(() => {
    if (slug && typeof window !== 'undefined') {
      setPublicUrl(`${window.location.origin}/shared/${slug}`);
    }
  }, [slug]);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const result = await togglePublicVisibility(entryId, !isPublic);
      setIsPublic(!isPublic);
      if (result.slug) {
        setSlug(result.slug);
      }
      toast.success(isPublic ? "Snippet is now private" : "Snippet is now public");
    } catch (error) {
      toast.error("Failed to update visibility");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!publicUrl) return;
    
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isPublic && slug && (
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          title="Copy public link"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Copy Link</span>
            </>
          )}
        </button>
      )}
      
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
          isPublic
            ? "bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/20"
            : "bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
        }`}
      >
        {isPublic ? (
          <>
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Public</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Private</span>
          </>
        )}
      </button>
    </div>
  );
}
