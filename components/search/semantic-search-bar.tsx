"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Loader2, FileText } from "lucide-react";
import { semanticSearch } from "@/lib/actions/search";
import Link from "next/link";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  content: any;
  technologyId: string;
  technologyName: string;
  technologyIcon: string | null;
  similarity?: number;
}

export function SemanticSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  const performSearch = useCallback(async (searchQuery: string) => {
    setIsSearching(true);
    setSelectedIndex(-1);
    try {
      const searchResults = await semanticSearch(searchQuery, 7);
      setResults(searchResults);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      performSearch(debouncedQuery);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery, performSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          const result = results[selectedIndex];
          router.push(`/technology/${result.technologyId}/edit/${result.id}`);
          setIsOpen(false);
          setQuery("");
          setSelectedIndex(-1);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md" ref={menuRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search snippets by concept... (BETA)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] py-2 pl-10 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[var(--text-muted)]" />
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-xl z-50">
          <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
            {results.map((result, index) => (
              <Link
                key={result.id}
                href={`/technology/${result.technologyId}/edit/${result.id}`}
                onClick={() => {
                  setIsOpen(false);
                  setQuery("");
                }}
                className={`block rounded-md p-3 transition-colors ${
                  index === selectedIndex ? "bg-[var(--bg-tertiary)] border border-[var(--accent-primary)]/30" : "hover:bg-[var(--bg-tertiary)]"
                }`}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--bg-tertiary)] text-xs">
                    {result.technologyIcon || result.technologyName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-[var(--text-primary)] truncate">
                      {result.title}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">
                      {result.technologyName}
                      {result.similarity && (
                        <span className="ml-2 text-[var(--accent-primary)]">
                          {Math.round(result.similarity * 100)}% match
                        </span>
                      )}
                    </div>
                  </div>
                  <FileText className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
                </div>
              </Link>
            ))}
          </div>
          <div className="border-t border-[var(--border-primary)] p-2 text-center bg-[var(--bg-secondary)]/50 backdrop-blur-sm rounded-b-lg sticky bottom-0">
            <span className="text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
               <span className="hidden sm:inline">Use</span> <kbd className="font-sans px-1 rounded bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">↑</kbd> <kbd className="font-sans px-1 rounded bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">↓</kbd> <span className="hidden sm:inline">to navigate</span> <kbd className="font-sans px-1 rounded bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">↵</kbd>
            </span>
          </div>
        </div>
      )}

      {/* No results */}
      {isOpen && !isSearching && query && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-xl z-50 p-4 text-center">
          <p className="text-sm text-[var(--text-muted)]">No snippets found</p>
        </div>
      )}
    </div>
  );
}
