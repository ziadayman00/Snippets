import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-primary)] p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] mb-6">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h2 className="mb-2 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
        Page Not Found
      </h2>
      <p className="mb-8 max-w-[400px] text-[var(--text-muted)]">
        The page you are looking for doesn't exist or has been moved. 
        Please check the URL or go back home.
      </p>
      <Link
        href="/"
        className="rounded-full bg-[var(--text-primary)] px-8 py-3 text-sm font-semibold text-[var(--bg-primary)] transition-opacity hover:opacity-90"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
