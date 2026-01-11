import { getUsers } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserRow } from "./user-row";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { UserFilters } from "./user-filters";
import { PaginationControls } from "./pagination";

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; page?: string; role?: string }>;
}) {
    const params = await searchParams;
    const query = params.query || "";
    const page = Number(params.page) || 1;
    const role = params.role || "";

    const { data: users, total, pageCount } = await getUsers({
        page,
        limit: 10,
        query,
        role
    });

  return (
    <div className="flex flex-col h-full text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>
          <p className="text-zinc-400 mt-1">Manage system access and permissions.</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-1.5 text-xs font-mono text-zinc-500 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                {total} ACTIVE
             </div>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-lg shadow-indigo-500/20">
                Invite User
            </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-8 pb-6">
        <UserFilters />
      </div>

      {/* Table Area */}
      <div className="flex-1 px-8 pb-8 min-h-0 overflow-hidden">
        <div className="h-full flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden backdrop-blur-sm">
            <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                <Table>
                    <TableHeader className="bg-zinc-900/80 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
                        <TableRow className="hover:bg-transparent border-zinc-800">
                            <TableHead className="w-[300px] text-xs font-medium uppercase tracking-wider text-zinc-500 pl-6 h-12">User ID</TableHead>
                            <TableHead className="text-xs font-medium uppercase tracking-wider text-zinc-500 h-12">Email</TableHead>
                            <TableHead className="w-[150px] text-xs font-medium uppercase tracking-wider text-zinc-500 h-12">Role</TableHead>
                            <TableHead className="w-[150px] text-xs font-medium uppercase tracking-wider text-zinc-500 text-right h-12">Joined</TableHead>
                            <TableHead className="w-[50px] h-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <UserRow key={user.id} user={user} />
                        ))}
                        {users.length === 0 && (
                            <TableRow className="border-zinc-800">
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center text-zinc-500">
                                        <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4 border border-zinc-800">
                                            <Search className="h-5 w-5 opacity-40" />
                                        </div>
                                        <p className="font-medium text-zinc-300">No users found</p>
                                        <p className="text-sm mt-1">Try adjusting your search filters.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            
            {/* Footer / Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
                <div className="text-xs text-zinc-500 font-mono">
                    PAGE {page} OF {pageCount}
                </div>
                <PaginationControls pageCount={pageCount} />
            </div>
        </div>
      </div>
    </div>
  );
}
