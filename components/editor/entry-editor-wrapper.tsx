"use client";

import { useState, useCallback } from "react";
import { TiptapEditor } from "./tiptap-editor";
import Link from "next/link";
import { EditorGuide } from "./editor-guide";
import { Calendar, Link as LinkIcon, ArrowRightLeft, ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { TagInput } from "@/components/tags/tag-input";
import { autoSaveEntry } from "@/lib/actions/entry";
import { useRouter } from "next/navigation";

interface LinkedSnippet {
    id: string;
    title: string;
    isNew?: boolean;
}

interface IncomingLink {
    id: string;
    source: {
        id: string;
        title: string;
        technologyId: string;
    }
}

interface EntryEditorWrapperProps {
    entryId: string;
    technologyId: string;
    technologyName: string;
    initialTitle: string;
    initialTags: string[];
    initialContent: any;
    incomingLinks: IncomingLink[];
    initialOutgoingLinks: any[];
    lastUpdated: Date;
}

export function EntryEditorWrapper({ 
    entryId, 
    technologyId,
    technologyName,
    initialTitle,
    initialTags,
    initialContent, 
    incomingLinks, 
    initialOutgoingLinks, 
    lastUpdated: initialLastUpdated 
}: EntryEditorWrapperProps) {
    const router = useRouter();
    
    // State
    const [title, setTitle] = useState(initialTitle);
    const [tags, setTags] = useState<string[]>(initialTags);
    const [content, setContent] = useState(initialContent);
    const [lastUpdated] = useState(initialLastUpdated);
    const [isSaving, setIsSaving] = useState(false);
    
    // Derived Dirty State (Simple comparison)
    // Note: Content comparison can be expensive for very large docs, but okay for snippets.
    const isDirty = title !== initialTitle || 
                    JSON.stringify(tags) !== JSON.stringify(initialTags) || 
                    JSON.stringify(content) !== JSON.stringify(initialContent);

    // Sidebar & Connections
    const [connectedSnippets, setConnectedSnippets] = useState<LinkedSnippet[]>(
        initialOutgoingLinks.map(l => ({ id: l.target.id, title: l.target.title }))
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Handlers
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleTagsChange = (newTags: string[]) => {
        setTags(newTags);
    };

    const handleContentChange = useCallback((json: string) => {
        try {
            const parsed = JSON.parse(json);
            setContent(parsed);
            
            // Extract Mentions
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

    // Manual Save
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await autoSaveEntry(entryId, technologyId, title, content, tags);
            router.push(`/technology/${technologyId}`);
        } catch (e) {
            console.error(e);
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[var(--bg-primary)]">
             <div className="shrink-0 flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/95 sticky top-0 z-20 backdrop-blur">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Link
                        href={`/technology/${technologyId}`}
                        className="group flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] transition-colors hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    </Link>
                    <div className="h-4 w-px bg-[var(--border-primary)] mx-2" />
                    <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                        <Link href={`/technology/${technologyId}`} className="truncate max-w-[150px] hover:underline hover:text-[var(--text-primary)] transition-colors">
                            {technologyName}
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

                    <button
                        id="editor-save"
                        onClick={handleSave}
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
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 min-h-0 lg:flex-row relative group/wrapper overflow-hidden">
                {/* Editor Column */}
                <div className="flex flex-1 flex-col transition-all duration-300 min-w-0 lg:overflow-y-auto">
                     <div className="p-6 pb-0 flex flex-col gap-6 max-w-5xl mx-auto w-full">
                        {/* Title Input */}
                        <div>
                            <input
                            id="editor-title"
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Untitled Snippet"
                            className="w-full bg-transparent text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none border-b border-transparent focus:border-[var(--border-primary)] pb-2 transition-colors"
                            autoComplete="off"
                            />
                        </div>

                        {/* Tags */}
                        <div id="editor-tags">
                            <TagInput initialTags={tags} onChange={handleTagsChange} />
                        </div>
                    </div>

                    <div className="flex-1 min-h-[500px] p-6 max-w-5xl mx-auto w-full flex flex-col pt-4">
                        <TiptapEditor 
                            content={typeof content === 'string' ? content : JSON.stringify(content)} 
                            name="content" 
                            className="flex-1 font-medium"
                            onChange={handleContentChange}
                            onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                            isSidebarOpen={isSidebarOpen}
                            currentEntryId={entryId}
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
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)]/50 p-3 rounded-lg border border-[var(--border-primary)]/50">
                            <Calendar className="h-4 w-4 text-[var(--text-muted)]" />
                            <span>Updated {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}</span>
                        </div>
                    </div>

                    <div className="h-px bg-[var(--border-primary)]/50 mx-6 my-6" />
                
                    {/* Outgoing Links */}
                    <div className="px-6">
                        <h3 className="font-semibold text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-2">
                            Outlinks
                            <span className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] px-1.5 py-0.5 rounded text-[10px] font-bold">
                                {connectedSnippets.length}
                            </span>
                        </h3>
                        {/* ... Links ... */}
                        <div className="flex flex-col gap-2">
                            {connectedSnippets.length > 0 ? (
                                connectedSnippets.map(snippet => (
                                    <Link 
                                        key={snippet.id}
                                        href={`/technology/Unknown/edit/${snippet.id}`} 
                                        className={`group flex items-center justify-between p-2.5 rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 transition-all
                                            ${'hover:border-[var(--accent-primary)] hover:bg-[var(--bg-secondary)] hover:shadow-sm'}
                                        `}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <LinkIcon className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0 group-hover:text-[var(--accent-primary)]" />
                                            <span className="font-medium text-sm text-[var(--text-primary)] truncate">
                                                {snippet.title}
                                            </span>
                                        </div>
                                        <ArrowRightLeft className="h-3 w-3 text-[var(--text-muted)] opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                                    </Link>
                                ))
                            ) : (
                                <div className="text-sm text-[var(--text-muted)] italic px-2 py-4 text-center border border-dashed border-[var(--border-primary)] rounded-lg">
                                    No mentions yet. <br/> Type <kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-xs">@</kbd> to link snippets.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Incoming Links */}
                    <div className="px-6 mt-6">
                        <h3 className="font-semibold text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-2 pt-2">
                            Backlinks
                             <span className="bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded text-[10px]">
                                {incomingLinks.length}
                            </span>
                        </h3>
                         <div className="flex flex-col gap-2">
                            {incomingLinks.length > 0 ? (
                                incomingLinks.map(link => (
                                    <Link 
                                        key={link.id}
                                        href={`/technology/${link.source.technologyId}/edit/${link.source.id}`}
                                        className="group flex items-center justify-between p-2.5 rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 hover:border-[var(--accent-primary)] hover:bg-[var(--bg-secondary)] hover:shadow-sm transition-all"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <LinkIcon className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" />
                                            <span className="font-medium text-sm text-[var(--text-primary)] truncate">
                                                {link.source.title}
                                            </span>
                                        </div>
                                        <ArrowRightLeft className="h-3 w-3 text-[var(--text-muted)] opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                                    </Link>
                                ))
                            ) : (
                                 <div className="text-sm text-[var(--text-muted)] italic px-2 py-4 text-center border border-dashed border-[var(--border-primary)] rounded-lg">
                                    No backlinks found.
                                </div>
                            )}
                        </div>
                    </div>
                    
                     <div className="pt-4 mt-auto px-6">
                        <EditorGuide />
                     </div>
                </div>
            </div>
        </div>
    );
}
