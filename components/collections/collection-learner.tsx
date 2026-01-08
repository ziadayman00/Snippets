"use client";

import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, BookOpen, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CollectionLearner({ collection }: { collection: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  
  const entries = collection.entries;
  const currentItem = entries[currentIndex];
  
  // Handlers
  const handleNext = () => {
    if (currentIndex < entries.length - 1) {
        setCurrentIndex(prev => prev + 1);
        window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        window.scrollTo(0, 0);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "Escape") router.push(`/collections/${collection.id}`);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, entries.length]);

  if (!currentItem) return <div>Empty collection</div>;

  const isSnippet = !!currentItem.entry;
  const content = isSnippet ? currentItem.entry : currentItem.technology;
  const progress = ((currentIndex + 1) / entries.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/95 backdrop-blur">
          <div className="h-1 bg-[var(--bg-tertiary)] w-full">
              <div 
                className="h-full bg-[var(--accent-primary)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
          </div>
          <div className="px-4 h-14 flex items-center justify-between max-w-5xl mx-auto w-full">
              <div className="flex items-center gap-4">
                  <Link href={`/collections/${collection.id}`} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors">
                      <X className="h-5 w-5 text-[var(--text-muted)]" />
                  </Link>
                  <div className="flex flex-col">
                      <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
                          {collection.title}
                      </span>
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {currentIndex + 1} of {entries.length}
                      </span>
                  </div>
              </div>
              
              <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                      <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                     onClick={handleNext}
                     disabled={currentIndex === entries.length - 1}
                     className="p-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                      <ChevronRight className="h-4 w-4" />
                  </button>
              </div>
          </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-8 animate-in fade-in duration-500 key={currentIndex}">
          {isSnippet ? (
              // Snippet View
              <div className="space-y-6">
                   <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2">
                       {content.technology?.name && (
                           <span className="text-xs font-semibold px-2 py-1 bg-[var(--bg-tertiary)] rounded-md">
                               {content.technology.name}
                           </span>
                       )}
                       <span className="text-xs">Snippet</span>
                   </div>
                   <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">
                       {content.title}
                   </h1>
                   
                   <div className="prose prose-invert max-w-none">
                       {/* If content is JSON string, pass it. If null, show empty */}
                       <TiptapEditor 
                           content={typeof content.content === 'string' ? content.content : JSON.stringify(content.content)} 
                           editable={false} 
                           className="border-none px-0 bg-transparent min-h-0"
                       />
                   </div>
              </div>
          ) : (
              // Technology View (Intro Card)
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
                  <div className="h-24 w-24 rounded-3xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                      {content.icon ? (
                          <span className="text-4xl">{content.icon}</span>
                      ) : (
                          <span className="text-4xl font-bold text-[var(--accent-primary)]">{content.name.substring(0, 1)}</span>
                      )}
                  </div>
                  <h1 className="text-4xl font-bold text-[var(--text-primary)]">
                      {content.name}
                  </h1>
                  <p className="text-xl text-[var(--text-secondary)] max-w-lg">
                      Module: {content.name}
                  </p>
                  <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl max-w-md w-full">
                      <p className="text-sm text-[var(--text-muted)]">
                          Use this section to master the concepts of {content.name}. 
                          Review the snippets following this module carefully.
                      </p>
                  </div>
                   <Link 
                        href={`/technology/${content.id}`}
                        className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:underline mt-4"
                   >
                       View full technology page <BookOpen className="h-4 w-4" />
                   </Link>
              </div>
          )}
      </main>

      {/* Footer Navigation (Large) */}
      <div className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
           <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
               <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-0 transition-colors"
                >
                    <ChevronLeft className="h-5 w-5" />
                    <div className="text-left hidden sm:block">
                        <div className="text-xs text-[var(--text-muted)]">Previous</div>
                        <div className="font-medium">Go Back</div>
                    </div>
                </button>

                {currentIndex < entries.length - 1 ? (
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-3 bg-[var(--text-primary)] text-[var(--bg-primary)] px-6 py-3 rounded-xl hover:scale-105 transition-transform font-medium"
                    >
                        <div className="text-right">
                            <div className="text-xs opacity-70">Next Step</div>
                            <div>Continue</div>
                        </div>
                        <ChevronRight className="h-5 w-5" />
                    </button>
                ) : (
                    <Link
                        href={`/collections/${collection.id}`}
                         className="flex items-center gap-3 bg-[var(--accent-primary)] text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform font-medium"
                    >
                         <CheckCircle2 className="h-5 w-5" />
                         <span>Finish</span>
                    </Link>
                )}
           </div>
      </div>
    </div>
  );
}
