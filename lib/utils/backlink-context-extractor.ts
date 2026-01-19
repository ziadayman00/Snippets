/**
 * Backlink Context Extractor
 * 
 * Extracts the context sentence surrounding a mention from TipTap JSON content.
 */

interface TipTapNode {
  type: string;
  text?: string;
  content?: TipTapNode[];
  attrs?: Record<string, any>;
}

/**
 * Extracts a snippet of text surrounding a specific mention ID
 * Returns the first sentence where the mention occurs, or a fallback string
 */
export function extractMentionContext(content: any, targetId: string): string | null {
  if (!content) return null;
  
  // Convert stringified JSON if needed
  const jsonContent = typeof content === 'string' ? JSON.parse(content) : content;
  
  let context: string | null = null;
  
  // Recursively traverse to find the mention and its surrounding text
  const traverse = (node: TipTapNode, parentTextArray: string[] = []) => {
    if (context) return; // Stop if we found it
    
    // Check if this is a paragraph or text-block that might contain the mention
    if (node.type === 'paragraph' || node.type === 'heading' || node.type === 'listItem') {
      // Check children for the mention
      if (node.content) {
        const hasMention = node.content.some(
          child => child.type === 'mention' && child.attrs?.id === targetId
        );
        
        if (hasMention) {
          // Construct the full text of this block
          const fullText = node.content
            .map(child => {
              if (child.text) return child.text;
              if (child.type === 'mention') return `@${child.attrs?.label || 'snippet'}`;
              return '';
            })
            .join('');
            
          context = fullText;
        }
      }
    }
    
    // Continue recursion if not found
    if (node.content) {
      node.content.forEach(child => traverse(child));
    }
  };
  
  traverse(jsonContent);
  
  return context;
}
