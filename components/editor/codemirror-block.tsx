"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

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
};

export function CodeMirrorBlock({
  node,
  updateAttributes,
}: NodeViewProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageCompartment = useRef(new Compartment());

  const defaultLanguage = node.attrs.language || "javascript";
  const languages = Object.keys(languageMap);

  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const startState = EditorState.create({
      doc: node.textContent,
      extensions: [
        basicSetup,
        oneDark,
        languageCompartment.current.of(
          languageMap[defaultLanguage] || []
        ),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            // Update TipTap node content
            const newText = update.state.doc.toString();
            // We need to update the node's text content, not attributes
            // This is handled by TipTap's node view system
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [node.textContent]);

  // Update language when changed
  useEffect(() => {
    if (viewRef.current && defaultLanguage) {
      viewRef.current.dispatch({
        effects: languageCompartment.current.reconfigure(
          languageMap[defaultLanguage] || []
        ),
      });
    }
  }, [defaultLanguage]);

  const handleCopy = () => {
    if (viewRef.current) {
      const text = viewRef.current.state.doc.toString();
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <NodeViewWrapper className="code-block my-4 overflow-hidden rounded-lg border border-[var(--border-primary)] bg-[#1e1e1e] shadow-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between border-b border-[#2a2a2a] bg-[#252526] px-4 py-2 select-none"
        contentEditable={false}
      >
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
      <div ref={editorRef} className="codemirror-wrapper" />
    </NodeViewWrapper>
  );
}
