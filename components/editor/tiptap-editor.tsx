"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer, mergeAttributes } from "@tiptap/react";
import { useState, useEffect, useRef, useMemo } from "react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { 
  Bold, Italic, Code, List, ListOrdered, Quote, 
  Underline as UnderlineIcon, Highlighter, Type, 
  Heading1, Heading2, Heading3, ChevronDown
} from "lucide-react";
import { CodeMirrorBlock } from "./codemirror-block";
import { Marker, Underline, FontSize } from "./extensions"; 
import Heading from '@tiptap/extension-heading';

// Register languages for syntax highlighting
const lowlight = createLowlight(common);

interface EditorProps {
  content?: string; // JSON string or HTML
  onChange?: (json: string) => void;
  editable?: boolean;
  name?: string; // For form submission
  className?: string; // Allow custom sizing
}

// Custom Heading to enforce specific Tailwind classes for visual hierarchy
const CustomHeading = Heading.extend({
    renderHTML({ node, HTMLAttributes }) {
        const hasLevel = this.options.levels.includes(node.attrs.level)
        const level = hasLevel ? node.attrs.level : this.options.levels[0]
        
        // Define explicit classes for each header level
        const classes: {[key: number]: string} = {
            1: "text-4xl font-bold mb-4 mt-6 block", 
            2: "text-2xl font-semibold mb-3 mt-5 block",
            3: "text-xl font-medium mb-2 mt-4 block",
        }

        return [`h${level}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: classes[level] }), 0]
    }
}).configure({ levels: [1, 2, 3] });

// Define extensions
const extensions = [
  StarterKit.configure({
    heading: false, // Usage of CustomHeading instead
    codeBlock: false, // Usage of CodeBlockLowlight
  }),
  CustomHeading,
  CodeBlockLowlight.extend({
    addNodeView() {
      return ReactNodeViewRenderer(CodeMirrorBlock);
    },
  }).configure({
    lowlight,
  }),
  Marker,
  Underline,
  FontSize,
];

// Highlight colors palette
const HIGHLIGHT_COLORS = [
    { label: "Yellow", value: "#facc15" },
    { label: "Green", value: "#4ade80" },
    { label: "Blue", value: "#60a5fa" },
    { label: "Purple", value: "#c084fc" },
    { label: "Red", value: "#f87171" },
    { label: "Orange", value: "#fb923c" },
];

export function TiptapEditor({
  content = "",
  onChange,
  editable = true,
  name,
  className = "",
}: EditorProps) {
  const [jsonContent, setJsonContent] = useState(content);
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number } | null>(null);

  const editor = useEditor({
    extensions, 
    content: content ? JSON.parse(content) : "", 
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
    onSelectionUpdate: ({ editor }) => {
        const selection = editor.state.selection;
        const text = editor.state.doc.textBetween(selection.from, selection.to, " ");

        if (!selection.empty && text.trim().length > 0) {
            const { from } = selection;
            const start = editor.view.coordsAtPos(from);
            setMenuStyle({
                top: start.top - 45, 
                left: start.left,
            });
        } else {
            setMenuStyle(null);
        }
    },
    immediatelyRender: false, 
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={`flex flex-col rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden transition-all focus-within:ring-1 focus-within:ring-[var(--focus-ring)] ${className} relative`}>
      {editable && (
        <>
            <div className="flex flex-wrap gap-1 border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-2 items-center">
            
            {/* Headers */}
            <div className="flex bg-[var(--bg-secondary)] rounded-md border border-[var(--border-primary)] p-0.5">
                <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
                    isActive={editor.isActive("heading", { level: 1 })}
                    icon={<Heading1 className="h-4 w-4" />}
                    title="Heading 1"
                />
                <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
                    isActive={editor.isActive("heading", { level: 2 })}
                    icon={<Heading2 className="h-4 w-4" />}
                    title="Heading 2"
                />
                 <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
                    isActive={editor.isActive("heading", { level: 3 })}
                    icon={<Heading3 className="h-4 w-4" />}
                    title="Heading 3"
                />
            </div>

            {/* Formatting */}
             <div className="flex bg-[var(--bg-secondary)] rounded-md border border-[var(--border-primary)] p-0.5">
                <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
                    isActive={editor.isActive("bold")}
                    icon={<Bold className="h-4 w-4" />}
                    title="Bold"
                />
                <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
                    isActive={editor.isActive("italic")}
                    icon={<Italic className="h-4 w-4" />}
                    title="Italic"
                />
                <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
                    isActive={editor.isActive("underline")}
                    icon={<UnderlineIcon className="h-4 w-4" />}
                    title="Underline"
                />
                
                {/* Highlight Color Picker */}
                <div className="relative group">
                    <button 
                         className={`flex h-7 px-1 items-center justify-center rounded-sm transition-colors gap-0.5 ${
                            editor.isActive("marker")
                              ? "bg-[var(--accent-primary)] text-[var(--text-primary)]"
                              : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]"
                          }`}
                        title="Highlight"
                        type="button"
                    >
                        <Highlighter className="h-4 w-4" />
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </button>
                    {/* Simplified Dropdown */}
                    <div className="absolute top-full left-0 z-50 hidden group-hover:flex flex-col bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-md shadow-lg p-1 min-w-[120px]">
                         {HIGHLIGHT_COLORS.map(color => (
                             <button
                                key={color.value}
                                onClick={(e) => {
                                    e.preventDefault();
                                    editor.chain().focus().setMarker({ color: color.value }).run();
                                }}
                                className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-[var(--bg-secondary)] rounded w-full text-left"
                             >
                                 <span className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: color.value }} />
                                 {color.label}
                             </button>
                         ))}
                         <button
                            onClick={(e) => { e.preventDefault(); editor.chain().focus().unsetMarker().run(); }}
                            className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-[var(--bg-secondary)] rounded w-full text-left mt-1 border-t border-[var(--border-primary)] pt-1"
                         >
                             None
                         </button>
                    </div>
                </div>

                 <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleCode().run(); }}
                    isActive={editor.isActive("code")}
                    icon={<Code className="h-4 w-4" />}
                    title="Inline Code"
                />
            </div>

            {/* Font Size Dropdown (Simple) */}
            <div className="flex items-center gap-1 bg-[var(--bg-secondary)] rounded-md border border-[var(--border-primary)] px-2 py-1 h-8">
               <Type className="h-3 w-3 text-[var(--text-muted)]" />
               <select 
                 className="bg-transparent text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer w-16"
                 onChange={(e) => {
                    const val = e.target.value;
                    if(val === 'default') {
                        editor.chain().focus().unsetFontSize().run();
                    } else {
                        editor.chain().focus().setFontSize(val).run();
                    }
                 }}
                 value={editor.getAttributes('fontSize').size || 'default'}
               >
                 <option value="default">Auto</option>
                 <option value="12px">12</option>
                 <option value="14px">14</option>
                 <option value="16px">16</option>
                 <option value="18px">18</option>
                 <option value="20px">20</option>
                 <option value="24px">24</option>
                 <option value="30px">30</option>
                 <option value="36px">36</option>
                 <option value="48px">48</option>
               </select>
            </div>

            <div className="mx-1 h-6 w-px bg-[var(--border-primary)]" />
            
            {/* Lists & Blocks */}
            <div className="flex bg-[var(--bg-secondary)] rounded-md border border-[var(--border-primary)] p-0.5">
                <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
                    isActive={editor.isActive("bulletList")}
                    icon={<List className="h-4 w-4" />}
                    title="Bullet List"
                />
                <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
                    isActive={editor.isActive("orderedList")}
                    icon={<ListOrdered className="h-4 w-4" />}
                    title="Ordered List"
                />
                <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
                    isActive={editor.isActive("blockquote")}
                    icon={<Quote className="h-4 w-4" />}
                    title="Blockquote"
                />
                  <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleCodeBlock().run(); }}
                    isActive={editor.isActive("codeBlock")}
                    icon={<span className="font-mono text-xs">{"{ }"}</span>}
                    title="Code Block"
                />
            </div>
            </div>

            {/* Manual Bubble Menu (Updated) */}
            {menuStyle && (
                 <div
                    className="fixed z-50 flex items-center gap-1 rounded-md border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-1 shadow-lg animate-in fade-in zoom-in-95 duration-100"
                    style={{
                        top: menuStyle.top,
                        left: menuStyle.left,
                    }}
                >
                    <BubbleButton
                        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
                        isActive={editor.isActive("bold")}
                        icon={<Bold className="h-3 w-3" />}
                    />
                    <BubbleButton
                        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
                        isActive={editor.isActive("italic")}
                        icon={<Italic className="h-3 w-3" />}
                    />
                    {/* Highlight in bubble menu toggles default yellow */}
                    <BubbleButton
                        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleMarker({ color: '#facc15' }).run(); }}
                        isActive={editor.isActive("marker")}
                        icon={<Highlighter className="h-3 w-3" />}
                    />
                    <BubbleButton
                        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleCode().run(); }}
                        isActive={editor.isActive("code")}
                        icon={<Code className="h-3 w-3" />}
                    />
                </div>
            )}
        </>
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
  type = "button"
}: {
  onClick: (e: React.MouseEvent) => void;
  isActive: boolean;
  icon: React.ReactNode;
  title: string;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-sm transition-colors ${
        isActive
          ? "bg-[var(--accent-primary)] text-[var(--text-primary)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]"
      }`}
      title={title}
      type={type}
    >
      {icon}
    </button>
  );
}

function BubbleButton({
    onClick,
    isActive,
    icon,
  }: {
    onClick: (e: React.MouseEvent) => void;
    isActive: boolean;
    icon: React.ReactNode;
  }) {
    return (
      <button
        onClick={onClick}
        className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
          isActive
             ? "bg-[var(--accent-primary)] text-[var(--text-primary)]"
            : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]"
        }`}
        type="button"
      >
        {icon}
      </button>
    );
  }
