"use client";

import { useState, useCallback } from "react";
import { TiptapEditor } from "./tiptap-editor";
import Link from "next/link";
import { EditorGuide } from "./editor-guide";
import { Calendar, Link as LinkIcon, ArrowRightLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
    initialContent: any;
    incomingLinks: IncomingLink[];
    initialOutgoingLinks: any[];
    lastUpdated: Date;
}

export function EntryEditorWrapper({ entryId, initialContent, incomingLinks, initialOutgoingLinks, lastUpdated }: EntryEditorWrapperProps) {
    const [connectedSnippets, setConnectedSnippets] = useState<LinkedSnippet[]>(
        initialOutgoingLinks.map(l => ({ id: l.target.id, title: l.target.title }))
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleContentChange = useCallback((json: string) => {
        try {
            const content = JSON.parse(json);
            const mentions = new Map<string, LinkedSnippet>();

            // Traverse to find mentions
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

            traverse(content);
            setConnectedSnippets(Array.from(mentions.values()));
        } catch (e) {
            // Ignore parse errors during typing
        }
    }, []);

    return (
        <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden h-full relative group/wrapper">
            {/* Main Editor Column */}
            <div className={`flex flex-1 flex-col gap-4 transition-all duration-300 ${
                'lg:overflow-hidden'
            }`}>
                <TiptapEditor 
                    content={typeof initialContent === 'string' ? initialContent : JSON.stringify(initialContent)} 
                    name="content" 
                    // Mobile: min-height to ensure space, allow grow. Desktop: flex-1 scrollable
                    className="min-h-[500px] lg:flex-1 lg:overflow-y-auto font-medium"
                    onChange={handleContentChange}
                    onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                    isSidebarOpen={isSidebarOpen}
                    currentEntryId={entryId}
                />
            </div>

            {/* Context Sidebar */}
            <div 
                className={`flex-col gap-6 lg:border-l border-t lg:border-t-0 border-[var(--border-primary)] pt-8 lg:pt-0 lg:overflow-y-auto shrink-0 pb-10 font-sans transition-all duration-300 ${
                    isSidebarOpen 
                        ? "w-full lg:w-80 lg:pl-6 lg:pr-2 opacity-100" 
                        : "w-0 lg:w-0 lg:pl-0 lg:pr-0 overflow-hidden opacity-0"
                }`}
            >
                {/* Metadata */}
                <div>
                     <h3 className="font-semibold text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-2">
                        Details
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)]/50 p-3 rounded-lg border border-[var(--border-primary)]/50">
                        <Calendar className="h-4 w-4 text-[var(--text-muted)]" />
                        <span>Updated {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}</span>
                    </div>
                </div>

                <div className="h-px bg-[var(--border-primary)]/50" />
            
                {/* Outgoing Links (Connected To) - LIVE UPDATING */}
                <div>
                    <h3 className="font-semibold text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-2">
                        Outlinks
                        <span className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] px-1.5 py-0.5 rounded text-[10px] font-bold">
                            {connectedSnippets.length}
                        </span>
                    </h3>
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

                {/* Incoming Links (Referenced By) - SERVER STATE */}
                <div>
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
                
                 <div className="pt-4 mt-auto">
                    <EditorGuide />
                 </div>

            </div>
        </div>
    );
}
