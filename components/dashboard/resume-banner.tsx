import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

interface ResumeBannerProps {
  entry: {
    id: string;
    title: string;
    technologyId: string;
    technologyName: string;
    lastViewedAt: Date | null;
  };
}

export function ResumeBanner({ entry }: ResumeBannerProps) {
  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-[var(--accent-primary)]/20 bg-gradient-to-r from-[var(--accent-primary)]/10 to-transparent p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 text-[var(--accent-primary)] mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Pick up where you left off</span>
           </div>
           <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-1">
              Resume working on <span className="text-[var(--text-primary)]">{entry.title}</span>
           </h2>
           <p className="text-sm text-[var(--text-secondary)]">
              {entry.technologyName} • Last edited recently
           </p>
        </div>

        <Link
          href={`/technology/${entry.technologyId}/edit/${entry.id}`}
          className="group flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-primary)]/20 transition-all hover:shadow-[var(--accent-primary)]/40 hover:-translate-y-0.5"
        >
          <span>Continue Editing</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
