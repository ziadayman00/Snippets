"use client";

import { useState, useEffect } from "react";
import { askQuestion, getSuggestedQuestions } from "@/lib/actions/ask";
import { Send, Loader2, BookOpen, Sparkles, History, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [snippetCount, setSnippetCount] = useState(0);
  const [sources, setSources] = useState<Array<{ id: string; title: string; technologyId: string; technologyName: string; similarity: number }>>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("ask-history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
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

    // Save to history
    const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("ask-history", JSON.stringify(newHistory));

    try {
      const result = await askQuestion(query);
      setAnswer(result.answer);
      setSnippetCount(result.snippetCount);
      if (result.sources) {
        setSources(result.sources);
      }
    } catch (error) {
      console.error("Failed to get answer:", error);
      setAnswer("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

        {/* Sources Display */}
        {sources.length > 0 && !isLoading && (
          <div className="space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Sources Used
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {sources.map((source) => (
                <a
                  key={source.id}
                  href={`/technology/${source.technologyId}/edit/${source.id}`}
                  className="block p-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)] transition-all group"
                >
                  <div className="font-medium text-[var(--text-primary)] mb-1 truncate group-hover:text-[var(--accent-primary)] transition-colors">
                    {source.title}
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span className="px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] group-hover:border-[var(--accent-primary)]/30 transition-colors">
                      {source.technologyName}
                    </span>
                    <span className="text-[var(--accent-primary)] font-medium">
                      {source.similarity}% match
                    </span>
                  </div>
                </a>
              ))}
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
             <div className="space-y-2">
               {history.map((h, i) => (
                 <button
                   key={i}
                   onClick={() => handleAsk(h)}
                   className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-[var(--bg-secondary)] transition-colors group"
                 >
                   <Clock className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
                   <span className="text-[var(--text-primary)]">{h}</span>
                 </button>
               ))}
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
