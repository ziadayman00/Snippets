"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User as UserIcon, Loader2, Sparkles, BookOpen, AlertCircle } from "lucide-react";
import { askQuestion } from "@/lib/actions/ask";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
  sources?: {
    id: string;
    title: string;
    technologyName: string;
    similarity: number;
  }[];
}

export function ChatInterface() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: query.trim(),
      id: Date.now().toString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const result = await askQuestion(userMessage.content);
      
      const aiMessage: Message = {
        role: "assistant",
        content: result.answer,
        id: (Date.now() + 1).toString(),
        sources: result.sources,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Ask error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        id: (Date.now() + 1).toString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Focus input again after turn
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto w-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6 ring-1 ring-amber-500/30">
              <Sparkles className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Ask your knowledge base</h2>
            <p className="text-[var(--text-secondary)] max-w-md">
              I can answer questions based on your saved snippets and notes. 
              Try asking about a specific technology or concept you've documented.
            </p>
          </div>
        ) : (
          <div className="space-y-8 pb-4">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Avatar */}
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-amber-500" />
                  </div>
                )}

                {/* Bubble */}
                <div className={`flex flex-col max-w-[85%] md:max-w-[75%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div 
                        className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user" 
                            ? "bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-tr-sm" 
                            : "bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-tl-sm"
                        }`}
                    >
                        {msg.role === "assistant" ? (
                             <ReactMarkdown components={{
                                code: ({node, ...props}) => <code className="bg-black/30 rounded px-1 py-0.5 text-xs font-mono" {...props} />
                             }}>
                                {msg.content}
                             </ReactMarkdown>
                        ) : (
                            msg.content
                        )}
                    </div>

                    {/* Sources (Citations) */}
                    {msg.sources && msg.sources.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                             {msg.sources.map((source, i) => (
                                <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-primary)]/50 text-xs text-[var(--text-secondary)] hover:border-amber-500/30 hover:text-[var(--text-primary)] transition-colors cursor-help" title={`Relevance: ${source.similarity}%`}>
                                    <BookOpen className="w-3 h-3 text-amber-500/70" />
                                    <span className="truncate max-w-[150px]">{source.title}</span>
                                </div>
                             ))}
                        </div>
                    )}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center shrink-0 mt-1">
                    <UserIcon className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                )}
              </motion.div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4 justify-start"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-muted)]">Thinking...</span>
                    </div>
                 </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--bg-primary)]/80 backdrop-blur-md sticky bottom-0 z-10">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-center gap-2">
            <div className="relative flex-1 group">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a question about your snippets..."
                    disabled={isLoading}
                    className="w-full h-12 bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] border border-[var(--border-primary)] rounded-xl px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all disabled:opacity-50"
                />
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/50 group-focus-within:text-amber-500 transition-colors" />
            </div>
            
            <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="h-12 w-12 flex items-center justify-center rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Send className="w-5 h-5" />
                )}
            </button>
        </form>
        <p className="text-[10px] text-center text-[var(--text-muted)] mt-2">
            AI can make mistakes. Verify important information from your original snippets.
        </p>
      </div>
    </div>
  );
}
