"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

interface StickyNavProps {
  isAuthenticated: boolean;
}

export function StickyNav({ isAuthenticated }: StickyNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      if (window.scrollY <= 100) setIsMobileMenuOpen(false); // Close when filtering back to top
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (navRef.current && !navRef.current.contains(event.target as Node)) {
            setIsMobileMenuOpen(false);
        }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        window.removeEventListener("scroll", handleScroll);
        document.removeEventListener("mousedown", handleClickOutside);
    };
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
        ref={navRef}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`container mx-auto px-6 transition-all duration-300 ease-in-out relative overflow-hidden ${
          isScrolled
            ? "w-[calc(100%-1rem)] md:w-full max-w-5xl rounded-[24px] border border-[var(--border-primary)] bg-[var(--bg-primary)]/95 backdrop-blur-sm shadow-lg px-6 py-3 cursor-pointer md:cursor-default"
            : "border border-transparent"
        } ${isMobileMenuOpen && isScrolled ? "!py-6 bg-[var(--bg-primary)]" : ""}`} 
      >
        <div className="flex items-center justify-between relative z-10">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/logo.svg" 
              alt="Snippets" 
              className="h-6 md:h-8 w-auto"
            />
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8" onClick={(e) => e.stopPropagation()}>
            <Link
              href="/about"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/changelog"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Changelog
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
          <div onClick={(e) => e.stopPropagation()}>
            {isAuthenticated ? (
                <Link
                href="/dashboard"
                className={`text-sm font-medium transition-all ${
                    isScrolled && !isMobileMenuOpen
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
                    isScrolled && !isMobileMenuOpen
                    ? "rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] px-4 py-2 hover:opacity-90"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
                >
                Sign In
                </Link>
            )}
           </div>
        </div>

        {/* Mobile Navigation Menu - Animated Height */}
        <div 
            className={`md:hidden grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isMobileMenuOpen ? "grid-rows-[1fr] opacity-100 pt-6" : "grid-rows-[0fr] opacity-0 pt-0"
            }`}
        >
             <div className="overflow-hidden flex flex-col gap-2">
                <Link
                    href="/about"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors block p-2 hover:bg-[var(--bg-secondary)] rounded-md"
                    >
                    About
                </Link>
                <Link
                    href="/pricing"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors block p-2 hover:bg-[var(--bg-secondary)] rounded-md"
                    >
                    Pricing
                </Link>
                <Link
                    href="/docs"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors block p-2 hover:bg-[var(--bg-secondary)] rounded-md"
                    >
                    Docs
                </Link>
                <Link
                    href="/changelog"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors block p-2 hover:bg-[var(--bg-secondary)] rounded-md"
                    >
                    Changelog
                </Link>
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors block p-2 hover:bg-[var(--bg-secondary)] rounded-md"
                >
                    GitHub
                </a>
             </div>
        </div>
      </div>
    </nav>
  );
}
