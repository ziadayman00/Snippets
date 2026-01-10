import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { useEffect, useRef, useState, memo, useLayoutEffect } from "react";
import { EditorView } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { json } from "@codemirror/lang-json";
import { java } from "@codemirror/lang-java";    
import { cpp } from "@codemirror/lang-cpp";      
import { go } from "@codemirror/lang-go";        
import { rust } from "@codemirror/lang-rust";    
import { php } from "@codemirror/lang-php";      
import { sql } from "@codemirror/lang-sql";      
import { markdown } from "@codemirror/lang-markdown"; 
import { xml } from "@codemirror/lang-xml";      
import { yaml } from "@codemirror/lang-yaml";    
import { wast } from "@codemirror/lang-wast";    
import { oneDark } from "@codemirror/theme-one-dark";
import { common, createLowlight } from "lowlight";

// Initialize lowlight for auto-detection
const lowlight = createLowlight(common);

// Language map
const languageMap: Record<string, any> = {
  javascript: javascript(),
  typescript: javascript({ typescript: true }),
  jsx: javascript({ jsx: true }),
  tsx: javascript({ jsx: true, typescript: true }),
  python: python(),
  css: css(),
  html: html(),
  json: json(),
  java: java(),
  cpp: cpp(),
  c: cpp(), // C++ package handles C usually
  csharp: cpp(), // Close enough for basic highlight or valid fallback
  go: go(),
  rust: rust(),
  php: php(),
  sql: sql(),
  markdown: markdown(),
  xml: xml(),
  yaml: yaml(),
  wasm: wast(),
  bash: oneDark, // Fallback for shell scripts (no official shell pkg installed yet, using theme default)
  shell: oneDark,
};

const CodeMirrorBlockComponent = (props: NodeViewProps) => {
  const { node, updateAttributes, editor, getPos } = props;
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageCompartment = useRef(new Compartment());
  const isInitializedRef = useRef(false);

  // Auto-detect language if needed
  const detectLanguage = (code: string) => {
    try {
       // Only run auto-detect if the code is long enough to be meaningful
       if (!code || code.trim().length < 10) return "javascript";

       const detected = lowlight.highlightAuto(code);
       const lang = detected.data?.language;
       
       // Map lowlight names to our supported languages
       if (lang && languageMap[lang]) return lang;
       if (lang === 'ts') return 'typescript';
       if (lang === 'js') return 'javascript';
       if (lang === 'py') return 'python';
       if (lang === 'yml') return 'yaml';
       if (lang === 'md') return 'markdown';
       
       return "javascript"; // Fallback
    } catch (e) {
        return "javascript";
    }
  };

  // Determine effective language: explicit prop OR auto-detected
  const effectiveLanguage = node.attrs.language === 'plaintext' || !node.attrs.language 
      ? detectLanguage(node.textContent) 
      : node.attrs.language;

  const defaultLanguage = node.attrs.language || "javascript";
  const languages = Object.keys(languageMap);

  // Mount effect - create view ONCE
  useLayoutEffect(() => {
    if (!editorRef.current || isInitializedRef.current) return;

    // Use effectiveLanguage for initial setup
    const initialLang = effectiveLanguage || "javascript";

    const startState = EditorState.create({
      doc: node.textContent,
      extensions: [
        basicSetup,
        oneDark,
        EditorView.theme({
            "&": {
                direction: "ltr",
                textAlign: "left",
                unicodeBidi: "isolate"
            },
            ".cm-content": {
                direction: "ltr",
                textAlign: "left",
                unicodeBidi: "isolate"
            }
        }),
        languageCompartment.current.of(
          languageMap[initialLang] || languageMap['javascript']
        ),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const content = update.state.doc.toString();
            // Sync to Tiptap
            // Sync to Tiptap
            if (typeof props.getPos === 'function') {
               const pos = props.getPos();
               
               if (typeof pos !== 'number') return;
               
               // We must fetch the fresh node from the state to get correct nodeSize
               // as props.node is stale in this closure
               const currentNode = props.editor.state.doc.nodeAt(pos);
               
               if (currentNode && currentNode.type.name === props.node.type.name) {
                   const tr = props.editor.state.tr;
                   // Replace the entire content of the code block with new content
                   // pos + 1 is the start of content
                   // pos + currentNode.nodeSize - 1 is the end of content
                   tr.replaceWith(pos + 1, pos + currentNode.nodeSize - 1, props.editor.schema.text(content));
                   
                   // Update language attribute if it was auto-detected, 
                   // so it persists. Note: This might be too aggressive if user wants plaintext.
                   // For now, we only update content.
                   
                   props.editor.view.dispatch(tr);
               }
            }
          }
        }),
      ],
    });



    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
      dispatch: (tr) => {
         view.update([tr]);
      }
    });

    // Enforce LTR on the content DOM element immediately
    if (view.contentDOM) {
        view.contentDOM.setAttribute("dir", "ltr");
        view.contentDOM.style.direction = "ltr";
        view.contentDOM.style.textAlign = "left";
    }
    
    // Also enforce on scroll element (parent of content)
    if (view.scrollDOM) {
        view.scrollDOM.setAttribute("dir", "ltr");
        view.scrollDOM.style.direction = "ltr";
        view.scrollDOM.style.textAlign = "left";
    }

    viewRef.current = view;
    isInitializedRef.current = true;

    return () => {
      view.destroy();
      viewRef.current = null;
      isInitializedRef.current = false;
    };
  }, []); // Only run once on mount

  // Sync content from CodeMirror -> TipTap (One-way sync implemented inside mount above)
  // We removed the secondary listener effect to avoid duplication

  // Sync content from TipTap -> CodeMirror (External updates)
  useEffect(() => {
    if (!viewRef.current) return;
    
    // CRITICAL: Do not overwrite if the user is currently typing (has focus)
    // This prevents the cursor from jumping back or "fighting" the user
    if (viewRef.current.hasFocus) return;

    if (node.textContent !== viewRef.current.state.doc.toString()) {
      const transaction = viewRef.current.state.update({
        changes: { 
          from: 0, 
          to: viewRef.current.state.doc.length, 
          insert: node.textContent 
        }
      });
      viewRef.current.dispatch(transaction);
    }
  }, [node.textContent]);

  // Update language when changed
  useEffect(() => {
    if (viewRef.current) {
      const lang = effectiveLanguage || "javascript";
      viewRef.current.dispatch({
        effects: languageCompartment.current.reconfigure(
          languageMap[lang] || languageMap['javascript']
        ),
      });
    }
  }, [effectiveLanguage]);

  const handleCopy = () => {
    if (viewRef.current) {
      const text = viewRef.current.state.doc.toString();
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // languages variable removed from here because it's already defined above.

  return (
    <NodeViewWrapper dir="ltr" contentEditable={false} className="code-block my-4 rounded-lg border border-[var(--border-primary)] bg-[#1e1e1e] shadow-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between border-b border-[#2a2a2a] bg-[#252526] px-4 py-2 select-none rounded-t-lg"
        contentEditable={false}
      >
        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 rounded text-xs font-medium text-[#cce5ff] hover:bg-[#2a2a2a] px-2 py-1 transition-colors"
              type="button"
            >
              {defaultLanguage || "plaintext"}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>

            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-32 overflow-auto rounded-md border border-[#2a2a2a] bg-[#1e1e1e] p-1 shadow-xl">
                  {languages.map((lang: string, index: number) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        updateAttributes({ language: lang });
                        setIsOpen(false);
                      }}
                      className={`w-full rounded-sm px-2 py-1 text-left text-xs text-[#d4d4d4] hover:bg-[#2a2a2a] ${
                        lang === defaultLanguage ? "bg-[#37373d]" : ""
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[#a8a8a8] hover:bg-[#2a2a2a] hover:text-[#d4d4d4] transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* CodeMirror Editor */}
      <div ref={editorRef} className="codemirror-wrapper rounded-b-lg overflow-hidden" />
    </NodeViewWrapper>
  );
};

export const CodeMirrorBlock = memo(CodeMirrorBlockComponent, (prev, next) => {
  return (
    prev.node.textContent === next.node.textContent && 
    prev.node.attrs.language === next.node.attrs.language
  );
});