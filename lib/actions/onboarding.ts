"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/drizzle/db";
import { entries, technologies } from "@/lib/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { SAMPLE_SNIPPETS } from "@/lib/sample-data/snippets";

/**
 * Creates sample snippets for new users
 * Prevents duplicates by checking if user already has entries
 */
export async function createSampleSnippets() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    // Check if user already has snippets
    const existingEntries = await db
      .select()
      .from(entries)
      .where(eq(entries.userId, user.id))
      .limit(1);

    if (existingEntries.length > 0) {
      return { success: false, message: "You already have snippets" };
    }

    // Create sample technologies if they don't exist
    const techNames = ["React", "Python", "Docker"];
    const createdTechs: Record<string, string> = {};

    for (const techName of techNames) {
      // Check if technology exists for this user
      const [existing] = await db
        .select()
        .from(technologies)
        .where(
          and(
            eq(technologies.userId, user.id),
            eq(technologies.name, techName)
          )
        )
        .limit(1);

      if (existing) {
        createdTechs[techName] = existing.id;
      } else {
        // Create technology
        const [newTech] = await db
          .insert(technologies)
          .values({
            userId: user.id,
            name: techName,
            slug: techName.toLowerCase(),
          })
          .returning();

        createdTechs[techName] = newTech.id;
      }
    }

    // Create sample entries
    for (const sample of SAMPLE_SNIPPETS) {
      const techId = createdTechs[sample.technology];

      await db.insert(entries).values({
        userId: user.id,
        technologyId: techId,
        title: sample.title,
        content: sample.content,
      });
    }

    revalidatePath("/dashboard");
    return { success: true, message: "Sample snippets created!" };
  } catch (error) {
    console.error("Failed to create sample snippets:", error);
    throw new Error("Failed to create sample snippets");
  }
}
