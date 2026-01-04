"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { ArrowLeft, ArrowRight, Check, Edit2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type ReviewSnippet = {
    id: string;
    title: string;
    content: any;
    technologyId: string;
    technologyName: string;
    lastViewedAt: Date | null;
};

export function ReviewSession({ snippets }: { snippets: ReviewSnippet[] }) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    if (snippets.length === 0) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
                 <div className="mb-4 h-16 w-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)]">
                    <Check className="h-8 w-8" />
                 </div>
                 <h2 className="text-xl font-semibold mb-2">All caught up!</h2>
                 <p className="text-[var(--text-muted)] mb-6 max-w-md">
                     You've reviewed all your older snippets recently. Come back later or browse your dashboard.
                 </p>
                 <button
                    onClick={() => router.push("/dashboard")}
                    className="rounded-full bg-[var(--text-primary)] px-6 py-2 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:scale-105"
                 >
                    Back to Dashboard
                 </button>
            </div>
        );
    }

    const currentSnippet = snippets[currentIndex];
    const isLast = currentIndex === snippets.length - 1;

    const handleNext = () => {
        if (isLast) {
            setIsFinished(true);
        } else {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    if (isFinished) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-in fade-in duration-500">
                 <div className="mb-6 h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <Check className="h-10 w-10" />
                 </div>
                 <h2 className="text-2xl font-bold mb-3">Session Complete</h2>
                 <p className="text-[var(--text-muted)] mb-8 max-w-md">
                     You've refreshed your memory on {snippets.length} snippets. Great consistency!
                 </p>
                 <button
                    onClick={() => router.push("/dashboard")}
                    className="rounded-full bg-[var(--text-primary)] px-8 py-3 text-base font-semibold text-[var(--bg-primary)] transition-transform hover:scale-105"
                 >
                    Return Home
                 </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col max-w-4xl mx-auto w-full py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Exit Review</span>
                </button>
                <div className="text-sm font-mono text-[var(--text-muted)]">
                    {currentIndex + 1} <span className="opacity-30">/</span> {snippets.length}
                </div>
            </div>

            {/* Content Card */}
            <div key={currentSnippet.id} className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-[var(--border-primary)] flex items-start justify-between gap-4 bg-[var(--bg-secondary)]/50 backdrop-blur-sm">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                            <span>{currentSnippet.technologyName}</span>
                            {currentSnippet.lastViewedAt && (
                                <>
                                    <span className="opacity-30">•</span>
                                    <span>Last viewed {formatDistanceToNow(new Date(currentSnippet.lastViewedAt), { addSuffix: true })}</span>
                                </>
                            )}
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
                            {currentSnippet.title}
                        </h1>
                    </div>
                </div>

                <div className="p-6 sm:p-8 bg-[var(--bg-primary)]/30">
                    <TiptapEditor
                        content={JSON.stringify(currentSnippet.content)}
                        name="content"
                        editable={false}
                        className="prose-lg"
                    />
                </div>
                
                {/* Footer Controls */}
                <div className="p-4 sm:p-6 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] flex items-center justify-between gap-4">
                     <button
                        onClick={() => window.open(`/technology/${currentSnippet.technologyId}/edit/${currentSnippet.id}`, '_blank')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-tertiary)]"
                        title="Edit in new tab"
                     >
                        <Edit2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Open to Edit</span>
                     </button>

                     <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-8 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-bold shadow-md transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
                     >
                        <span>{isLast ? "Done" : "Next Snippet"}</span>
                        {isLast ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                     </button>
                </div>
            </div>
        </div>
    );
}
