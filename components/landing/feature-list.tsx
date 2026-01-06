import { Check } from "lucide-react";

const features = [
  "Semantic Search",
  "Dark Mode Native",
  "Keyboard First",
  "Export Ownership",
  "Mobile Responsive",
  "Syntax Highlighting",
  "Graph Visualization",
  "Markdown Support",
  "Auto-saving",
];

export function FeatureList() {
  return (
    <section className="py-24 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]/10">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Battery Included</h2>
          <p className="text-[var(--text-muted)]">Everything you expect from a modern developer tool.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-green-500" />
              </div>
              <span className="text-[var(--text-primary)] font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
