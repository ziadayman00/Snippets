"use client";

import { Code2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StickyNavProps {
  isAuthenticated: boolean;
}

export function StickyNav({ isAuthenticated }: StickyNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3"
          : "py-6"
      }`}
    >
      <div
        className={`container mx-auto px-6 transition-all duration-300 ${
          isScrolled
            ? "max-w-5xl rounded-full border border-[var(--border-primary)] bg-[var(--bg-primary)]/95 backdrop-blur-sm shadow-lg px-6 py-3"
            : "border border-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity"
          >
            <Code2 className="h-6 w-6" />
            <span>Snippets</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/about"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              About
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Docs
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* CTA */}
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-all ${
                isScrolled
                  ? "rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] px-4 py-2 hover:opacity-90"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className={`text-sm font-medium transition-all ${
                isScrolled
                  ? "rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] px-4 py-2 hover:opacity-90"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
