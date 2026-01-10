"use client";

import { useState, useEffect } from "react";
import { Share2, Check, Copy, Globe, Lock } from "lucide-react";
import { togglePublicVisibility } from "@/lib/actions/sharing";
import { toggleTechnologyPublic } from "@/lib/actions/technology-sharing";
import { toggleCollectionPublic } from "@/lib/actions/collection-sharing";
import { toast } from "sonner";

interface ShareButtonProps {
  resourceType: 'snippet' | 'technology' | 'collection';
  resourceId: string;
  isPublic: boolean;
  currentSlug?: string | null;
}

export function ShareButton({ resourceType, resourceId, isPublic: initialIsPublic, currentSlug }: ShareButtonProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [slug, setSlug] = useState(currentSlug);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [publicUrl, setPublicUrl] = useState("");

  useEffect(() => {
    if (slug && typeof window !== 'undefined') {
      const basePath = resourceType === 'snippet' 
        ? '/shared' 
        : `/shared/${resourceType}`;
      setPublicUrl(`${window.location.origin}${basePath}/${slug}`);
    }
  }, [slug, resourceType]);

  const handleToggle = async () => {
    setIsLoading(true);
    
    try {
      let result;
      
      // Call the appropriate action based on resource type
      switch (resourceType) {
        case 'snippet':
          result = await togglePublicVisibility(resourceId, !isPublic);
          break;
        case 'technology':
          result = await toggleTechnologyPublic(resourceId, !isPublic);
          break;
        case 'collection':
          result = await toggleCollectionPublic(resourceId, !isPublic);
          break;
      }

      if (result.success) {
        if (result.isPublic !== undefined) {
          setIsPublic(result.isPublic);
        }
        if (result.slug) {
          setSlug(result.slug);
        }
        toast.success(result.isPublic ? "Now public!" : "Now private");
      } else {
        toast.error(result.error || "Failed to update");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!publicUrl) return;
    
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
          isPublic
            ? "bg-green-500/10 text-green-600 border border-green-500/30 hover:bg-green-500/20"
            : "bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]"
        }`}
      >
        {isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{isPublic ? "Public" : "Private"}</span>
      </button>

      {isPublic && publicUrl && (
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-xs font-medium hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Link"}</span>
        </button>
      )}
    </div>
  );
}
