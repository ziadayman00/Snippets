"use server";

import { db } from "@/lib/drizzle/db";
import { entries } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { syncSnippetLinks } from "@/lib/actions/links";
import { upsertEmbedding } from "@/lib/actions/embeddings";

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
  
  // Default content for Tiptap if not provided
  const defaultContent = {
      type: "doc",
      content: [
          {
              type: "paragraph",
              content: []
          }
      ]
  };

  try {
     // Validate JSON content
    let contentJson = defaultContent;
    if (content) {
        try {
            contentJson = JSON.parse(content);
        } catch {
            throw new Error("Invalid content format");
        }
    }

    const [inserted] = await db.insert(entries).values({
      title,
      content: contentJson, // Store as JSON object
      technologyId,
      userId: user.id,
    }).returning({ id: entries.id });

    if (inserted) {
        await syncSnippetLinks(inserted.id, contentJson);
        // Generate AI embedding for semantic search
        await upsertEmbedding(inserted.id, title, contentJson);
    }

    revalidatePath(`/technology/${technologyId}`);
    revalidatePath("/dashboard");
    
    // If successfully inserted, we can redirect or return success. 
    // Since QuickCreate uses this, we might want to redirect.
    // However, if normal create uses this, checks if it expects a redirect.
    // But normal create is usually on a separate page or modal.
    // Let's redirect if inserted.
    if (inserted) {
        redirect(`/technology/${technologyId}/edit/${inserted.id}`);
    }

  } catch (error) {
    // Redirect throws an error (NEXT_REDIRECT), so we must catch it and re-throw if it is a redirect error.
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        throw error;
    }
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
    let contentJson;
    try {
        contentJson = JSON.parse(content);
    } catch {
        throw new Error("Invalid content format");
    }

    await db.update(entries)
        .set({
            title,
            content: contentJson,
            updatedAt: new Date(),
        })
        .where(eq(entries.id, id));
    
    await syncSnippetLinks(id, contentJson);
    // Update AI embedding for semantic search
    await upsertEmbedding(id, title, contentJson);

    revalidatePath(`/technology/${technologyId}`);
  } catch (error) {
    console.error("Failed to update entry:", error);
    throw new Error("Failed to update entry");
  }
  
  redirect(`/technology/${technologyId}`);
}
