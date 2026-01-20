"use client";

import { useState, useEffect } from "react";
import { Check, Plus, Tag, Circle } from "lucide-react";
import { createCategory, getCategories } from "@/lib/actions/plans";
import * as Popover from "@radix-ui/react-popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Category {
    id: string;
    name: string;
    color: string;
}

interface CategorySelectorProps {
    selectedCategoryId?: string | null;
    onSelect: (categoryId: string) => void;
}

const COLORS = [
    { value: "slate", label: "Gray", bg: "bg-slate-500" },
    { value: "blue", label: "Blue", bg: "bg-blue-500" },
    { value: "emerald", label: "Green", bg: "bg-emerald-500" },
    { value: "amber", label: "Orange", bg: "bg-amber-500" },
    { value: "rose", label: "Red", bg: "bg-rose-500" },
    { value: "violet", label: "Purple", bg: "bg-violet-500" },
];

export function CategorySelector({ selectedCategoryId, onSelect }: CategorySelectorProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    
    // New category state
    const [isCreating, setIsCreating] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryColor, setNewCategoryColor] = useState("slate");

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const res = await getCategories();
        if (res) setCategories(res);
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName) return;

        const res = await createCategory(newCategoryName, newCategoryColor);
        if (res.success && res.data) {
            setCategories([...categories, res.data]);
            onSelect(res.data.id);
            setNewCategoryName("");
            setIsCreating(false);
            setIsOpen(false);
            toast.success("Category created");
        } else {
            toast.error("Failed to create category");
        }
    };

    const activeCategory = categories.find(c => c.id === selectedCategoryId);

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <button className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors w-full p-2 rounded-md hover:bg-[var(--bg-secondary)] text-left">
                    <Tag className="h-4 w-4 shrink-0" />
                    {activeCategory ? (
                        <div className="flex items-center gap-2">
                            <span className={cn("w-2 h-2 rounded-full", `bg-${activeCategory.color}-500`)} />
                            <span>{activeCategory.name}</span>
                        </div>
                    ) : "Select Category"}
                </button>
            </Popover.Trigger>
            <Popover.Content align="start" className="z-50 w-64 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 shadow-xl animate-in fade-in-80 zoom-in-95" sideOffset={8}>
                
                {!isCreating ? (
                    <>
                        {/* List */}
                        <div className="max-h-[200px] overflow-y-auto space-y-1 mb-2">
                             {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        onSelect(category.id);
                                        setIsOpen(false);
                                    }}
                                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-[var(--bg-secondary)]"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-2 w-2 rounded-full", `bg-${category.color}-500`)} />
                                        <span className="text-[var(--text-primary)]">{category.name}</span>
                                    </div>
                                    {category.id === selectedCategoryId && <Check className="h-3 w-3 text-[var(--accent-primary)]" />}
                                </button>
                             ))}
                             {categories.length === 0 && (
                                 <p className="text-xs text-[var(--text-muted)] p-2 text-center text-balance">
                                     No categories yet. Create one to organize your plans.
                                 </p>
                             )}
                        </div>

                        <div className="h-px bg-[var(--border-primary)]/50 my-1" />

                        <button 
                            onClick={() => setIsCreating(true)}
                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                        >
                            <Plus className="h-3 w-3" />
                            Create Category
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleCreateCategory} className="space-y-3 p-1">
                        <input
                            autoFocus
                            placeholder="Category Name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-md px-2 py-1 text-sm outline-none focus:border-[var(--accent-primary)]"
                        />
                        
                        <div className="flex gap-1.5 flex-wrap">
                            {COLORS.map(color => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setNewCategoryColor(color.value)}
                                    className={cn(
                                        "w-5 h-5 rounded-full transition-all hover:scale-110",
                                        color.bg,
                                        newCategoryColor === color.value ? "ring-2 ring-[var(--text-primary)] ring-offset-2 ring-offset-[var(--bg-primary)]" : "opacity-70 hover:opacity-100"
                                    )}
                                    title={color.label}
                                />
                            ))}
                        </div>

                        <div className="flex gap-2 pt-2">
                             <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="flex-1 rounded-md bg-[var(--bg-secondary)] px-2 py-1 text-xs font-medium hover:bg-[var(--bg-tertiary)]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!newCategoryName}
                                className="flex-1 rounded-md bg-[var(--accent-primary)] px-2 py-1 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                )}
            </Popover.Content>
        </Popover.Root>
    );
}
