"use server";

import { db } from "@/lib/drizzle/db";
import { users } from "@/lib/drizzle/schema";
import { eq, sql, desc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserRole(targetUserId: string, newRole: "user" | "admin") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify the requester is an admin
  const [requester] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!requester || requester.role !== "admin") {
    return { success: false, error: "Forbidden: Admins only" };
  }

  try {
    await db
      .update(users)
      .set({ role: newRole })
      .where(eq(users.id, targetUserId));

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { success: false, error: "Failed to update role" };
  }
}

export async function getUsers({
  page = 1,
  limit = 10,
  query = "",
  role = "",
}: {
  page?: number;
  limit?: number;
  query?: string;
  role?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: [], total: 0, pageCount: 0 };

  // Verify Admin
  const [dbUser] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!dbUser || dbUser.role !== "admin") {
    return { data: [], total: 0, pageCount: 0 };
  }

  const offset = (page - 1) * limit;

  // Build conditions
  const conditions = [];
  if (query) {
    conditions.push(sql`${users.email} ILIKE ${`%${query}%`}`);
  }
  if (role && role !== "all") {
    conditions.push(eq(users.role, role as "user" | "admin"));
  }

  const whereClause = conditions.length > 0 
    ? sql.join(conditions, sql` AND `) 
    : undefined;

  // Fetch Data
  const data = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(whereClause)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);

  // Fetch Total Count
  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(whereClause);

  const total = countResult.count;
  const pageCount = Math.ceil(total / limit);

  return { data, total, pageCount };
}
