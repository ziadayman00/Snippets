"use client";

import { useState } from "react";
import { 
  BookOpen, Code2, Search, Sparkles, Zap, 
  CheckCircle2, ChevronDown, ChevronRight,
  Rocket, Shield, Clock, Crown, HelpCircle
} from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "getting-started", label: "Getting Started", icon: Rocket },
  { id: "features", label: "Core Features", icon: Zap },
  { id: "pro", label: "Pro Features", icon: Crown },
  { id: "best-practices", label: "Best Practices", icon: CheckCircle2 },
  { id: "faq", label: "FAQ", icon: HelpCircle },
];

const faqs = [
  {
    question: "How do I create my first snippet?",
    answer: "Click the '+ Create' button in the header, select a technology, and start typing. Use the rich text editor for documentation or add code blocks for actual code snippets."
  },
  {
    question: "What's the difference between semantic search and AI search?",
    answer: "Semantic search (⚡ Smart) finds your existing snippets by meaning, not just keywords. AI search (✨ Ask AI) lets you ask coding questions and get AI-generated answers with sources from your snippets."
  },
  {
    question: "How do usage limits work?",
    answer: "Free users get 50 snippets, 3 technologies, and 10 AI queries per month. Pro users get unlimited everything. Limits reset monthly."
  },
  {
    question: "Can I cancel my Pro subscription anytime?",
    answer: "Yes! You can cancel anytime from your billing page. You'll keep Pro access until the end of your billing period, then automatically downgrade to Free."
  },
  {
    question: "Is my data private?",
    answer: "Absolutely. All snippets are private by default with row-level security. Only you can access your data unless you explicitly share a snippet."
  },
];

export function DocsContent() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-1">
        <div className="sticky top-24 space-y-1">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            On This Page
          </p>
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-medium"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-16">
        {/* Getting Started */}
        <section id="getting-started" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-primary)]/10">
              <Rocket className="h-5 w-5 text-[var(--accent-primary)]" />
            </div>
            <h2 className="text-3xl font-bold">Getting Started</h2>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-[var(--text-muted)] mb-6">
              Get up and running with Snippets in less than 5 minutes.
            </p>

            <div className="space-y-6">
              <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-primary)] text-white text-sm font-bold">1</span>
                  Create Your First Technology
                </h3>
                <p className="text-[var(--text-muted)] mb-3">
                  Technologies are categories for your snippets (e.g., React, Python, Docker). Click the "+ Create" button in the header to add one.
                </p>
                <div className="rounded-md bg-[var(--bg-tertiary)] p-3 font-mono text-sm">
                  Example: Create "React" for your React snippets
                </div>
              </div>

              <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-primary)] text-white text-sm font-bold">2</span>
                  Add Your First Snippet
                </h3>
                <p className="text-[var(--text-muted)] mb-3">
                  Click on a technology card, then "+ New Entry". Choose a type (Smart Snippet, Pattern, Decision, etc.) and start writing.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="rounded-md bg-[var(--bg-tertiary)] p-2 text-sm">
                    <strong>Smart Snippet:</strong> Code with docs
                  </div>
                  <div className="rounded-md bg-[var(--bg-tertiary)] p-2 text-sm">
                    <strong>Pattern:</strong> Reusable solutions
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-primary)] text-white text-sm font-bold">3</span>
                  Try AI Search
                </h3>
                <p className="text-[var(--text-muted)] mb-3">
                  Click one of the AI suggestion cards on your dashboard or go to "Ask AI" to ask questions about coding concepts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-primary)]/10">
              <Zap className="h-5 w-5 text-[var(--accent-primary)]" />
            </div>
            <h2 className="text-3xl font-bold">Core Features</h2>
          </div>

          <div className="grid gap-6">
            <FeatureCard
              icon={Code2}
              title="Smart Snippet Editor"
              description="Powerful rich text editor with embedded code blocks. Write documentation and code in one place with syntax highlighting for 100+ languages."
            />
            <FeatureCard
              icon={Search}
              title="Semantic Search"
              description="Find snippets by meaning, not just keywords. Our smart search understands context and finds relevant snippets even if they don't contain your exact search terms."
              badge="⚡ Smart"
            />
            <FeatureCard
              icon={Sparkles}
              title="AI-Powered Q&A"
              description="Ask coding questions in natural language and get AI-generated answers with sources from your snippet library. Perfect for learning and quick reference."
              badge="✨ AI"
            />
            <FeatureCard
              icon={BookOpen}
              title="Collections"
              description="Organize snippets across different technologies into logical groups. Create collections for projects, tutorials, or any custom organization."
            />
            <FeatureCard
              icon={Clock}
              title="Spaced Repetition"
              description="Review snippets at optimal intervals to reinforce learning. The system tracks your progress and suggests snippets for review."
            />
          </div>
        </section>

        {/* Pro Features */}
        <section id="pro" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-primary)]/10">
              <Crown className="h-5 w-5 text-[var(--accent-primary)]" />
            </div>
            <h2 className="text-3xl font-bold">Pro Features</h2>
          </div>

          <div className="rounded-xl border border-[var(--accent-primary)]/30 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-[var(--text-muted)]">Unlock unlimited potential for just $9/month</p>
              </div>
              <Link
                href="/pricing"
                className="rounded-lg bg-[var(--accent-primary)] px-6 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Upgrade Now
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-lg mb-3">Free Tier</h4>
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <CheckCircle2 className="h-4 w-4" />
                  50 snippets
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <CheckCircle2 className="h-4 w-4" />
                  3 technologies
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <CheckCircle2 className="h-4 w-4" />
                  10 AI queries/month
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-lg mb-3 text-[var(--accent-primary)]">Pro Tier</h4>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-[var(--accent-primary)]" />
                  <strong>Unlimited</strong> snippets
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-[var(--accent-primary)]" />
                  <strong>Unlimited</strong> technologies
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-[var(--accent-primary)]" />
                  <strong>Unlimited</strong> AI queries
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-[var(--accent-primary)]" />
                  Priority support
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-primary)]/10">
              <CheckCircle2 className="h-5 w-5 text-[var(--accent-primary)]" />
            </div>
            <h2 className="text-3xl font-bold">Best Practices</h2>
          </div>

          <div className="space-y-6">
            <BestPracticeCard
              title="Organize by Technology First"
              description="Create technologies for your main programming languages and frameworks. This makes it easier to find snippets later."
              tips={[
                "Use specific names (e.g., 'React Hooks' instead of just 'React')",
                "Keep technologies focused on one topic",
                "Create new technologies as you learn new skills"
              ]}
            />
            <BestPracticeCard
              title="Write Descriptive Titles"
              description="Good titles make searching easier. Include the problem or use case in the title."
              tips={[
                "✅ Good: 'useLocalStorage - Persist state in localStorage'",
                "❌ Bad: 'Custom hook'",
                "Include keywords you'll remember later"
              ]}
            />
            <BestPracticeCard
              title="Use AI Search Effectively"
              description="Ask specific questions to get better answers from the AI."
              tips={[
                "Ask 'How do I...' or 'Explain...' questions",
                "Reference specific concepts from your snippets",
                "Use AI to connect ideas across different snippets"
              ]}
            />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-primary)]/10">
              <HelpCircle className="h-5 w-5 text-[var(--accent-primary)]" />
            </div>
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <span className="font-semibold">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronDown className="h-5 w-5 text-[var(--text-muted)]" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-[var(--text-muted)]" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 text-[var(--text-muted)]">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, badge }: { 
  icon: any; 
  title: string; 
  description: string; 
  badge?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 p-6 hover:border-[var(--accent-primary)]/30 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-primary)]/10">
          <Icon className="h-5 w-5 text-[var(--accent-primary)]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            {badge && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-semibold">
                {badge}
              </span>
            )}
          </div>
          <p className="text-[var(--text-muted)]">{description}</p>
        </div>
      </div>
    </div>
  );
}

function BestPracticeCard({ title, description, tips }: { 
  title: string; 
  description: string; 
  tips: string[];
}) {
  return (
    <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 p-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[var(--text-muted)] mb-4">{description}</p>
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
            <span className="text-[var(--accent-primary)] mt-0.5">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
