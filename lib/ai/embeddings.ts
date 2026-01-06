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
/**
 * Extract searchable text from a snippet entry
 * Structures content with labels for better semantic understanding
 */
export function extractSearchableText(title: string, content: any): string {
  // Convert TipTap JSON to structured text
  const contentText = extractTextFromTiptap(content);
  
  // Structure the text for the embedding model
  return `Title: ${title}\n\n${contentText}`;
}

/**
 * Recursively extract text from TipTap JSON structure with context labels
 */
function extractTextFromTiptap(node: any): string {
  if (!node) return '';
  
  // If it's a code block, wrap it with language context
  if (node.type === 'codeBlock' && node.content) {
    const language = node.attrs?.language || 'code';
    const code = node.content.map((n: any) => n.text || '').join('\n');
    return `\nCode (${language}):\n${code}\n`;
  }
  
  // If it's a heading, make it distinct
  if (node.type === 'heading' && node.content) {
    const text = node.content.map((n: any) => n.text || '').join('');
    return `\nSection: ${text}\n`;
  }

  // Normal text
  if (node.type === 'text') {
    return node.text || '';
  }
  
  // Recursively process content array
  if (node.content && Array.isArray(node.content)) {
    return node.content.map((child: any) => extractTextFromTiptap(child)).join(' ');
  }
  
  return '';
}
