"use client";

import { useState } from "react";
import { askQuestion } from "@/lib/actions/ask";
import { Send, Loader2, BookOpen, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [snippetCount, setSnippetCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer("");
    setSnippetCount(0);

    try {
      const result = await askQuestion(question);
      setAnswer(result.answer);
      setSnippetCount(result.snippetCount);
    } catch (error) {
      console.error("Failed to get answer:", error);
      setAnswer("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about your notes... (e.g., 'Explain hoisting in JavaScript')"
              className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 pr-12 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] resize-none"
              rows={3}
              disabled={isLoading}
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

        {/* Answer Display */}
        {(answer || isLoading) && (
          <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
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

        {/* Empty State */}
        {!answer && !isLoading && (
          <div className="text-center text-[var(--text-muted)] py-12">
            <p>Ask a question to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
