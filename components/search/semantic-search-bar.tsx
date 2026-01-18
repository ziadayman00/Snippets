"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Loader2, FileText, Filter, X, Check } from "lucide-react";
import { semanticSearch, keywordSearch } from "@/lib/actions/search";

// ... existing imports
import { getTechnologies } from "@/lib/actions/technology";
import Link from "next/link";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// ... inside component

// Imports were misplaced here. Removing redundant block.

interface SearchResult {
  id: string;
  title: string;
  content: any;
  technologyId: string;
  technologyName: string;
  technologyIcon: string | null;
  similarity?: number;
}

interface Technology {
  id: string;
  name: string;
  icon: string | null;
}

export function SemanticSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Filter state
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [selectedTechId, setSelectedTechId] = useState<string | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch technologies on mount
    getTechnologies().then(setTechnologies);
  }, []);

  const debouncedQuery = useDebounce(query, 300);

  const performSearch = useCallback(async (searchQuery: string, techId?: string) => {
    setIsSearching(true);
    setSelectedIndex(-1);
    
    // Start fast keyword search immediately
    const keywordPromise = keywordSearch(searchQuery, 5, techId);
    
    // Start semantic search
    const semanticPromise = semanticSearch(searchQuery, 7, techId);
    
    try {
      // Show keyword results as soon as they are ready
      const keywordResults = await keywordPromise;
      setResults(keywordResults);
      
      // Then wait for semantic results and update (usually better quality)
      const semanticResults = await semanticPromise;
      if (semanticResults && semanticResults.length > 0) {
          setResults(semanticResults);
      }
    } catch (error) {
      console.error("Search logic failed:", error);
      // Fallback is handled inside actions usually, but ensure we don't clear valid results if just semantic failed
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      performSearch(debouncedQuery, selectedTechId);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery, selectedTechId, performSearch]);

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
          router.push(`/technology/${result.technologyId}/edit/${result.id}?highlight=${encodeURIComponent(query)}`);
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
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
        
        {/* Smart Search Badge */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 flex items-center gap-1.5 group/smart">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[10px] font-semibold text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
            <span>⚡</span>
            <span className="hidden sm:inline">Smart</span>
          </span>
          
          {/* Tooltip */}
          <div className="absolute left-0 top-full mt-2 w-52 p-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-xl opacity-0 invisible group-hover/smart:opacity-100 group-hover/smart:visible transition-all duration-200 z-[100]">
            <p className="text-xs text-[var(--text-muted)] mb-1">Semantic search</p>
            <p className="text-xs text-[var(--text-primary)] font-medium">Finds snippets by meaning, not just keywords</p>
          </div>
        </div>
        
        <input
          type="text"
          placeholder="Search snippets by concept..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] py-2 pl-24 sm:pl-28 pr-20 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] transition-all shadow-sm",
            showFilters && "rounded-b-none border-b-transparent"
          )}
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isSearching && (
            <Loader2 className="h-4 w-4 animate-spin text-[var(--text-muted)] mr-1" />
            )}
            
            <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                    "p-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors",
                    (showFilters || selectedTechId) ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10" : "text-[var(--text-muted)]"
                )}
                title="Filter by Technology"
            >
                <Filter className="h-4 w-4" />
                {selectedTechId && <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--accent-primary)] rounded-full border border-[var(--bg-secondary)]" />}
            </button>
        </div>
      </div>

      {/* Filter Dropdown */}
      {showFilters && (
        <div className="absolute top-full w-full border border-t-0 border-[var(--border-primary)] bg-[var(--bg-secondary)] rounded-b-lg shadow-xl z-[60] p-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <div className="text-xs font-semibold text-[var(--text-muted)] px-2 uppercase tracking-wider">Filter by Technology</div>
            <div className="flex flex-wrap gap-1.5 max-h-[150px] overflow-y-auto p-1 scrollbar-thin">
                <button
                    onClick={() => {
                        setSelectedTechId(undefined);
                        setShowFilters(false);
                        // Trigger search update immediately if query exists
                        if (query) performSearch(debouncedQuery, undefined);
                    }}
                    className={cn(
                        "px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5",
                        !selectedTechId 
                            ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]" 
                            : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] border-transparent hover:border-[var(--border-primary)] hover:text-[var(--text-primary)]"
                    )}
                >
                    {!selectedTechId && <Check className="w-3 h-3" />}
                    All
                </button>
                
                {technologies.map(tech => (
                    <button
                        key={tech.id}
                        onClick={() => {
                            const newId = selectedTechId === tech.id ? undefined : tech.id;
                            setSelectedTechId(newId);
                            setShowFilters(false);
                            if (query) performSearch(debouncedQuery, newId);
                        }}
                        className={cn(
                            "px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5",
                            selectedTechId === tech.id 
                                ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]" 
                                : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] border-transparent hover:border-[var(--border-primary)] hover:text-[var(--text-primary)]"
                        )}
                    >
                        {selectedTechId === tech.id && <Check className="w-3 h-3" />}
                        {tech.icon && <span className="mr-0.5">{tech.icon}</span>}
                        {tech.name}
                    </button>
                ))}
            </div>
        </div>
      )}

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && !showFilters && (
        <div className="absolute top-full mt-2 w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-xl z-50">
          <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
            {results.map((result, index) => (
              <Link
                key={result.id}
                href={`/technology/${result.technologyId}/edit/${result.id}?highlight=${encodeURIComponent(query)}`}
                onClick={() => {
                  setIsOpen(false);
                  setQuery("");
                }}
                className={cn(
                  "block rounded-md p-3 transition-colors group",
                  index === selectedIndex ? "bg-[var(--bg-tertiary)] border border-[var(--accent-primary)]/30" : "hover:bg-[var(--bg-tertiary)] border border-transparent"
                )}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--bg-tertiary)] text-xs border border-[var(--border-primary)] group-hover:border-[var(--accent-primary)]/30 transition-colors">
                    {result.technologyIcon || result.technologyName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                      {result.title}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-2">
                      <span>{result.technologyName}</span>
                      {result.similarity && (
                        <span className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-medium",
                            result.similarity > 0.6 ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                        )}>
                          {Math.round(result.similarity * 100)}% match
                        </span>
                      )}
                    </div>
                  </div>
                  <FileText className="h-4 w-4 text-[var(--text-muted)] shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
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
      {isOpen && !isSearching && query && results.length === 0 && !showFilters && (
        <div className="absolute top-full mt-2 w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-xl z-50 p-4 text-center">
          <p className="text-sm text-[var(--text-muted)]">No snippets found</p>
        </div>
      )}
    </div>
  );
}
