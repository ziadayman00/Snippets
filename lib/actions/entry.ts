"use server";

import { db } from "@/lib/drizzle/db";
import { entries } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { syncSnippetLinks } from "@/lib/actions/links";
import { upsertEmbedding } from "@/lib/actions/embeddings";
import { updateEntryTags } from "@/lib/actions/tags";

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
        // Handle tags
        const tagsString = formData.get("tags") as string;
        if (tagsString) {
            try {
                const tagNames = JSON.parse(tagsString) as string[];
                await updateEntryTags(inserted.id, tagNames);
            } catch (e) {
                console.error("Failed to parse tags", e);
            }
        }

        await syncSnippetLinks(inserted.id, contentJson);
        // Generate AI embedding for semantic search
        await upsertEmbedding(inserted.id, title, contentJson);
    }

    revalidatePath(`/technology/${technologyId}`);
    revalidatePath("/dashboard");
    
    // Return the entry ID so the caller can handle navigation
    return { success: true, entryId: inserted?.id };

  } catch (error) {
    console.error("Failed to create entry:", error);
    throw new Error("Failed to create entry");
  }
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
    
    // Handle tags
    const tagsString = formData.get("tags") as string;
    if (tagsString) {
        try {
            const tagNames = JSON.parse(tagsString) as string[];
            await updateEntryTags(id, tagNames);
        } catch (e) {
            console.error("Failed to parse tags", e);
        }
    }

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

export async function autoSaveEntry(id: string, technologyId: string, title: string, content: any, tagNames: string[]) {
    // Exact same logic as updateEntry but no redirect
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    try {
        await db.update(entries)
            .set({
                title,
                content,
                updatedAt: new Date(),
            })
            .where(eq(entries.id, id));
        
        await updateEntryTags(id, tagNames);
        await syncSnippetLinks(id, content);
        await upsertEmbedding(id, title, content);

        // revalidatePath(`/technology/${technologyId}`); // Avoid refreshing page on auto-save
        return { success: true, timestamp: new Date() };
    } catch (error) {
        console.error("Auto-save failed:", error);
        return { success: false };
    }
}

export async function toggleEntryPin(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const isPinned = formData.get("isPinned") === "true";
  const technologyId = formData.get("technologyId") as string;

  try {
    await db.update(entries)
      .set({ isPinned: !isPinned })
      .where(eq(entries.id, id));
      
    revalidatePath(`/technology/${technologyId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle pin:", error);
    return { success: false, error: "Failed to toggle pin" };
  }
}
