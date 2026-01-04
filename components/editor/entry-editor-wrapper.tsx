"use client";

import { useState, useCallback } from "react";
import { TiptapEditor } from "./tiptap-editor";
import Link from "next/link";
import { EditorGuide } from "./editor-guide";

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
    initialContent: any;
    incomingLinks: IncomingLink[];
    initialOutgoingLinks: any[];
}

export function EntryEditorWrapper({ initialContent, incomingLinks, initialOutgoingLinks }: EntryEditorWrapperProps) {
    const [connectedSnippets, setConnectedSnippets] = useState<LinkedSnippet[]>(
        initialOutgoingLinks.map(l => ({ id: l.target.id, title: l.target.title }))
    );

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
        <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden h-full">
            {/* Main Editor Column */}
            <div className={`flex flex-1 flex-col gap-4 ${
                // Mobile: let it grow naturally, handled by parent scroll
                // Desktop: constrain and scroll internally
                'lg:overflow-hidden'
            }`}>
                <EditorGuide />
                
                <TiptapEditor 
                    content={typeof initialContent === 'string' ? initialContent : JSON.stringify(initialContent)} 
                    name="content" 
                    // Mobile: min-height to ensure space, allow grow. Desktop: flex-1 scrollable
                    className="min-h-[400px] lg:flex-1 lg:overflow-y-auto"
                    onChange={handleContentChange}
                />
            </div>

            {/* Context Sidebar */}
            <div className="w-full lg:w-72 flex-col gap-6 lg:border-l border-t lg:border-t-0 border-[var(--border-primary)] pt-8 lg:pt-0 lg:pl-6 lg:pr-2 lg:overflow-y-auto shrink-0 pb-10 font-sans">
            
                {/* Outgoing Links (Connected To) - LIVE UPDATING */}
                <div>
                    <h3 className="font-semibold text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
                        Connected to
                        <span className="bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded text-[10px]">
                            {connectedSnippets.length}
                        </span>
                    </h3>
                    <div className="flex flex-col gap-3">
                        {connectedSnippets.length > 0 ? (
                            connectedSnippets.map(snippet => (
                                <Link 
                                    key={snippet.id}
                                    href={`/technology/Unknown/edit/${snippet.id}`} 
                                    className={`block p-3 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] transition-all
                                        ${'hover:border-[var(--accent-primary)] hover:shadow-sm'}
                                    `}
                                >
                                    <div className="font-medium text-sm text-[var(--text-primary)] mb-1">
                                        {snippet.title}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)]">
                                        Is mentioned
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-sm text-[var(--text-muted)] italic px-2">
                                No connections yet. <br/> Use <code className="bg-[var(--bg-tertiary)] px-1 rounded">@</code> to link snippets.
                            </div>
                        )}
                    </div>
                </div>

                {/* Incoming Links (Referenced By) - SERVER STATE */}
                <div>
                    <h3 className="font-semibold text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2 pt-6">
                        Referenced by
                        <span className="bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded text-[10px]">
                            {incomingLinks.length}
                        </span>
                    </h3>
                    <div className="flex flex-col gap-3">
                        {incomingLinks.length > 0 ? (
                            incomingLinks.map(link => (
                                <Link 
                                    key={link.id}
                                    href={`/technology/${link.source.technologyId}/edit/${link.source.id}`}
                                    className="block p-3 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)] hover:shadow-sm transition-all"
                                >
                                    <div className="font-medium text-sm text-[var(--text-primary)] mb-1">
                                        {link.source.title}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)]">
                                        Mentions this
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-sm text-[var(--text-muted)] italic px-2">
                                No references yet.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
