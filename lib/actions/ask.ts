"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { generateEmbedding, extractSearchableText } from "@/lib/ai/embeddings";
import { db } from "@/lib/drizzle/db";
import { entries, technologies, snippetEmbeddings } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { sql, desc, eq } from "drizzle-orm";

interface RetrievedSnippet {
  id: string;
  title: string;
  content: any;
  technologyName: string;
  similarity: number;
}

/**
 * Ask a question and get an answer based on your notes
 * Uses RAG: Retrieval-Augmented Generation
 */
export async function askQuestion(question: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!question || question.trim().length === 0) {
    throw new Error("Question is required");
  }

  try {
    // Step 1: Generate embedding for the question
    const questionEmbedding = await generateEmbedding(question);
    const embeddingVector = `[${questionEmbedding.join(',')}]`;

    // Step 2: Retrieve top 5 most relevant snippets
    const relevantSnippets = await db
      .select({
        id: entries.id,
        title: entries.title,
        content: entries.content,
        technologyName: technologies.name,
        similarity: sql<number>`1 - (${snippetEmbeddings.embedding} <=> ${embeddingVector}::vector)`,
      })
      .from(entries)
      .innerJoin(technologies, eq(entries.technologyId, technologies.id))
      .innerJoin(snippetEmbeddings, eq(entries.id, snippetEmbeddings.entryId))
      .where(eq(entries.userId, user.id))
      .orderBy(desc(sql`1 - (${snippetEmbeddings.embedding} <=> ${embeddingVector}::vector)`))
      .limit(5);

    // Step 3: Filter by similarity threshold (>0.6)
    const filteredSnippets = relevantSnippets.filter(s => s.similarity > 0.6);

    if (filteredSnippets.length === 0) {
      return {
        answer: "I couldn't find any relevant notes to answer this question. Try asking about topics you've saved in your snippets.",
        snippetCount: 0,
      };
    }

    // Step 4: Build context from snippets
    const context = filteredSnippets
      .map((snippet, i) => {
        const contentText = extractSearchableText(snippet.title, snippet.content);
        return `--- Note ${i + 1}: ${snippet.title} (${snippet.technologyName}) ---\n${contentText}`;
      })
      .join('\n\n');

    // Step 5: Create system and user prompts
    const systemPrompt = `You are a study assistant helping the user review their own notes.

Rules:
1. Answer using ONLY the provided notes
2. Be clear, concise, and educational
3. If the notes don't fully answer the question, say so honestly
4. Never add external knowledge or make assumptions
5. Use simple, friendly language
6. Format code snippets properly when relevant`;

    const userPrompt = `Question: ${question}

Your Notes:
${context}

Answer the question based strictly on these notes. If the notes don't contain enough information, say so.`;

    // Step 6: Generate response from Gemini
    const result = await generateText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.3, // Low temperature for deterministic answers
    });

    return {
      answer: result.text,
      snippetCount: filteredSnippets.length,
    };
  } catch (error) {
    console.error("Failed to answer question:", error);
    throw new Error("Failed to generate answer");
  }
}
