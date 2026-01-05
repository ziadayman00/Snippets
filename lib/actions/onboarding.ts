"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/drizzle/db";
import { technologies, entries } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { upsertEmbedding } from "./embeddings";
import { revalidatePath } from "next/cache";

const SAMPLE_DATA = [
  {
    tech: { name: "JavaScript", slug: "javascript", icon: "code" },
    snippet: {
      title: "Understanding Hoisting",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Hoisting is a mechanism in JavaScript where variable and function declarations are moved to the top of their scope before code execution.",
              },
            ],
          },
          {
            type: "codeBlock",
            attrs: { language: "javascript" },
            content: [
              {
                type: "text",
                text: "console.log(x); // undefined\nvar x = 5;\n\n// Function declarations are also hoisted\nsayHello(); // 'Hello!'\n\nfunction sayHello() {\n  console.log('Hello!');\n}",
              },
            ],
          },
        ],
      },
    },
  },
  {
    tech: { name: "CSS", slug: "css", icon: "palette" },
    snippet: {
      title: "Centering with Flexbox",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "The easiest way to center an element both vertically and horizontally.",
              },
            ],
          },
          {
            type: "codeBlock",
            attrs: { language: "css" },
            content: [
              {
                type: "text",
                text: ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}",
              },
            ],
          },
        ],
      },
    },
  },
  {
    tech: { name: "Git", slug: "git", icon: "git-branch" },
    snippet: {
      title: "Git Rebase Interactive",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Use interactive rebase to clean up your commit history before merging.",
              },
            ],
          },
          {
            type: "codeBlock",
            attrs: { language: "bash" },
            content: [
              {
                type: "text",
                text: "# Start interactive rebase for last 3 commits\ngit rebase -i HEAD~3\n\n# Commands:\n# p, pick = use commit\n# r, reword = use commit, but edit the commit message\n# s, squash = use commit, but meld into previous commit",
              },
            ],
          },
        ],
      },
    },
  },
];

export async function createSampleData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    for (const item of SAMPLE_DATA) {
      // 1. Create or Get Technology
      let techId: string;
      const existingTech = await db
        .select()
        .from(technologies)
        .where(eq(technologies.name, item.tech.name))
        .limit(1);

      if (existingTech.length > 0) {
        techId = existingTech[0].id;
      } else {
        const [newTech] = await db
          .insert(technologies)
          .values({
            name: item.tech.name,
            slug: item.tech.slug,
            icon: item.tech.icon,
            userId: user.id,
          })
          .returning();
        techId = newTech.id;
      }

      // 2. Create Snippet
      const [newSnippet] = await db
        .insert(entries)
        .values({
          title: item.snippet.title,
          content: item.snippet.content,
          technologyId: techId,
          userId: user.id,
        })
        .returning();

      // 3. Generate Embedding
      await upsertEmbedding(newSnippet.id, item.snippet.title, item.snippet.content);
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to create sample data:", error);
    return { success: false, error: "Failed to create sample snippets" };
  }
}
