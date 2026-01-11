"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserFilters() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    
    const query = searchParams.get("query")?.toString();

    const handleSearch = (term: string) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set("query", term);
      } else {
        params.delete("query");
      }
      params.set("page", "1");
  
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    };
    
    const clearSearch = () => handleSearch("");
  
    return (
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search users by email..."
            onChange={(e) => handleSearch(e.target.value)}
            value={query || ""}
            className="pl-9 h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:bg-zinc-900 focus:ring-indigo-500/20 transition-all rounded-lg"
          />
          {query && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                  <X className="h-4 w-4" />
              </button>
          )}
        </div>
        
        <Button variant="outline" className="h-10 gap-2 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 bg-transparent">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
        </Button>
      </div>
    );
  }
