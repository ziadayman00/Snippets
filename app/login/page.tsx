"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link"; 
import Image from "next/image";

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
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      
      {/* Visual Side (Left on Desktop) */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-12 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-[var(--accent-primary)]/10 blur-[100px] rounded-full pointer-events-none" />
         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

         <div className="relative z-10">
             <Link href="/" className="inline-block">
                <img src="/logo.svg" alt="Snippets" className="h-8 w-auto" />
             </Link>
         </div>

         <div className="relative z-10 max-w-lg">
             <div className="mb-8 p-6 rounded-2xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-primary)] backdrop-blur-sm shadow-xl">
                 <div className="flex gap-1.5 mb-4">
                     <div className="w-3 h-3 rounded-full bg-red-500/20" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                     <div className="w-3 h-3 rounded-full bg-green-500/20" />
                 </div>
                 <div className="font-mono text-sm leading-relaxed text-[var(--text-secondary)]">
                     <span className="text-purple-400">const</span> <span className="text-blue-400">vault</span> = <span className="text-yellow-400">new</span> <span className="text-green-400">KnowledgeBase</span>();<br/>
                     vault.<span className="text-blue-400">organize</span>(<span className="text-orange-400">'snippets'</span>);<br/>
                     vault.<span className="text-blue-400">sync</span>(<span className="text-orange-400">'brain'</span>);<br/>
                     <span className="text-[var(--text-muted)]">// Finally, a place for all my random code snippets.</span>
                 </div>
             </div>
             <blockquote className="text-xl font-medium leading-relaxed">
                 "Snippets transformed how I keep track of my development knowledge. It's the second brain I didn't know I needed."
             </blockquote>
             <div className="mt-4 flex items-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500" />
                 <div>
                     <div className="font-semibold">Alex Chen</div>
                     <div className="text-sm text-[var(--text-muted)]">Senior Frontend Engineer</div>
                 </div>
             </div>
         </div>

         <div className="relative z-10 text-sm text-[var(--text-muted)]">
             © 2026 Snippets Inc.
         </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 md:p-24 relative">
        <div className="absolute top-6 left-6 lg:hidden">
             <Link href="/" className="block">
                <img src="/logo.svg" alt="Snippets" className="h-8 w-auto" />
             </Link>
        </div>

        <div className="w-full max-w-sm space-y-8">
           <div className="space-y-2 text-center">
             <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
             <p className="text-[var(--text-muted)]">
               Enter your email to sign in or create an account.
             </p>
           </div>

           <form onSubmit={handleLogin} className="space-y-4">
             <div className="space-y-2">
               <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email address</label>
               <input
                 id="email"
                 type="email"
                 placeholder="name@example.com"
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 autoFocus
                 className="flex h-11 w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--text-primary)] disabled:opacity-50 transition-all"
                 disabled={loading}
               />
             </div>

             <button
               type="submit"
               disabled={loading || !email}
               className="group flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)] px-8 py-2 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 shadow-sm"
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
           
           <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[var(--border-primary)]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[var(--bg-primary)] px-2 text-[var(--text-muted)]">Protected by Magic Link</span>
                </div>
           </div>

           {message && (
             <div
               className={`rounded-md p-4 text-sm font-medium border flex items-center gap-2 animate-in slide-in-from-top-2 ${
                 message.type === "success"
                   ? "bg-green-500/10 border-green-500/20 text-green-500"
                   : "bg-red-500/10 border-red-500/20 text-red-500"
               }`}
             >
               {message.type === "success" && <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
               {message.text}
             </div>
           )}
           
           <p className="px-8 text-center text-sm text-[var(--text-muted)]">
              By clicking continue, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-[var(--text-primary)]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-[var(--text-primary)]">
                Privacy Policy
              </Link>
              .
            </p>
        </div>
      </div>
    </div>
  );
}
