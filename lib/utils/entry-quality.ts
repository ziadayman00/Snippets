/**
 * Entry Quality Utility
 * 
 * Provides a simple heuristic to determine if an entry is "well-structured".
 * This is used for quiet positive reinforcement, not grading or scoring.
 */

interface EntryData {
  title: string;
  tags: string[];
  content: any; // JSON or string
}

export interface QualityResult {
  isWellStructured: boolean;
  missingElements: string[];
  metrics: {
    wordCount: number;
    codeBlockCount: number;
  };
}

/**
 * Calculate word count from TipTap JSON
 */
function getCalculatedMetrics(content: any): { wordCount: number; codeBlockCount: number } {
  let wordCount = 0;
  let codeBlockCount = 0;

  const traverse = (node: any) => {
    if (node.type === 'text' && node.text) {
      wordCount += node.text.split(/\s+/).filter((w: string) => w.length > 0).length;
    }
    
    if (node.type === 'codeBlock') {
      codeBlockCount++;
      // Don't count words inside code blocks for prose metrics
      return; 
    }

    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  };

  if (typeof content === 'string') {
    try {
      traverse(JSON.parse(content));
    } catch {
      // Fallback for plain string
      wordCount = content.split(/\s+/).length;
    }
  } else {
    traverse(content);
  }

  return { wordCount, codeBlockCount };
}

/**
 * Determine if an entry is well-structured based on simple rules:
 * 1. Has a meaningful title (> 5 chars)
 * 2. Has at least one tag
 * 3. Has some prose context (> 30 words)
 * 4. Has at least one code block OR significant prose (> 100 words)
 */
export function analyzeEntryQuality(entry: EntryData): QualityResult {
  const { title, tags, content } = entry;
  const metrics = getCalculatedMetrics(content);
  const missingElements: string[] = [];

  // Rule 1: Title
  if (!title || title.trim().length < 5 || title.includes("Untitled")) {
    missingElements.push("meaningful title");
  }

  // Rule 2: Tags
  if (!tags || tags.length === 0) {
    missingElements.push("tags");
  }

  // Rule 3: Context (Prose)
  if (metrics.wordCount < 30) {
    missingElements.push("context description");
  }

  // Rule 4: Substance (Code or Deep Prose)
  if (metrics.codeBlockCount === 0 && metrics.wordCount < 100) {
    missingElements.push("code or detail");
  }

  return {
    isWellStructured: missingElements.length === 0,
    missingElements,
    metrics
  };
}
