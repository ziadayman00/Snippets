import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

interface ReviewCardProps {
  count: number;
}

export function ReviewCard({ count }: ReviewCardProps) {
  if (count === 0) return null;

  return (
    <Link
      href="/review"
      className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-[var(--accent-primary)]/30 bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--bg-secondary)] p-6 transition-all duration-300 hover:border-[var(--accent-primary)]/50 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 h-24 w-24 rounded-full bg-[var(--accent-primary)]/10 blur-2xl transition-opacity opacity-50 group-hover:opacity-100" />

      <div className="relative flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-primary)]/20">
          <Clock className="h-6 w-6 text-[var(--accent-primary)]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
            Review Time
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {count} {count === 1 ? "snippet" : "snippets"} ready for review
          </p>
        </div>
      </div>

      <ArrowRight className="relative h-5 w-5 text-[var(--accent-primary)] transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
