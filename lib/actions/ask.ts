"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { generateEmbedding, extractSearchableText } from "@/lib/ai/embeddings";
import { db } from "@/lib/drizzle/db";
import { entries, technologies, snippetEmbeddings } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { sql, desc, eq, and } from "drizzle-orm";

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
export async function askQuestion(question: string, contextEntryIds?: string[]) {
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

    // Step 2: Retrieve snippets
    // If contextEntryIds provided, fetch them specifically + top K relevant others
    
    let relevantSnippets: any[] = [];
    
    // A. Fetch specifically mentioned snippets (High Priority)
    if (contextEntryIds && contextEntryIds.length > 0) {
        const specificSnippets = await db
            .select({
                id: entries.id,
                title: entries.title,
                content: entries.content,
                technologyId: entries.technologyId,
                technologyName: technologies.name,
                similarity: sql<number>`1`, // Treat as 100% relevant
            })
            .from(entries)
            .innerJoin(technologies, eq(entries.technologyId, technologies.id))
            .where(and(eq(entries.userId, user.id), sql`${entries.id} IN ${contextEntryIds}`));
            
        relevantSnippets = [...specificSnippets];
    }

    // B. Semantic Search for others
    const semanticSnippets = await db
      .select({
        id: entries.id,
        title: entries.title,
        content: entries.content,
        technologyId: entries.technologyId,
        technologyName: technologies.name,
        similarity: sql<number>`1 - (${snippetEmbeddings.embedding} <=> ${embeddingVector}::vector)`,
      })
      .from(entries)
      .innerJoin(technologies, eq(entries.technologyId, technologies.id))
      .innerJoin(snippetEmbeddings, eq(entries.id, snippetEmbeddings.entryId))
      .where(
        and(
            eq(entries.userId, user.id),
            // Exclude already added snippets to avoid duplicates
            contextEntryIds && contextEntryIds.length > 0 ? sql`${entries.id} NOT IN ${contextEntryIds}` : undefined
        )
      )
      .orderBy(desc(sql`1 - (${snippetEmbeddings.embedding} <=> ${embeddingVector}::vector)`))
      .limit(5); // Reduce limit since we might have specific context

    relevantSnippets = [...relevantSnippets, ...semanticSnippets];

    // Step 3: Filter by similarity threshold (>0.6) for SEMANTIC results only?
    // Specific snippets are always kept.
    const filteredSnippets = relevantSnippets.filter(s => {
        if (contextEntryIds?.includes(s.id)) return true; // Always keep mentioned
        return s.similarity > 0.6;
    });

    if (filteredSnippets.length === 0) {
      return {
        answer: "I couldn't find any relevant notes to answer this question. Try asking about topics you've saved in your snippets.",
        snippetCount: 0,
        sources: [],
      };
    }

    // Step 4: Build context from snippets
    const context = filteredSnippets
      .map((snippet, i) => {
        const contentText = extractSearchableText(snippet.title, snippet.content);
        return `--- Note ${i + 1}: ${snippet.title} (${snippet.technologyName}) ---\n${contentText}`;
      })
      .join('\n\n');

    // ... (System and User prompts remain the same) ...
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
      sources: filteredSnippets.map(s => ({
        id: s.id,
        title: s.title,
        technologyId: s.technologyId,
        technologyName: s.technologyName,
        similarity: Math.round(s.similarity * 100),
      })),
    };
  } catch (error) {
    console.error("Failed to answer question:", error);
    throw new Error("Failed to generate answer");
  }
}

/**
 * Generate suggested questions based on user's notes
 */
export async function getSuggestedQuestions(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  try {
    // 1. Get 3 random snippets with content
    const randomSnippets = await db
      .select({
        title: entries.title,
        content: entries.content,
        technologyName: technologies.name,
      })
      .from(entries)
      .innerJoin(technologies, eq(entries.technologyId, technologies.id))
      .where(eq(entries.userId, user.id))
      .orderBy(sql`RANDOM()`)
      .limit(3);

    if (randomSnippets.length === 0) {
      return [
        "What is the difference between let and var?",
        "Explain the concept of closures",
        "How does the event loop work?",
      ];
    }

    // 2. Build context
    const context = randomSnippets
      .map((s) => {
        const text = extractSearchableText(s.title, s.content).slice(0, 500); // Limit context
        return `Topic: ${s.title} (${s.technologyName})\nContent: ${text}`;
      })
      .join("\n\n");

    // 3. Generate questions using Gemini
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: "You are a helpful study tool. Generate 3 short, specific questions based on the provided notes. The questions should test understanding of the concepts. Return ONLY the questions, one per line, without numbering or bullets.",
      prompt: `Notes:\n${context}\n\nGenerate 3 questions:`,
      temperature: 0.7, // Higher creativity for suggestions
    });

    // 4. Parse results
    return text
      .split("\n")
      .map((q) => q.replace(/^[0-9-.]+\s*/, "").trim()) // Remove numbering if model adds it
      .filter((q) => q.length > 0)
      .slice(0, 3);

  } catch (error) {
    console.error("Failed to generate suggestions:", error);
    // Fallback defaults
    return [
      "Explain the key concepts in my notes",
      "What topics should I review today?",
      "Summarize my recent learnings",
    ];
  }
}

/**
 * Generate follow-up questions based on the current Q&A
 */
export async function generateFollowUpQuestions(
  question: string,
  answer: string
): Promise<string[]> {
  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: "You are a helpful study assistant. Generate 3 short, specific follow-up questions based on the user's question and the answer provided. The follow-ups should help deepen understanding. Return ONLY the questions, one per line, without numbering.",
      prompt: `Question: ${question}\n\nAnswer: ${answer}\n\nGenerate 3 follow-up questions:`,
      temperature: 0.7,
    });

    return text
      .split("\n")
      .map((q) => q.replace(/^[0-9-.]+\s*/, "").trim())
      .filter((q) => q.length > 0)
      .slice(0, 3);
  } catch (error) {
    console.error("Failed to generate follow-ups:", error);
    return [];
  }
}
