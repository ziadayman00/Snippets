"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { TiptapEditor } from "./tiptap-editor";
import Link from "next/link";
import { EditorGuide } from "./editor-guide";
import { EditorTour } from "@/components/onboarding/editor-tour";
import { Calendar, Link as LinkIcon, ArrowRightLeft, ChevronLeft, Save, Loader2, AlertCircle, Clock, Trash2, PanelRight, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { TagInput } from "@/components/tags/tag-input";
import { autoSaveEntry, createEntry, deleteEntry } from "@/lib/actions/entry";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce"; 
import { toast } from "sonner"; 

interface LinkedSnippet {
    id: string;
    title: string;
}

interface IncomingLink {
    id: string;
    source: {
        id: string;
        title: string;
        technologyId: string;
    }
}

interface UnifiedEntryEditorProps {
    isNew?: boolean;
    entryId?: string;
    technologyId: string;
    technologyName: string;
    initialTitle?: string;
    initialTags?: string[];
    initialContent?: any;
    incomingLinks?: IncomingLink[];
    initialOutgoingLinks?: any[];
    lastUpdated?: Date;
}

export function UnifiedEntryEditor({ 
    isNew = false,
    entryId, 
    technologyId,
    technologyName,
    initialTitle = "",
    initialTags = [],
    initialContent = "", 
    incomingLinks = [], 
    initialOutgoingLinks = [], 
    lastUpdated: initialLastUpdated = new Date()
}: UnifiedEntryEditorProps) {
    const router = useRouter();
    
    // State
    // State
    const [title, setTitle] = useState(initialTitle);
    const [tags, setTags] = useState<string[]>(initialTags);
    const [content, setContent] = useState(initialContent);
    const [lastUpdated, setLastUpdated] = useState(initialLastUpdated);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Track the last saved state to reliably determine dirty status
    const [savedState, setSavedState] = useState({
        title: initialTitle,
        tags: initialTags,
        contentString: typeof initialContent === 'string' ? initialContent : JSON.stringify(initialContent)
    });

    // Initial check for desktop to open sidebar
    useEffect(() => {
        const checkScreen = () => {
             if (window.innerWidth >= 1024) { // lg breakpoint
                setIsSidebarOpen(true);
            }
        };
        checkScreen();
    }, []);

    // Derived Dirty State
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        const checkDirty = () => {
            const currentContentString = typeof content === 'string' ? content : JSON.stringify(content);
            const savedContentString = savedState.contentString;
            
            // Simple string comparison for JSON content
            // Note: Tiptap's JSON structure order is generally stable for equality checks
            const isContentDirty = currentContentString !== savedContentString;
            const isTitleDirty = title !== savedState.title;
            const isTagsDirty = JSON.stringify(tags) !== JSON.stringify(savedState.tags);

            setIsDirty(isContentDirty || isTitleDirty || isTagsDirty);
        };
        checkDirty();
    }, [title, tags, content, savedState]);

    // Sidebar Connections
    const [connectedSnippets, setConnectedSnippets] = useState<LinkedSnippet[]>(
        initialOutgoingLinks.map(l => ({ id: l.target.id, title: l.target.title }))
    );

    // Ref for initial hydration check (still useful for ignoring first Tiptap event)
    const contentRef = useRef(initialContent);

    // Handle Title Auto-Resize
    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTitle(e.target.value);
        // Auto-resize
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    // Initialize auto-resize
    useEffect(() => {
        const textarea = document.getElementById('editor-title-area');
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    }, []);

    const handleTagsChange = (newTags: string[]) => {
        setTags(newTags);
    };

    const handleContentChange = useCallback((json: string) => {
        try {
            const parsed = JSON.parse(json);
            
            // Deep compare to prevent unnecessary state update on initial load
            if (JSON.stringify(contentRef.current) === JSON.stringify(parsed)) {
                return;
            }

            setContent(parsed);
            contentRef.current = parsed;
            
            // Extract Mentions logic...
            const mentions = new Map<string, LinkedSnippet>();
            const traverse = (node: any) => {
                if (node.type === "mention" && node.attrs?.id) {
                    mentions.set(node.attrs.id, {
                        id: node.attrs.id,
                        title: node.attrs.label || "Unknown Snippet"
                    });
                }
                if (node.content && Array.isArray(node.content)) {
                    node.content.forEach(traverse);
                }
            };
            traverse(parsed);
            setConnectedSnippets(Array.from(mentions.values()));
        } catch (e) {
            // Ignore
        }
    }, []);

    // Save Handling
    const handleSave = async () => {
        if (!title.trim()) return;

        setIsSaving(true);
        try {
            if (isNew) {
                // Create New
                const formData = new FormData();
                formData.append("title", title);
                formData.append("content", typeof content === 'string' ? content : JSON.stringify(content));
                formData.append("technologyId", technologyId);
                formData.append("tags", JSON.stringify(tags));

                const result = await createEntry(formData);
                if (result.success && result.entryId) {
                   toast.success("Entry created successfully");
                   // Update saved state for the new entry
                   setSavedState({
                       title,
                       tags,
                       contentString: typeof content === 'string' ? content : JSON.stringify(content)
                   });
                   router.push(`/technology/${technologyId}/edit/${result.entryId}`);
                   router.refresh();
                }
            } else if (entryId) {
                // Update Existing
                await autoSaveEntry(entryId, technologyId, title, content, tags);
                setLastUpdated(new Date());
                
                // Update saved state to match current, clearing isDirty
                setSavedState({
                    title,
                    tags,
                    contentString: typeof content === 'string' ? content : JSON.stringify(content)
                });
                
                toast.success("Entry saved");
                router.refresh();
                
                // Show "Saved" state on button briefly
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 2000);
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to save entry");
        } finally {
            setIsSaving(false);
        }
    };
    
    // Auto-save effect for existing entries
    const debouncedContent = useDebounce(content, 2000);
    const debouncedTitle = useDebounce(title, 2000);
    
    useEffect(() => {
        if (!isNew && isDirty && entryId) {
            const save = async () => {
                // Quiet auto-save
                await autoSaveEntry(entryId, technologyId, title, content, tags);
                setLastUpdated(new Date());
                // Update saved state after auto-save
                setSavedState({
                    title,
                    tags,
                    contentString: typeof content === 'string' ? content : JSON.stringify(content)
                });
            };
            save();
        }
    }, [debouncedContent, debouncedTitle, isNew, entryId, technologyId, tags]); // Dependencies trigger save

    return (
        <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
            
            {/* Main Content Scroll Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative scroll-smooth">
                
                {/* Sticky Header */}
                <div className="sticky top-0 z-40 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-primary)]/50 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 transition-all">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                         <Link
                            href={`/technology/${technologyId}`}
                            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-md hover:bg-[var(--bg-secondary)] shrink-0"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                        <div className="flex flex-col min-w-0">
                           <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                <Link href={`/technology/${technologyId}`} className="opacity-70 hover:opacity-100 hover:underline transition-all truncate">
                                    {technologyName}
                                </Link>
                                <span className="opacity-40 shrink-0">/</span>
                                <span className="font-medium text-[var(--text-primary)] truncate max-w-[150px] sm:max-w-[200px]">
                                    {title || "Untitled"}
                                </span>
                           </div>
                           {!isNew && (
                               <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 hidden sm:flex">
                                   {saveStatus === 'saved' ? (
                                       <span className="text-green-500 font-medium animate-in fade-in flex items-center gap-1">
                                           <Check className="h-3 w-3" />
                                           Saved
                                       </span>
                                   ) : isDirty ? (
                                       <span className="text-amber-500 flex items-center gap-1">
                                           <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                           Unsaved items...
                                       </span>
                                   ) : (
                                       <span>Saved {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}</span>
                                   )}
                               </div>
                           )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                         <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`p-2 rounded-md transition-colors lg:hidden ${isSidebarOpen ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'}`}
                            title="Toggle Sidebar"
                        >
                            <PanelRight className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`p-2 rounded-md transition-colors hidden lg:block ${isSidebarOpen ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'}`}
                            title="Toggle Sidebar"
                        >
                            <PanelRight className="h-4 w-4" />
                        </button>

                        <div className="h-4 w-px bg-[var(--border-primary)] mx-1 hidden sm:block" />

                        <button
                            id="editor-save"
                            onClick={handleSave}
                            disabled={isSaving || saveStatus === 'saved' || (!title.trim())}
                            className={`px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-all shadow-sm whitespace-nowrap ${
                                saveStatus === 'saved' 
                                    ? "bg-green-500 text-white" 
                                    : "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                            }`}
                        >
                            {isSaving ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : saveStatus === 'saved' ? (
                                <Check className="h-3.5 w-3.5" />
                            ) : (
                                <Save className="h-3.5 w-3.5" />
                            )}
                            
                            {isNew ? (
                                <span className="hidden sm:inline">Create Entry</span>
                            ) : saveStatus === 'saved' ? (
                                <span className="hidden sm:inline">Saved!</span>
                            ) : (
                                <span className="hidden sm:inline">Save</span>
                            )}
                            
                            {/* Mobile Text */}
                            {isNew ? (
                                <span className="sm:hidden">Create</span>
                            ) : saveStatus === 'saved' ? (
                                <span className="sm:hidden">Saved</span>
                            ) : (
                                <span className="sm:hidden">Save</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Editor Surface */}
                <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 md:py-16 flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
                    
                    {/* Header Inputs */}
                    <div className="space-y-4 sm:space-y-6 group/header">
                        <textarea
                            id="editor-title-area"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Untitled Entry"
                            rows={1}
                            className="w-full bg-transparent text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/30 focus:outline-none resize-none overflow-hidden leading-normal py-2"
                            autoComplete="off"
                        />
                        
                        <div id="editor-tags" className="opacity-100 sm:opacity-60 sm:group-hover/header:opacity-100 transition-opacity duration-300">
                             <TagInput initialTags={tags} onChange={handleTagsChange} />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--border-primary)] to-transparent opacity-50" />

                    {/* Editor */}
                    <div id="editor-area" className="min-h-[500px]">
                        <TiptapEditor 
                            content={typeof content === 'string' ? content : JSON.stringify(content)} 
                            name="content" 
                            className="min-h-[500px]"
                            onChange={handleContentChange}
                            isSidebarOpen={isSidebarOpen} // Just for passing props if needed
                            currentEntryId={entryId}
                            variant="clean"
                            stickyOffset={80}
                        />
                    </div>

                    {/* Footer Area */}
                    <div className="mt-20 pt-10 border-t border-[var(--border-primary)]/30 flex items-center justify-between text-[var(--text-muted)] text-sm">
                        <div>
                             Last edited by you
                        </div>
                         {!isNew && entryId && (
                            <button 
                                onClick={async () => {
                                    if(confirm("Are you sure you want to delete this entry?")) {
                                        await deleteEntry(entryId, technologyId);
                                        router.push(`/technology/${technologyId}`);
                                    }
                                }}
                                className="flex items-center gap-2 text-red-500/70 hover:text-red-600 hover:bg-red-500/10 px-3 py-1.5 rounded-md transition-all"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Entry
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Right Sidebar */}
            <div className={`fixed inset-y-0 right-0 z-50 lg:relative lg:z-0 border-l border-[var(--border-primary)] bg-[var(--bg-secondary)]/95 backdrop-blur-md lg:bg-[var(--bg-secondary)]/30 transition-all duration-300 flex flex-col shrink-0 shadow-2xl lg:shadow-none ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full opacity-0 overflow-hidden lg:opacity-100 lg:translate-x-full'}`}>
                <div className="p-6 space-y-8 overflow-y-auto flex-1">
                    
                    {/* Metadata Section */}
                    <div>
                         <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
                            Details
                         </h3>
                         <div className="space-y-3">
                             <div className="flex items-center justify-between text-sm">
                                 <span className="text-[var(--text-secondary)]">Created</span>
                                 <span className="text-[var(--text-primary)]">{isNew ? "Just now" : "Recently"}</span>
                             </div>
                             <div className="flex items-center justify-between text-sm">
                                 <span className="text-[var(--text-secondary)]">Status</span>
                                 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-500">
                                     Active
                                 </span>
                             </div>
                             <div className="flex items-center justify-between text-sm">
                                 <span className="text-[var(--text-secondary)]">Words</span>
                                 <span className="text-[var(--text-primary)]">
                                     {typeof content === 'string' ? 0 : JSON.stringify(content).split(' ').length}
                                 </span>
                             </div>
                         </div>
                    </div>

                    {/* Outlinks */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center justify-between">
                            Mentions
                            <span className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] px-1.5 py-0.5 rounded text-[10px]">{connectedSnippets.length}</span>
                        </h3>
                        <div className="flex flex-col gap-2">
                             {connectedSnippets.length > 0 ? (
                                connectedSnippets.map(snippet => (
                                    <Link 
                                        key={snippet.id}
                                        href={`/technology/${technologyId}/edit/${snippet.id}`}
                                        className="flex items-center gap-2 p-2 rounded-md hover:bg-[var(--bg-tertiary)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
                                    >
                                        <ArrowRightLeft className="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]" />
                                        <span className="truncate">{snippet.title}</span>
                                    </Link>
                                ))
                             ) : (
                                 <div className="text-sm text-[var(--text-muted)] italic">
                                     No mentions yet. Type @ to link.
                                 </div>
                             )}
                        </div>
                    </div>

                     {/* Backlinks */}
                     <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center justify-between">
                            Backlinks
                            <span className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] px-1.5 py-0.5 rounded text-[10px]">{incomingLinks.length}</span>
                        </h3>
                         <div className="flex flex-col gap-2">
                             {incomingLinks.length > 0 ? (
                                incomingLinks.map(link => (
                                    <Link 
                                        key={link.id}
                                        href={`/technology/${link.source.technologyId}/edit/${link.source.id}`}
                                        className="flex items-center gap-2 p-2 rounded-md hover:bg-[var(--bg-tertiary)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
                                    >
                                        <LinkIcon className="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]" />
                                        <span className="truncate">{link.source.title}</span>
                                    </Link>
                                ))
                             ) : (
                                 <div className="text-sm text-[var(--text-muted)] italic">
                                     No incoming links.
                                 </div>
                             )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="p-6 border-t border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50">
                    <EditorGuide />
                    <EditorTour />
                </div>
            </div>
        </div>
    );
}
