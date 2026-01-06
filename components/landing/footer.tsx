import Link from "next/link";
import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-primary)] py-12 bg-[var(--bg-secondary)]/10">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg tracking-tight mb-3">
              <Code2 className="h-5 w-5" />
              <span>Snippets</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Your programming knowledge vault.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <ul className="space-y-2 text-sm">
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
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
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

          {/* Get Started */}
          <div>
            <h3 className="font-semibold mb-3">Get Started</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border-primary)] pt-8 text-center text-sm text-[var(--text-muted)]">
          <p>&copy; {new Date().getFullYear()} Snippets. Built for developers.</p>
        </div>
      </div>
    </footer>
  );
}
