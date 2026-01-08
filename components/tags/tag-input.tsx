"use client";

import { useState, useRef, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { searchTags } from "@/lib/actions/tags";

interface TagInputProps {
  initialTags?: string[];
  onChange?: (tags: string[]) => void;
  readOnly?: boolean;
}

export function TagInput({ initialTags = [], onChange, readOnly = false }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onChange?.(tags);
  }, [tags, onChange]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // clear debounce
    if (debounceRef.current) {
        clearTimeout(debounceRef.current);
    }

    if (!value.trim()) {
        setSuggestions([]);
        return;
    }

    // New debounce
    debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
            const results = await searchTags(value);
            // filter out already selected
            const filtered = results.filter(r => !tags.includes(r.name));
            setSuggestions(filtered);
        } finally {
            setLoading(false);
        }
    }, 300);
  };

  const addTag = (tagName: string) => {
    const trimmed = tagName.trim();
    if (!trimmed) return;
    
    if (!tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
    }
    setInputValue("");
    setSuggestions([]);
  };

  const removeTag = (tagToRemove: string) => {
    if (readOnly) return;
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
        removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="w-full">
        <div className="flex flex-wrap gap-2 rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 min-h-[42px]">
            {tags.map(tag => {
                const slug = tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                return (
                <span key={tag} className="flex items-center gap-1 rounded bg-[var(--bg-tertiary)] px-2 py-1 text-xs font-medium text-[var(--text-primary)] border border-[var(--border-primary)]">
                    <a href={`/tags/${slug}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {tag}
                    </a>
                    {!readOnly && (
                        <button type="button" onClick={() => removeTag(tag)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </span>
                );
            })}
            
            {!readOnly && (
                 <div className="relative flex-1 min-w-[120px]">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={tags.length === 0 ? "Add tags..." : ""}
                        className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                    />
                    
                    {/* Suggestions Dropdown */}
                    {(suggestions.length > 0 || (loading && inputValue)) && (
                        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-lg">
                            {loading && (
                                <div className="p-2 text-center text-xs text-[var(--text-muted)]">
                                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                </div>
                            )}
                            {suggestions.map(s => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => addTag(s.name)}
                                    className="w-full px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                                >
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    )}
                 </div>
            )}
        </div>
        {/* Hidden input to submit with forms */}
        <input type="hidden" name="tags" value={JSON.stringify(tags)} />
    </div>
  );
}
