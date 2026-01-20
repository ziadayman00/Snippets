"use server";

import { db } from "@/lib/drizzle/db";
import { plans, planCategories } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { eq, and, desc } from "drizzle-orm";

export async function createPlan(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  // Initialize with empty doc structure for Tiptap
  const emptyContent = {
    type: "doc",
    content: [
      {
        type: "paragraph",
      },
    ],
  };

  if (!title) {
    return { success: false, error: "Title is required" };
  }

  try {
    const [newPlan] = await db
      .insert(plans)
      .values({
        title,
        content: emptyContent,
        userId: user.id,
        isPublic: false,
      })
      .returning();

    revalidatePath("/plans");
    revalidatePath("/dashboard");
    return { success: true, data: newPlan };
  } catch (error) {
    console.error("Failed to create plan:", error);
    return { success: false, error: "Failed to create plan" };
  }
}

// ... (existing imports)

// ... existing createPlan ...

export async function updatePlan(id: string, data: Partial<typeof plans.$inferInsert>) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }
  
    try {
      await db
        .update(plans)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(plans.id, id), eq(plans.userId, user.id)));
  
      revalidatePath("/plans");
      revalidatePath(`/plans/${id}`);
      return { success: true };
    } catch (error) {
      console.error("Failed to update plan:", error);
      return { success: false, error: "Failed to update plan" };
    }
}

// ... existing deletePlan and savePlanContent ...

// Category Actions

export async function getCategories() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const categories = await db
    .select()
    .from(planCategories)
    .where(eq(planCategories.userId, user.id));
  
  return categories;
}

export async function createCategory(name: string, color: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const [newCategory] = await db
      .insert(planCategories)
      .values({
        name,
        color, // 'slate' | 'blue' | 'emerald' | 'amber' | 'rose' | 'violet'
        userId: user.id
      })
      .returning();
    
    return { success: true, data: newCategory };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "Failed to create category" };
  }
}


export async function deletePlan(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db
      .delete(plans)
      .where(and(eq(plans.id, id), eq(plans.userId, user.id)));

    revalidatePath("/plans");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete plan:", error);
    return { success: false, error: "Failed to delete plan" };
  }
}

export async function savePlanContent(id: string, content: any) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }
  
    try {
      await db
        .update(plans)
        .set({ content, updatedAt: new Date() })
        .where(and(eq(plans.id, id), eq(plans.userId, user.id)));
  
      revalidatePath(`/plans/${id}`);
      return { success: true };
    } catch (error) {
      console.error("Failed to save plan content:", error);
      return { success: false, error: "Failed to save content" };
    }
}
