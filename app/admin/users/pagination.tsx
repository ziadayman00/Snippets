"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginationControls({ pageCount }: { pageCount: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-sm font-medium text-zinc-500 min-w-[3rem] text-center font-mono">
        {currentPage} / {pageCount}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= pageCount}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
