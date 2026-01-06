"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, ChevronRight, BookOpen } from "lucide-react";
import { DOCS_DATA, DocSection } from "@/lib/docs-data";
import { cn } from "@/lib/utils";

export function DocsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string>("");

  // Sticky Sidebar Logic: Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" } // Trigger when element is near top
    );

    DOCS_DATA.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Filter content based on search
  const filteredContent = useMemo(() => {
    if (!searchQuery) return DOCS_DATA;

    return DOCS_DATA.map(section => {
      // Check if main section matches
      const sectionMatches = section.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             section.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter subsections
      const matchingSubsections = section.subsections?.filter(sub => 
        sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.content.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];

      if (sectionMatches || matchingSubsections.length > 0) {
        return {
          ...section,
          subsections: matchingSubsections // Only show matching subsections if actively searching
        };
      }
      return null;
    }).filter(Boolean) as DocSection[];
  }, [searchQuery]);

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
        // Offset for sticky nav
        const y = element.getBoundingClientRect().top + window.scrollY - 140;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setActiveSection(id);
    }
  };

  return (
    <div className="container mx-auto px-6 max-w-6xl pb-24">
       {/* Search Bar - Sticky on Mobile */}
       <div className="sticky top-20 md:top-24 z-30 bg-[var(--bg-primary)]/95 backdrop-blur py-4 mb-8 -mx-6 px-6 md:mx-0 md:px-0">
          <div className="relative max-w-2xl mx-auto group">
                <div className="absolute inset-0 bg-[var(--accent-primary)]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full duration-500" />
                <div className="relative flex items-center bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-full px-5 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[var(--accent-primary)]/20 transition-all">
                    <Search className="h-5 w-5 text-[var(--text-muted)] mr-3 shrink-0" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search documentation..." 
                        className="bg-transparent border-none focus:outline-none w-full text-base placeholder:text-[var(--text-muted)]"
                    />
                     {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery("")}
                            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2"
                        >
                            Clear
                        </button>
                     )}
                </div>
            </div>
       </div>

       <div className="grid md:grid-cols-[280px_1fr] gap-12 lg:gap-20 relative">
          {/* Sidebar Navigation - Desktop Sticky */}
          <aside className="hidden md:block h-fit sticky top-48">
             <nav className="space-y-1">
                <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-4 px-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Contents
                </h4>
                {filteredContent.map((section) => (
                    <div key={section.id} className="relative group">
                         {/* Styles for active state line */}
                         <div className={cn(
                             "absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-[var(--border-primary)] transition-all duration-300",
                             activeSection === section.id ? "bg-[var(--accent-primary)] scale-y-100" : "scale-y-0 group-hover:scale-y-50"
                         )} />
                         
                        <a
                            href={`#${section.id}`}
                            onClick={(e) => scrollToSection(section.id, e)}
                            className={cn(
                                "block py-2 px-4 text-sm rounded-md transition-colors",
                                activeSection === section.id 
                                    ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/5 font-medium" 
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"
                            )}
                        >
                            {section.title}
                        </a>
                        
                        {/* Subsections Links (Only if active or searching) */}
                        {(activeSection === section.id || searchQuery) && section.subsections && (
                             <div className="ml-4 mt-1 border-l border-[var(--border-primary)] pl-2 space-y-1 animate-in slide-in-from-left-2 duration-200">
                                {section.subsections.map(sub => (
                                    <a 
                                        key={sub.id} 
                                        href={`#${sub.id}`}
                                        className="block py-1 px-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-sm"
                                        onClick={(e) => {
                                            // Handle subsection scroll if needed, for now scrolls to parent
                                            // or implement specific scroll logic
                                            e.preventDefault();
                                            const el = document.getElementById(sub.id); // Add IDs to subsection headers
                                            if (el) {
                                                const y = el.getBoundingClientRect().top + window.scrollY - 150;
                                                window.scrollTo({ top: y, behavior: 'smooth' });
                                            }
                                        }}
                                    >
                                        {sub.title}
                                    </a>
                                ))}
                             </div>
                        )}
                    </div>
                ))}

                {filteredContent.length === 0 && (
                    <div className="text-sm text-[var(--text-muted)] italic px-4 py-8">
                        No results found.
                    </div>
                )}
             </nav>
          </aside>

          {/* Main Content Area */}
          <div className="space-y-20 min-h-[500px]">
             {filteredContent.map((section) => {
                 const Icon = section.icon;
                 return (
                    <section 
                        key={section.id} 
                        id={section.id} 
                        className="scroll-mt-32 group"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-10 w-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-primary)] ring-1 ring-[var(--border-primary)] shadow-sm">
                                <Icon className="h-5 w-5" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {section.title}
                            </h2>
                        </div>
                        
                        <div className="prose prose-invert max-w-none text-[var(--text-secondary)] leading-relaxed text-lg mb-8">
                            <p>{section.content}</p>
                        </div>

                        {/* Subsections Grid/List */}
                        {section.subsections && (
                            <div className="space-y-8 mt-8 border-t border-[var(--border-primary)]/50 pt-8">
                                {section.subsections.map((sub, index) => (
                                    <div key={sub.id} id={sub.id} className="scroll-mt-40">
                                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-[var(--text-primary)]">
                                            <span className="text-[var(--border-primary)] text-sm font-mono">0{index + 1}.</span>
                                            {sub.title}
                                        </h3>
                                        <p className="text-[var(--text-muted)] leading-relaxed">
                                            {sub.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                 );
             })}

             {filteredContent.length === 0 && (
                 <div className="text-center py-20 border border-dashed border-[var(--border-primary)] rounded-xl bg-[var(--bg-secondary)]/20">
                     <Search className="h-12 w-12 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
                     <h3 className="text-lg font-medium mb-2">No documentation found</h3>
                     <p className="text-[var(--text-muted)]">
                         Try adjusting your search terms or browsing the table of contents.
                     </p>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
}
