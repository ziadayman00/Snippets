"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Save, Loader2, Calendar, AlertCircle, Trash2, Pin, MoreVertical, PanelRightClose, PanelRight } from "lucide-react";
import { updatePlan, deletePlan, savePlanContent } from "@/lib/actions/plans";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { formatDistanceToNow } from "date-fns";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CategorySelector } from "./category-selector";

interface PlanEditorProps {
    plan: {
        id: string;
        title: string;
        content: any;
        updatedAt: Date;
        createdAt: Date;
        isPinned: boolean;
        categoryId: string | null;
    }
}

export function PlanEditor({ plan }: PlanEditorProps) {
    const router = useRouter();
    const [title, setTitle] = useState(plan.title);
    const [content, setContent] = useState(plan.content);
    const [categoryId, setCategoryId] = useState(plan.categoryId);
    const [isSaving, setIsSaving] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isPinned, setIsPinned] = useState(plan.isPinned);

    // Derived Dirty State
    const isDirty = title !== plan.title || 
                    JSON.stringify(content) !== JSON.stringify(plan.content);

    // Auto-save logic
    useEffect(() => {
        if (!isDirty) return;

        const timeout = setTimeout(async () => {
             setIsSaving(true);
             await savePlanContent(plan.id, content);
             // Also update title if changed
             if (title !== plan.title) {
                 await updatePlan(plan.id, { title });
             }
             setIsSaving(false);
             router.refresh(); 
        }, 2000); // 2s debounce

        return () => clearTimeout(timeout);
    }, [content, title, plan.id, plan.title, plan.content, isDirty, router]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleContentChange = useCallback((json: string) => {
        try {
            setContent(JSON.parse(json));
        } catch (e) {
            console.error("Failed to parse content JSON", e);
        }
    }, []);

    const handleCategorySelect = async (newCategoryId: string) => {
        setCategoryId(newCategoryId);
        await updatePlan(plan.id, { categoryId: newCategoryId });
        router.refresh(); 
        toast.success("Category updated");
    };

    const handleManualSave = async () => {
        setIsSaving(true);
        await savePlanContent(plan.id, content);
        if (title !== plan.title) {
            await updatePlan(plan.id, { title });
        }
        setIsSaving(false);
        router.refresh(); 
        toast.success("Saved");
    };

    const handleDeletePlan = async () => {
        if (!confirm("Delete this entire plan?")) return;
        const res = await deletePlan(plan.id);
        if (res.success) {
            router.push("/plans");
            toast.success("Plan deleted");
        }
    };

    const handleTogglePin = async () => {
        const newPinState = !isPinned;
        setIsPinned(newPinState);
        await updatePlan(plan.id, { isPinned: newPinState });
        toast.success(newPinState ? "Plan pinned" : "Plan unpinned");
        router.refresh();
    };

    return (
        <div className="flex flex-col h-screen bg-[var(--bg-primary)]">
             {/* Header */}
            <header className="shrink-0 flex items-center justify-between gap-4 px-6 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/95 sticky top-0 z-20 backdrop-blur">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Link
                        href="/plans"
                        className="group flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] transition-colors hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    </Link>
                    <div className="h-4 w-px bg-[var(--border-primary)] mx-2" />
                    <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                         <Link href="/plans" className="hover:underline hover:text-[var(--text-primary)] transition-colors">
                            Plans
                        </Link>
                        <span>/</span>
                        <span>Edit</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                     {/* Unsaved Indicator */}
                     {isDirty && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500 animate-in fade-in">
                            <AlertCircle className="h-3 w-3" />
                            <span className="hidden sm:inline">Unsaved Changes</span>
                        </div>
                    )}

                    <div className="h-4 w-px bg-[var(--border-primary)] mx-2 hidden sm:block" />

                    {/* Sidebar Toggle */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-md hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
                        title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        {isSidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
                    </button>

                    <button
                        onClick={handleManualSave}
                        disabled={isSaving}
                        className={`flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-all active:scale-95 disabled:opacity-50
                            ${isDirty 
                                ? "bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90" 
                                : "bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-primary)]"
                            }
                        `}
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4" />}
                        <span>Save</span>
                    </button>
                    
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="p-2 rounded-md hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors">
                                <MoreVertical className="h-5 w-5" />
                            </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content align="end" className="z-50 min-w-[10rem] overflow-hidden rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] p-1 shadow-md animate-in fade-in-80 zoom-in-95">
                                 <DropdownMenu.Item onClick={handleTogglePin} className="flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                                    <Pin className="h-4 w-4 mr-2" />
                                    {isPinned ? "Unpin Plan" : "Pin Plan"}
                                </DropdownMenu.Item>
                                <DropdownMenu.Separator className="my-1 h-px bg-[var(--border-primary)]" />
                                <DropdownMenu.Item onClick={handleDeletePlan} className="flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-red-500/10 text-red-500">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Plan
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 min-h-0 lg:flex-row relative group/wrapper overflow-hidden">
                {/* Editor Column */}
                <div className="flex flex-1 flex-col transition-all duration-300 min-w-0 lg:overflow-y-auto">
                     <div className="p-6 pb-0 flex flex-col gap-6 max-w-5xl mx-auto w-full">
                         {/* Title Input */}
                        <div>
                            <input
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                placeholder="Untitled Plan"
                                className="w-full bg-transparent text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none border-b border-transparent focus:border-[var(--border-primary)] pb-2 transition-colors"
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="flex-1 min-h-[500px] p-6 max-w-5xl mx-auto w-full flex flex-col pt-4">
                        <TiptapEditor 
                            content={typeof content === 'string' ? content : JSON.stringify(content)} 
                            className="flex-1 font-medium"
                            onChange={handleContentChange}
                            onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                            isSidebarOpen={isSidebarOpen}
                            variant="clean"
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div 
                    className={`flex-col gap-6 lg:border-l border-t lg:border-t-0 border-[var(--border-primary)] pt-8 lg:pt-0 lg:overflow-y-auto shrink-0 pb-10 font-sans transition-all duration-300 bg-[var(--bg-primary)] ${
                        isSidebarOpen 
                            ? "w-full lg:w-80 lg:pl-6 lg:pr-2 opacity-100" 
                            : "w-0 lg:w-0 lg:pl-0 lg:pr-0 overflow-hidden opacity-0"
                    }`}
                >
                     {/* Metadata */}
                     <div className="p-6 pb-0">
                        <h3 className="font-semibold text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-2">
                            Details
                        </h3>
                        <div className="flex flex-col gap-2">
                             {/* Category Selector */}
                            <div className="w-full">
                                <CategorySelector 
                                    selectedCategoryId={categoryId} 
                                    onSelect={handleCategorySelect} 
                                />
                            </div>

                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)]/50 p-3 rounded-lg border border-[var(--border-primary)]/50">
                                <Calendar className="h-4 w-4 text-[var(--text-muted)]" />
                                <span>Updated {formatDistanceToNow(new Date(plan.updatedAt), { addSuffix: true })}</span>
                            </div>
                            
                            {isPinned && (
                                <div className="flex items-center gap-2 text-sm text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 p-3 rounded-lg border border-[var(--accent-primary)]/20">
                                    <Pin className="h-4 w-4 fill-current" />
                                    <span>Pinned Plan</span>
                                </div>
                            )}
                        </div>
                    </div>
                     
                     <div className="h-px bg-[var(--border-primary)]/50 mx-6 my-6" />

                     <div className="px-6">
                         <h3 className="font-semibold text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-2">
                             Actions
                         </h3>
                         <button 
                             onClick={handleDeletePlan}
                             className="w-full flex items-center gap-2 p-2 rounded-md text-red-500 hover:bg-red-500/10 text-sm transition-colors"
                         >
                             <Trash2 className="h-4 w-4" />
                             Delete Plan
                         </button>
                     </div>
                </div>
            </div>
        </div>
    );
}
