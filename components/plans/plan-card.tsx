"use client";

import Link from "next/link";
import { MoreHorizontal, Pin, Trash2, Calendar } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { deletePlan, updatePlan } from "@/lib/actions/plans";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface PlanCardProps {
    plan: {
        id: string;
        title: string;
        content: any;
        updatedAt: Date;
        isPinned: boolean;
        category?: {
            name: string;
            color: string;
        } | null;
    };
}

export function PlanCard({ plan }: PlanCardProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this plan?")) return;

        setIsDeleting(true);
        const result = await deletePlan(plan.id);
        setIsDeleting(false);

        if (result.success) {
            toast.success("Plan deleted");
            router.refresh();
        } else {
            toast.error("Failed to delete plan");
        }
    };

    const handlePin = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const result = await updatePlan(plan.id, { isPinned: !plan.isPinned });
        if (result.success) {
            router.refresh();
             toast.success(plan.isPinned ? "Plan unpinned" : "Plan pinned");
        }
    };

    // Extract text preview from Tiptap JSON
    const previewText = useMemo(() => {
        if (!plan.content) return "No content";
        try {
            // Simple DFS to find first text node
            let text = "";
            const traverse = (node: any) => {
                 if (text.length > 100) return;
                 if (node.type === 'text' && node.text) {
                     text += node.text + " ";
                 }
                 if (node.content && Array.isArray(node.content)) {
                     node.content.forEach(traverse);
                 }
            };
            traverse(plan.content);
            return text.trim() || "Empty plan";
        } catch (e) {
            return "Error parsing preview";
        }
    }, [plan.content]);

    const colorClass = plan.category?.color || "default";
    
    // Explicit color mapping for Tailwind
    const getColorClasses = () => {
        switch (colorClass) {
            case "slate":
                return {
                    bg: "bg-slate-500/[0.08]",
                    hover: "hover:bg-slate-500/[0.12]",
                    gradient: "from-slate-500/[0.08]",
                    tag: "bg-slate-500/10 text-slate-700 border border-slate-500/20"
                };
            case "blue":
                return {
                    bg: "bg-blue-500/[0.08]",
                    hover: "hover:bg-blue-500/[0.12]",
                    gradient: "from-blue-500/[0.08]",
                    tag: "bg-blue-500/10 text-blue-700 border border-blue-500/20"
                };
            case "emerald":
                return {
                    bg: "bg-emerald-500/[0.08]",
                    hover: "hover:bg-emerald-500/[0.12]",
                    gradient: "from-emerald-500/[0.08]",
                    tag: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                };
            case "amber":
                return {
                    bg: "bg-amber-500/[0.08]",
                    hover: "hover:bg-amber-500/[0.12]",
                    gradient: "from-amber-500/[0.08]",
                    tag: "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                };
            case "rose":
                return {
                    bg: "bg-rose-500/[0.08]",
                    hover: "hover:bg-rose-500/[0.12]",
                    gradient: "from-rose-500/[0.08]",
                    tag: "bg-rose-500/10 text-rose-700 border border-rose-500/20"
                };
            case "violet":
                return {
                    bg: "bg-violet-500/[0.08]",
                    hover: "hover:bg-violet-500/[0.12]",
                    gradient: "from-violet-500/[0.08]",
                    tag: "bg-violet-500/10 text-violet-700 border border-violet-500/20"
                };
            default:
                return {
                    bg: "bg-[var(--bg-secondary)]/60",
                    hover: "hover:bg-[var(--bg-secondary)]/80",
                    gradient: "from-[var(--bg-secondary)]/60",
                    tag: "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)]"
                };
        }
    };

    const colors = getColorClasses();

    return (
        <Link 
            href={`/plans/${plan.id}`}
            className={cn(
                "group relative flex flex-col gap-4 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-[220px] border border-[var(--border-primary)]",
                colors.bg,
                colors.hover
            )}
        >
             {/* Pin Indicator */}
             {plan.isPinned && (
                <div className="absolute top-3 right-3 text-[var(--accent-primary)]">
                    <Pin className="h-4 w-4 fill-current rotate-45" />
                </div>
            )}

            <div className="flex flex-col gap-2 shrink-0">
                <h3 className="font-bold text-xl text-[var(--text-primary)] leading-tight line-clamp-2 pr-8">
                    {plan.title}
                </h3>
                
                {/* Category Tag */}
                {plan.category && (
                    <div className={cn("text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-md w-fit", colors.tag)}>
                        {plan.category.name}
                    </div>
                )}
            </div>

            {/* Description Preview */}
             <div className="flex-1 text-sm text-[var(--text-secondary)] overflow-hidden relative">
                <p className="line-clamp-4 leading-relaxed">
                   {previewText}
                </p>
            </div>

             {/* Footer: Date */}
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-auto shrink-0">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDistanceToNow(new Date(plan.updatedAt), { addSuffix: true })}</span>
            </div>

            {/* Actions Menu */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
                 <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-black/5 text-[var(--text-secondary)] transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content align="end" className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] p-1 shadow-md animate-in fade-in-80 zoom-in-95">
                            <DropdownMenu.Item onClick={handlePin} className="flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                                <Pin className="h-4 w-4 mr-2" />
                                {plan.isPinned ? "Unpin" : "Pin"}
                            </DropdownMenu.Item>
                             <DropdownMenu.Separator className="my-1 h-px bg-[var(--border-primary)]" />
                            <DropdownMenu.Item onClick={handleDelete} className="flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-red-500/10 text-red-500">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>
        </Link>
    );
}
