import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]/5 overflow-hidden">
        
        <div className="container mx-auto px-6 py-16 relative z-10">
            {/* Large CTA Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 pb-16 border-b border-[var(--border-primary)]/50">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                        Ready to build your brain?
                    </h2>
                    <p className="text-[var(--text-muted)] text-lg">
                        Start organizing your snippets today.
                    </p>
                </div>
                <Link
                    href="/login"
                    className="h-12 px-8 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold flex items-center gap-2 hover:opacity-90 transition-all"
                >
                    Get Started for Free
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Brand */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                <img 
                    src="/logo.svg" 
                    alt="Snippets" 
                    className="h-8 w-auto"
                />
                </div>
                <p className="text-sm text-[var(--text-muted)] max-w-xs">
                The intelligent knowledge vault for developers. Store, query, and chat with your code.
                </p>
            </div>

            {/* Product */}
            <div>
                <h3 className="font-semibold mb-4 text-[var(--text-primary)]">Product</h3>
                <ul className="space-y-3 text-sm">
                <li>
                    <Link href="/about" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    About
                    </Link>
                </li>
                <li>
                    <Link href="/docs" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    Documentation
                    </Link>
                </li>
                <li>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    GitHub
                    </a>
                </li>
                </ul>
            </div>

            {/* Legal */}
            <div>
                <h3 className="font-semibold mb-4 text-[var(--text-primary)]">Legal</h3>
                <ul className="space-y-3 text-sm">
                <li>
                    <Link href="/privacy" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    Privacy Policy
                    </Link>
                </li>
                <li>
                    <Link href="/terms" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    Terms of Service
                    </Link>
                </li>
                </ul>
            </div>

            {/* Social / Contact */}
            <div>
                <h3 className="font-semibold mb-4 text-[var(--text-primary)]">Connect</h3>
                <ul className="space-y-3 text-sm">
                <li>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                        Twitter / X
                    </a>
                </li>
                <li>
                    <a href="mailto:hello@snippets.dev" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                        hello@snippets.dev
                    </a>
                </li>
                </ul>
            </div>
            </div>

            <div className="border-t border-[var(--border-primary)]/50 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-[var(--text-muted)]">
            <p>&copy; {new Date().getFullYear()} Snippets Inc. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>All systems operational</span>
            </div>
            </div>
        </div>
    </footer>
  );
}
