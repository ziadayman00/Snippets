import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface GhostPromptOptions {
  technologyName?: string;
  showOnlyWhenEmpty?: boolean;
}

// Technology-specific ghost prompts
const GHOST_PROMPTS: Record<string, string> = {
  react: "What problem does this solve?\nAdd code example below...",
  'next.js': "What does this component/pattern do?\nAdd implementation...",
  vue: "What does this component do?\nAdd template and logic...",
  python: "What does this script do?\nWhen should you use it?",
  django: "What does this view/model do?\nAdd code example...",
  node: "What does this function do?\nAdd implementation...",
  sql: "What does this query return?\nWhen to use this pattern?",
  docker: "What does this container do?\nAdd Dockerfile below...",
  kubernetes: "What does this config do?\nAdd YAML below...",
  go: "What does this function do?\nAdd implementation...",
  rust: "What does this solve?\nAdd code example...",
  java: "What does this class/method do?\nAdd implementation...",
  default: "What are you learning?\nAdd context and examples...",
};

/**
 * Get ghost prompt text for a technology
 */
function getGhostPrompt(technologyName?: string): string {
  if (!technologyName) return GHOST_PROMPTS.default;
  
  const normalized = technologyName.toLowerCase();
  return GHOST_PROMPTS[normalized] || GHOST_PROMPTS.default;
}

/**
 * Ghost Prompt Extension
 * Shows contextual placeholder text in empty entries
 */
export const GhostPrompt = Extension.create<GhostPromptOptions>({
  name: 'ghostPrompt',

  addOptions() {
    return {
      technologyName: undefined,
      showOnlyWhenEmpty: true,
    };
  },

  addProseMirrorPlugins() {
    const { technologyName, showOnlyWhenEmpty } = this.options;

    return [
      new Plugin({
        key: new PluginKey('ghostPrompt'),
        props: {
          decorations: (state) => {
            const { doc } = state;
            
            // Only show if document is empty or has only empty paragraph
            if (showOnlyWhenEmpty) {
              const isEmpty = doc.textContent.trim().length === 0;
              const hasOnlyEmptyParagraph = 
                doc.childCount === 1 && 
                doc.firstChild?.type.name === 'paragraph' &&
                doc.firstChild.textContent.trim().length === 0;
              
              if (!isEmpty && !hasOnlyEmptyParagraph) {
                return DecorationSet.empty;
              }
            }

            const ghostText = getGhostPrompt(technologyName);
            const decorations: Decoration[] = [];

            // Add ghost text as a decoration on the first empty paragraph
            doc.descendants((node, pos) => {
              if (
                node.type.name === 'paragraph' &&
                node.textContent.trim().length === 0 &&
                decorations.length === 0 // Only add to first empty paragraph
              ) {
                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: 'ghost-prompt',
                  'data-ghost-text': ghostText,
                });
                decorations.push(decoration);
                return false; // Stop after first match
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
