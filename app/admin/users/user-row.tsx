"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { updateUserRole } from "@/lib/actions/admin";
import { useTransition } from "react";
import { Loader2, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type UserRowProps = {
  user: {
    id: string;
    email: string;
    role: "user" | "admin" | string; // loose typing for db result
    createdAt: Date;
  };
};

export function UserRow({ user }: UserRowProps) {
  const [isPending, startTransition] = useTransition();

  const handleRoleToggle = () => {
    const newRole = user.role === "admin" ? "user" : "admin";
    
    // Optimistic / Transition
    startTransition(async () => {
      const result = await updateUserRole(user.id, newRole);
      
      if (result.success) {
        toast.success(`User role updated to ${newRole}`);
      } else {
        toast.error(result.error || "Failed to update role");
      }
    });
  };

  const isAdmin = user.role === "admin";

  return (
    <tr className="group border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors data-[state=selected]:bg-zinc-900">
      <TableCell className="font-mono text-xs text-zinc-500 group-hover:text-zinc-400 pl-6 h-14">
        {user.id}
      </TableCell>
      <TableCell className="text-zinc-200 font-medium h-14">
        {user.email}
      </TableCell>
      <TableCell className="h-14">
        <button 
            onClick={handleRoleToggle}
            disabled={isPending}
            className="focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-full"
        >
            <Badge 
                variant="outline"
                className={cn(
                  "cursor-pointer transition-all hover:scale-105 active:scale-95 gap-1.5 pl-1.5 pr-2.5 py-0.5 border-0",
                  isAdmin 
                    ? "bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 hover:bg-indigo-500/20" 
                    : "bg-zinc-800 text-zinc-400 ring-1 ring-inset ring-zinc-700 hover:bg-zinc-700"
                )}
            >
                {isPending ? (
                   <Loader2 className="w-3 h-3 animate-spin" />
                ) : isAdmin ? (
                   <Shield className="w-3 h-3" />
                ) : (
                   <User className="w-3 h-3" />
                )}
                <span className="capitalize">{user.role}</span>
            </Badge>
        </button>
      </TableCell>
      <TableCell className="text-zinc-500 text-right font-mono text-xs h-14">
        {new Date(user.createdAt).toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })}
      </TableCell>
      <TableCell className="text-right h-14 pr-6">
        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-zinc-300 transition-colors">
                <span className="sr-only">Actions</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 fill-current"
                >
                  <path d="M8 2C9.10457 2 10 2.89543 10 4C10 5.10457 9.10457 6 8 6C6.89543 6 6 5.10457 6 4C6 2.89543 6.89543 2 8 2Z" />
                  <path d="M8 14C6.89543 14 6 13.1046 6 12C6 10.8954 6.89543 10 8 10C9.10457 10 10 10.8954 10 12C10 13.1046 9.10457 14 8 14Z" />
                  <path d="M8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6Z" />
                </svg>
            </button>
        </div>
      </TableCell>
    </tr>
  );
}
