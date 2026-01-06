"use client";

import { useState, useEffect, useMemo } from "react";
import { askQuestion, getSuggestedQuestions, generateFollowUpQuestions } from "@/lib/actions/ask";
import { MAX_HISTORY_ITEMS } from "@/lib/constants";
import { Send, Loader2, BookOpen, Sparkles, History, Clock, ChevronDown, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

interface HistoryItem {
  question: string;
  answer: string;
  sources: Array<{ id: string; title: string; technologyId: string; technologyName: string; similarity: number }>;
  snippetCount: number;
  timestamp: number;
}

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [snippetCount, setSnippetCount] = useState(0);
  const [sources, setSources] = useState<Array<{ id: string; title: string; technologyId: string; technologyName: string; similarity: number }>>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());
  const [followUps, setFollowUps] = useState<string[]>([]);

  useEffect(() => {
    // Load history from localStorage with migration for old format
    const savedHistory = localStorage.getItem("ask-history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Filter out old format (strings) and keep only new format (objects with answer property)
        const validHistory = Array.isArray(parsed) 
          ? parsed.filter((item): item is HistoryItem => 
              typeof item === 'object' && 
              item !== null && 
              'answer' in item && 
              'question' in item &&
              'timestamp' in item
            )
          : [];
        setHistory(validHistory);
        
        // Update localStorage with cleaned data
        if (validHistory.length !== parsed.length) {
          localStorage.setItem("ask-history", JSON.stringify(validHistory));
        }
      } catch (error) {
        console.error("Failed to load history:", error);
        localStorage.removeItem("ask-history");
      }
    }

    // Fetch suggested questions
    getSuggestedQuestions().then(setSuggestions).catch(console.error);
  }, []);

  const handleAsk = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setAnswer("");
    setSnippetCount(0);
    setSources([]);
    setQuestion(query);

    try {
      const result = await askQuestion(query);
      setAnswer(result.answer);
      setSnippetCount(result.snippetCount);
      if (result.sources) {
        setSources(result.sources);
      }

      // Save complete Q&A to history
      const newHistoryItem: HistoryItem = {
        question: query,
        answer: result.answer,
        sources: result.sources || [],
        snippetCount: result.snippetCount,
        timestamp: Date.now(),
      };

      const newHistory = [newHistoryItem, ...history.filter(h => h.question !== query)].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem("ask-history", JSON.stringify(newHistory));

      // Generate follow-up questions
      generateFollowUpQuestions(query, result.answer)
        .then(setFollowUps)
        .catch(console.error);
    } catch (error) {
      console.error("Failed to get answer:", error);
      setAnswer("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const restoreFromHistory = (item: HistoryItem) => {
    setQuestion(item.question);
    setAnswer(item.answer);
    setSources(item.sources);
    setSnippetCount(item.snippetCount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(question);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-[var(--accent-primary)]/10 p-4">
              <Sparkles className="h-8 w-8 text-[var(--accent-primary)]" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Ask Your Notes
            </h1>
            <span className="rounded bg-[var(--accent-primary)]/10 px-2 py-1 text-xs font-semibold text-[var(--accent-primary)]">
              BETA
            </span>
          </div>
          <p className="text-[var(--text-muted)]">
            Get answers from your own knowledge base
          </p>
        </div>

        {/* Question Input */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about your notes... (e.g., 'Explain hoisting in JavaScript')"
                className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 pr-12 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] resize-none"
                rows={3}
                disabled={isLoading}
                onKeyDown={(e) => {
                    if(e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAsk(question);
                    }
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="absolute bottom-4 right-4 rounded-md bg-[var(--accent-primary)] p-2 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>
          
          {/* Suggested Questions */}
          {!answer && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleAsk(suggestion)}
                  disabled={isLoading}
                  className="rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Answer Display */}
        {(answer || isLoading) && (
          <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {snippetCount > 0 && (
              <div className="mb-4 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <BookOpen className="h-4 w-4" />
                <span>Based on {snippetCount} of your notes</span>
              </div>
            )}
            
            <div className="prose prose-invert max-w-none">
              {isLoading ? (
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              ) : (
                <div className="markdown-content text-[var(--text-primary)] leading-relaxed prose prose-invert max-w-none prose-headings:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)] prose-strong:font-semibold prose-code:text-[var(--accent-primary)] prose-code:bg-[var(--bg-tertiary)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-[var(--bg-tertiary)] prose-pre:border prose-pre:border-[var(--border-primary)] prose-pre:rounded-lg prose-ul:list-disc prose-ol:list-decimal prose-li:my-1">
                  <ReactMarkdown>
                    {answer}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Follow-up Questions */}
        {followUps.length > 0 && !isLoading && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-600">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Ask Follow-up
            </h3>
            <div className="flex flex-wrap gap-2">
              {followUps.map((followUp, i) => (
                <button
                  key={i}
                  onClick={() => handleAsk(followUp)}
                  className="rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)] text-left"
                >
                  {followUp}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sources Display */}
        {sources.length > 0 && !isLoading && (
          <div className="space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Sources Used
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {sources.map((source) => {
                const isExpanded = expandedSources.has(source.id);
                
                return (
                  <div
                    key={source.id}
                    className="p-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[var(--text-primary)] mb-1 truncate">
                          {source.title}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                          <span className="px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                            {source.technologyName}
                          </span>
                          <span className="text-[var(--accent-primary)] font-medium">
                            {source.similarity}% match
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const newExpanded = new Set(expandedSources);
                          if (isExpanded) {
                            newExpanded.delete(source.id);
                          } else {
                            newExpanded.add(source.id);
                          }
                          setExpandedSources(newExpanded);
                        }}
                        className="p-1 rounded hover:bg-[var(--bg-tertiary)] transition-colors shrink-0"
                      >
                        <ChevronDown className={`h-4 w-4 text-[var(--text-muted)] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-[var(--border-primary)] animate-in slide-in-from-top-2 duration-200">
                        <div className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-4">
                          Preview: This snippet contains relevant information about {source.title.toLowerCase()}...
                        </div>
                        <Link
                          href={`/technology/${source.technologyId}/edit/${source.id}?highlight=${encodeURIComponent(question)}`}
                          className="inline-flex items-center gap-2 text-sm text-[var(--accent-primary)] hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Full Snippet
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* History */}
        {!answer && !isLoading && history.length > 0 && (
           <div className="mt-12 pt-8 border-t border-[var(--border-primary)]">
             <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4 flex items-center gap-2">
               <History className="h-4 w-4" />
               Recent Questions
             </h3>
             <div className="space-y-6">
               {(() => {
                 const now = Date.now();
                 const oneDay = 24 * 60 * 60 * 1000;
                 const oneWeek = 7 * oneDay;

                 const today = history.filter(h => now - h.timestamp < oneDay);
                 const yesterday = history.filter(h => now - h.timestamp >= oneDay && now - h.timestamp < 2 * oneDay);
                 const thisWeek = history.filter(h => now - h.timestamp >= 2 * oneDay && now - h.timestamp < oneWeek);
                 const older = history.filter(h => now - h.timestamp >= oneWeek);

                 const renderHistoryGroup = (items: HistoryItem[], label: string) => {
                   if (items.length === 0) return null;
                   return (
                     <div key={label}>
                       <div className="text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">{label}</div>
                       <div className="space-y-2">
                         {items.map((item, i) => (
                           <button
                             key={i}
                             onClick={() => restoreFromHistory(item)}
                             className="w-full text-left p-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)] transition-all group"
                           >
                             <div className="flex items-start gap-3 mb-2">
                               <Clock className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors mt-0.5 shrink-0" />
                               <div className="flex-1 min-w-0">
                                 <div className="font-medium text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
                                   {item.question}
                                 </div>
                                 <div className="text-sm text-[var(--text-muted)] line-clamp-2">
                                   {item.answer.slice(0, 120)}...
                                 </div>
                               </div>
                             </div>
                             {item.snippetCount > 0 && (
                               <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] ml-7">
                                 <BookOpen className="h-3 w-3" />
                                 <span>{item.snippetCount} sources used</span>
                               </div>
                             )}
                           </button>
                         ))}
                       </div>
                     </div>
                   );
                 };

                 return (
                   <>
                     {renderHistoryGroup(today, "Today")}
                     {renderHistoryGroup(yesterday, "Yesterday")}
                     {renderHistoryGroup(thisWeek, "This Week")}
                     {renderHistoryGroup(older, "Older")}
                   </>
                 );
               })()}
             </div>
           </div>
        )}

        {/* Empty State (if no history) */}
        {!answer && !isLoading && history.length === 0 && (
          <div className="text-center text-[var(--text-muted)] py-12">
            <p>Ask a question to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
