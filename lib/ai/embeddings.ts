import { google } from '@ai-sdk/google';
import { embed, embedMany } from 'ai';

/**
 * Generate embedding for a single text using Gemini
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: google.textEmbeddingModel('text-embedding-004'),
    value: text,
  });
  
  return embedding;
}

/**
 * Generate embeddings for multiple texts
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: google.textEmbeddingModel('text-embedding-004'),
    values: texts,
  });
  
  return embeddings;
}

/**
 * Extract searchable text from a snippet entry
 * Combines title and content for better semantic search
 */
export function extractSearchableText(title: string, content: any): string {
  // Convert TipTap JSON to plain text
  const contentText = extractTextFromTiptap(content);
  
  // Combine title (weighted more) with content
  return `${title}\n\n${contentText}`;
}

/**
 * Recursively extract text from TipTap JSON structure
 */
function extractTextFromTiptap(node: any): string {
  if (!node) return '';
  
  // If it's a text node, return the text
  if (node.type === 'text') {
    return node.text || '';
  }
  
  // If it's a code block, extract the code
  if (node.type === 'codeBlock' && node.content) {
    return node.content.map((n: any) => extractTextFromTiptap(n)).join('\n');
  }
  
  // Recursively process content array
  if (node.content && Array.isArray(node.content)) {
    return node.content.map((child: any) => extractTextFromTiptap(child)).join(' ');
  }
  
  return '';
}
