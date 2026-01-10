import { TechCard } from "@/components/dashboard/tech-card";
import { OnboardingCard } from "@/components/dashboard/onboarding-card";

interface LibrarySectionProps {
  technologies: any[];
}

export function LibrarySection({ technologies }: LibrarySectionProps) {
  return (
    <section id="dashboard-library">
      <div className="flex items-center gap-2 mb-6 text-[var(--text-muted)]">
        <div className="h-4 w-4 flex items-center justify-center">
          <div className="h-3.5 w-[1px] bg-current opacity-50 rotate-12" />
        </div>
        <h2 className="text-sm font-bold uppercase tracking-widest">Library</h2>
      </div>

      {technologies.length === 0 ? (
        <OnboardingCard />
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {technologies.map((tech) => (
            <TechCard
              key={tech.id}
              id={tech.id}
              name={tech.name}
              count={tech.entriesCount}
              icon={tech.icon}
            />
          ))}
        </div>
      )}
    </section>
  );
}
