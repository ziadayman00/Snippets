import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { Check, ChevronDown, Copy, Settings2, CircleDot, GitCommit, CheckCircle, Calendar } from "lucide-react";

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
import { getLanguageSuggestions, recordLanguageUsage, type LanguageSuggestion } from "@/lib/utils/language-suggestions";


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

// Helper to format timestamp for recently used languages
function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}


const CodeMirrorBlockComponent = (props: NodeViewProps) => {
  const { node, updateAttributes, editor, getPos } = props;
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageCompartment = useRef(new Compartment());
  const isInitializedRef = useRef(false);

  // Metadata accessors
  const intent = node.attrs.intent;
  const version = node.attrs.version;
  const verified = node.attrs.verified;

  // Auto-detect language if needed
  const detectLanguage = (code: string) => {
    // ... (existing logic) ...
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
  
  // Get technology name from editor storage (passed from TipTap editor)
  const technologyName = (editor.storage as any)?.technologyName as string | undefined;
  
  // Get smart language suggestions
  const languageSuggestions = getLanguageSuggestions(technologyName);

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
     // ... (existing logic) ...
     if (viewRef.current) {
      const text = viewRef.current.state.doc.toString();
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const verifySnippet = () => {
    updateAttributes({ verified: Date.now() });
  };

  const getIntentColor = (i: string) => {
    switch(i) {
      case 'production': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'deprecated': return 'text-red-400 border-red-400/30 bg-red-400/10';
      case 'example': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'ideation': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      default: return 'text-[var(--text-muted)] border-[var(--border-primary)]';
    }
  };

  return (
    <NodeViewWrapper dir="ltr" contentEditable={false} className="code-block my-4 rounded-lg border border-[var(--border-primary)] bg-[#1e1e1e] shadow-sm transition-all">
      {/* Header */}
      <div
        className="flex flex-col border-b border-[#2a2a2a] bg-[#252526] rounded-t-lg select-none"
        contentEditable={false}
      >
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left: Language & Active Metadata */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
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
                 <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                 // ... dropdown content rendered via portal logic normally, but here inline is fine for now if fixed/absolute work
                 // Keeping the existing dropdown logic structure
              )}
               {/* Re-inserting the large dropdown code block below if needed, or assuming it's retained if I replace correctly */}
               {isOpen && (
                  <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                  />
                  <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-40 overflow-auto rounded-md border border-[#2a2a2a] bg-[#1e1e1e] p-1 shadow-xl">
                    {/* Recently Used */}
                    {languageSuggestions.filter(s => s.category === 'recent').length > 0 && (
                      <>
                        <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-[#808080] font-semibold">
                          Recently Used
                        </div>
                        {languageSuggestions
                          .filter(s => s.category === 'recent')
                          .map((suggestion, index) => (
                            <button
                              key={`recent-${index}`}
                              type="button"
                              onClick={() => {
                                updateAttributes({ language: suggestion.lang });
                                recordLanguageUsage(suggestion.lang);
                                setIsOpen(false);
                              }}
                              className={`w-full rounded-sm px-2 py-1 text-left text-xs text-[#d4d4d4] hover:bg-[#2a2a2a] flex items-center justify-between ${
                                suggestion.lang === defaultLanguage ? "bg-[#37373d]" : ""
                              }`}
                            >
                              <span>{suggestion.lang}</span>
                              {suggestion.timestamp && (
                                <span className="text-[10px] text-[#808080]">
                                  {formatTimestamp(suggestion.timestamp)}
                                </span>
                              )}
                            </button>
                          ))}
                        <div className="h-px bg-[#2a2a2a] my-1" />
                      </>
                    )}

                    {/* Technology Suggested */}
                    {languageSuggestions.filter(s => s.category === 'suggested').length > 0 && (
                      <>
                        <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-[#808080] font-semibold">
                          Suggested for {technologyName || 'this tech'}
                        </div>
                        {languageSuggestions
                          .filter(s => s.category === 'suggested')
                          .map((suggestion, index) => (
                            <button
                              key={`suggested-${index}`}
                              type="button"
                              onClick={() => {
                                updateAttributes({ language: suggestion.lang });
                                recordLanguageUsage(suggestion.lang);
                                setIsOpen(false);
                              }}
                              className={`w-full rounded-sm px-2 py-1 text-left text-xs text-[#d4d4d4] hover:bg-[#2a2a2a] ${
                                suggestion.lang === defaultLanguage ? "bg-[#37373d]" : ""
                              }`}
                            >
                              {suggestion.lang}
                            </button>
                          ))}
                        <div className="h-px bg-[#2a2a2a] my-1" />
                      </>
                    )}

                    {/* All Languages */}
                    <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-[#808080] font-semibold">
                      All Languages
                    </div>
                    {languageSuggestions
                      .filter(s => s.category === 'all')
                      .map((suggestion, index) => (
                        <button
                          key={`all-${index}`}
                          type="button"
                          onClick={() => {
                            updateAttributes({ language: suggestion.lang });
                            recordLanguageUsage(suggestion.lang);
                            setIsOpen(false);
                          }}
                          className={`w-full rounded-sm px-2 py-1 text-left text-xs text-[#d4d4d4] hover:bg-[#2a2a2a] ${
                            suggestion.lang === defaultLanguage ? "bg-[#37373d]" : ""
                          }`}
                        >
                          {suggestion.lang}
                        </button>
                      ))}
                  </div>
                </>
              )}
            </div>

            {/* Active Metadata Badges (Visible when settings closed) */}
            {!isSettingsOpen && (
              <div className="flex items-center gap-2">
                {intent && (
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border ${getIntentColor(intent)}`}>
                    {intent}
                  </span>
                )}
                {version && (
                  <span className="flex items-center gap-1 text-[10px] text-[#a8a8a8] bg-[#2a2a2a] px-1.5 py-0.5 rounded">
                    <GitCommit className="h-3 w-3" /> v{version}
                  </span>
                )}
                {verified && (
                  <span className="text-[10px] text-green-400 flex items-center gap-1" title={`Verified: ${new Date(verified).toLocaleDateString()}`}>
                    <CheckCircle className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1">
             {/* Settings Toggle */}
             <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              type="button"
              className={`p-1 rounded transition-colors ${isSettingsOpen ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'text-[#a8a8a8] hover:text-[#d4d4d4] hover:bg-[#2a2a2a]'}`}
              title="Block Settings"
            >
              <Settings2 className="h-3.5 w-3.5" />
            </button>

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
        </div>

        {/* Expandable Settings Panel */}
        {isSettingsOpen && (
          <div className="px-4 py-2 border-t border-[#2a2a2a] bg-[#1e1e1e] flex items-center gap-4 text-xs animate-in slide-in-from-top-1 duration-200">
             {/* Intent */}
             <div className="flex items-center gap-2">
                <span className="text-[#808080] uppercase tracking-wider text-[10px] font-semibold">Intent</span>
                <select 
                  value={intent || ""} 
                  onChange={(e) => updateAttributes({ intent: e.target.value || null })}
                  className="bg-[#2a2a2a] text-[#d4d4d4] rounded px-2 py-1 border-none focus:ring-1 focus:ring-[var(--accent-primary)] outline-none text-xs"
                >
                  <option value="">None</option>
                  <option value="production">Production</option>
                  <option value="example">Example</option>
                  <option value="deprecated">Deprecated</option>
                  <option value="ideation">Ideation</option>
                </select>
             </div>

             {/* Version */}
             <div className="flex items-center gap-2">
                <span className="text-[#808080] uppercase tracking-wider text-[10px] font-semibold">Version</span>
                <input 
                  type="text" 
                  value={version || ""} 
                  onChange={(e) => updateAttributes({ version: e.target.value })}
                  placeholder="1.0.0"
                  className="bg-[#2a2a2a] text-[#d4d4d4] rounded px-2 py-1 w-20 border-none focus:ring-1 focus:ring-[var(--accent-primary)] outline-none text-xs"
                />
             </div>

             {/* Verified */}
             <div className="flex items-center gap-2 ml-auto">
                <button 
                  onClick={verifySnippet}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${verified ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-[#2a2a2a] text-[#a8a8a8] hover:text-[#d4d4d4]'}`}
                >
                  <CheckCircle className="h-3 w-3" />
                  {verified ? "Verified" : "Mark Verified"}
                </button>
             </div>
          </div>
        )}
      </div>


      {/* CodeMirror Editor */}
      <div ref={editorRef} className="codemirror-wrapper rounded-b-lg overflow-hidden" />
    </NodeViewWrapper>
  );
};

export const CodeMirrorBlock = memo(CodeMirrorBlockComponent, (prev, next) => {
  return (
    prev.node.textContent === next.node.textContent && 
    prev.node.attrs.language === next.node.attrs.language &&
    prev.node.attrs.intent === next.node.attrs.intent &&
    prev.node.attrs.version === next.node.attrs.version &&
    prev.node.attrs.verified === next.node.attrs.verified
  );
});