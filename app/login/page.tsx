"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Loader2, ArrowRight, Code2 } from "lucide-react";
import Link from "next/link"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage({ 
        text: error.message, 
        type: "error" 
      });
    } else {
      setMessage({
        text: "Magic link sent! Check your inbox.",
        type: "success",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Brand Logo */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
          <Code2 className="h-6 w-6" />
          <span>Snippets</span>
        </Link>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl font-bold tracking-tight">Login</h1>
            <p className="text-[var(--text-secondary)]">
              Enter your email to access your snippets.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <input
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                className="flex h-10 w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--text-primary)] disabled:opacity-50 transition-colors"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="group flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)] px-4 py-2 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Continue with Email</span>
                  <ArrowRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {message && (
            <div
              className={`rounded-md p-3 text-sm border ${
                message.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-500"
                  : "bg-red-500/10 border-red-500/20 text-red-500"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
