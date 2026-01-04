"use server";

import { db } from "@/lib/drizzle/db";
import { entries } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEntry(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const technologyId = formData.get("technologyId") as string;

  if (!title || title.trim().length === 0) {
    throw new Error("Title is required");
  }
  
  if (!content) {
      throw new Error("Content is required");
  }

  try {
     // Validate JSON content
    try {
        JSON.parse(content);
    } catch {
        throw new Error("Invalid content format");
    }

    await db.insert(entries).values({
      title,
      content: JSON.parse(content), // Store as JSON object
      technologyId,
      userId: user.id,
    });

    revalidatePath(`/technology/${technologyId}`);
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to create entry:", error);
    throw new Error("Failed to create entry");
  }
  
  return { success: true };
}

export async function deleteEntry(id: string, technologyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    await db.delete(entries).where(eq(entries.id, id));
    revalidatePath(`/technology/${technologyId}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete entry:", error);
    throw new Error("Failed to delete entry");
  }
}

export async function updateEntry(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("entryId") as string;
  const technologyId = formData.get("technologyId") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!id || !technologyId) {
      throw new Error("Missing required IDs");
  }

  if (!title || title.trim().length === 0) {
    throw new Error("Title is required");
  }
  
  if (!content) {
      throw new Error("Content is required");
  }

  try {
     // Validate JSON content
    try {
        JSON.parse(content);
    } catch {
        throw new Error("Invalid content format");
    }

    await db.update(entries)
        .set({
            title,
            content: JSON.parse(content),
            updatedAt: new Date(),
        })
        .where(eq(entries.id, id));

    revalidatePath(`/technology/${technologyId}`);
  } catch (error) {
    console.error("Failed to update entry:", error);
    throw new Error("Failed to update entry");
  }
  
  redirect(`/technology/${technologyId}`);
}
