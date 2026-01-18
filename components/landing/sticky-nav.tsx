"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { FeaturesDropdown } from "./features-dropdown";

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
        className={`container mx-auto transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] relative ${
          isScrolled
            ? "w-[calc(100%-2rem)] md:w-full max-w-5xl rounded-full border border-white/10 bg-black/60 backdrop-blur-md shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] px-6 py-3 cursor-pointer md:cursor-default"
            : "px-4 border border-transparent"
        } ${isMobileMenuOpen && isScrolled ? "!rounded-[24px] !bg-[#0A0A0A] !py-6" : ""}`} 
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
              className="h-7 w-auto"
            />
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <FeaturesDropdown />
            <Link
              href="/pricing"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5"
            >
              Docs
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5"
            >
              About
            </Link>
          </div>

          <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
             {/* Separator */}
            <div className={`hidden md:block h-5 w-px bg-white/10 transition-opacity ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* CTA */}
            {isAuthenticated ? (
                <Link
                href="/dashboard"
                className={`text-sm font-medium transition-all ${
                    isScrolled && !isMobileMenuOpen
                    ? "rounded-full bg-white text-black px-6 py-2 hover:bg-zinc-200 shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
                >
                Dashboard
                </Link>
            ) : (
                <Link
                href="/login"
                className={`text-sm font-medium transition-all ${
                    isScrolled && !isMobileMenuOpen
                    ? "rounded-full bg-white text-black px-6 py-2 hover:bg-zinc-200 shadow-sm"
                    : "text-zinc-400 hover:text-white"
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
                <div className="py-2">
                    <div className="text-[10px] uppercase font-bold text-[var(--accent-primary)] px-2 mb-2">Features</div>
                    <Link
                        href="/features/editor"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors block p-2 hover:bg-[var(--bg-secondary)] rounded-md pl-4"
                    >
                        Unified Editor
                    </Link>
                    <Link
                        href="/features/knowledge-graph"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors block p-2 hover:bg-[var(--bg-secondary)] rounded-md pl-4"
                    >
                        Knowledge Graph
                    </Link>
                    <Link
                        href="/features/ai"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors block p-2 hover:bg-[var(--bg-secondary)] rounded-md pl-4"
                    >
                        Ask AI
                    </Link>
                </div>
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
                 {/* Changelog removed as requested */}
             </div>
        </div>
      </div>
    </nav>
  );
}
