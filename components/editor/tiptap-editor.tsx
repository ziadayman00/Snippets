"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import { useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Bold, Italic, Code, List, ListOrdered, Quote } from "lucide-react";
import { CodeMirrorBlock } from "./codemirror-block";

// Register languages for syntax highlighting
const lowlight = createLowlight(common);

interface EditorProps {
  content?: string; // JSON string or HTML
  onChange?: (json: string) => void;
  editable?: boolean;
  name?: string; // For form submission
  className?: string; // Allow custom sizing
}

export function TiptapEditor({
  content = "",
  onChange,
  editable = true,
  name,
  className = "",
}: EditorProps) {
  const [jsonContent, setJsonContent] = useState(content);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false, // Disable default codeBlock to use Lowlight
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeMirrorBlock);
        },
      }).configure({
        lowlight,
      }),
    ],
    content: content ? JSON.parse(content) : "", // Assuming JSON content
    editable,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-full px-6 py-6 text-[var(--text-primary)]",
      },
    },
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON());
      setJsonContent(json);
      onChange?.(json);
    },
    immediatelyRender: false, // Fixes SSR hydration mismatch
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={`flex flex-col rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden transition-all focus-within:ring-1 focus-within:ring-[var(--focus-ring)] ${className}`}>
      {editable && (
        <div className="flex flex-wrap gap-1 border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={<Bold className="h-4 w-4" />}
            title="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={<Italic className="h-4 w-4" />}
            title="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            icon={<Code className="h-4 w-4" />}
            title="Inline Code"
          />
          <div className="mx-1 h-6 w-px bg-[var(--border-primary)]" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            icon={<span className="font-bold text-xs">H1</span>}
            title="Heading 1"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            icon={<span className="font-bold text-xs">H2</span>}
            title="Heading 2"
          />
           <div className="mx-1 h-6 w-px bg-[var(--border-primary)]" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={<List className="h-4 w-4" />}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={<ListOrdered className="h-4 w-4" />}
            title="Ordered List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={<Quote className="h-4 w-4" />}
            title="Blockquote"
          />
          <div className="mx-1 h-6 w-px bg-[var(--border-primary)]" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            icon={<span className="font-mono text-xs">{"{ }"}</span>}
            title="Code Block"
          />
        </div>
      )}
      
      <EditorContent editor={editor} />
      {name && <input type="hidden" name={name} value={jsonContent} />}
    </div>
  );
}

function ToolbarButton({
  onClick,
  isActive,
  icon,
  title,
}: {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
        isActive
          ? "bg-[var(--accent-primary)] text-[var(--text-primary)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]"
      }`}
      title={title}
      type="button"
    >
      {icon}
    </button>
  );
}
