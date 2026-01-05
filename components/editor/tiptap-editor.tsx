"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer, mergeAttributes } from "@tiptap/react";
import { useState, useEffect, useRef, useMemo } from "react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { 
  Bold, Italic, Code, List, ListOrdered, Quote, 
  Underline as UnderlineIcon, Highlighter, Type, 
  Heading1, Heading2, Heading3, ChevronDown,
  Maximize2, Minimize2, SidebarClose, SidebarOpen,
  Undo, Redo, Strikethrough, Minus, 
  AlignLeft, AlignCenter, AlignRight
} from "lucide-react";
import { CodeMirrorBlock } from "./codemirror-block";
import { Marker, Underline, FontSize } from "./extensions"; 
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';

// Register languages for syntax highlighting
const lowlight = createLowlight(common);

interface EditorProps {
  content?: string; // JSON string or HTML
  onChange?: (json: string) => void;
  editable?: boolean;
  name?: string; // For form submission
  className?: string; // Allow custom sizing
  onSidebarToggle?: () => void;
  isSidebarOpen?: boolean;
  currentEntryId?: string;
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

import Mention from '@tiptap/extension-mention';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { MentionList } from './mention-list';
import { searchSnippets } from '@/lib/actions/links';

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
  onSidebarToggle,
  isSidebarOpen = true,
  currentEntryId,
}: EditorProps) {
  const [jsonContent, setJsonContent] = useState(content);
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number } | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Toggle full screen
  const toggleFullScreen = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setIsFullScreen(prev => !prev);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Full Screen: Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsFullScreen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
         heading: false,
         codeBlock: false,
      }),
      CustomHeading,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeMirrorBlock);
        }
      }).configure({ lowlight }),
      Marker,
      Underline,
      FontSize,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Mention.configure({
        HTMLAttributes: {
          class: 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] rounded px-1 py-0.5 font-medium decoration-clone',
        },
        suggestion: {
          items: async ({ query }) => {
            // Fetchsnippets matching the query, excluding current entry
            return await searchSnippets(query, currentEntryId);
          },
          render: () => {
             // ... existing render ...
             let component: ReactRenderer;
             let popup: any;
     
             return {
               onStart: (props: any) => {
                 component = new ReactRenderer(MentionList, {
                     props,
                     editor: props.editor,
                 });
     
                 if (!props.clientRect) {
                     return;
                 }
     
                 // @ts-ignore
                 popup = tippy('body', {
                     getReferenceClientRect: props.clientRect,
                     appendTo: () => document.body,
                     content: component.element,
                     showOnCreate: true,
                     interactive: true,
                     trigger: 'manual',
                     placement: 'bottom-start',
                 });
               },
               onUpdate(props: any) {
                 component.updateProps(props);
     
                 if (!props.clientRect) {
                     return;
                 }
     
                 popup[0].setProps({
                     getReferenceClientRect: props.clientRect,
                 });
               },
               onKeyDown(props: any) {
                 if (props.event.key === 'Escape') {
                     popup[0].hide();
                     return true;
                 }
     
                 // @ts-ignore
                 return component.ref?.onKeyDown(props);
               },
               onExit() {
                 popup[0].destroy();
                 component.destroy();
               },
             };
          },
        },
      }),
    ],
    content: content ? JSON.parse(content) : "", 
    editable,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-full px-6 py-6 text-[var(--text-primary)] mx-auto container",
        dir: "auto",
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
    <div 
      className={`editor-wrapper flex flex-col border border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden transition-all focus-within:ring-1 focus-within:ring-[var(--focus-ring)] ${
        isFullScreen 
          ? "fixed inset-0 z-[100] h-screen w-screen rounded-none border-0" 
          : `relative rounded-xl ${className}`
      }`}
    >
      {editable && (
        <>
            <div className={`editor-toolbar sticky top-0 z-10 flex flex-wrap gap-1 border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/95 backdrop-blur p-2 items-center ${isFullScreen ? 'px-4 py-3' : ''}`}>
            
             {/* Sidebar Toggle (First Item) */}
             {onSidebarToggle && !isFullScreen && (
                 <>
                    <div className="hidden lg:flex bg-[var(--bg-secondary)] rounded-md border border-[var(--border-primary)] p-0.5 mr-1">
                        <ToolbarButton
                            onClick={(e) => { e.preventDefault(); onSidebarToggle(); }}
                            isActive={false} // Always strictly a button, not a "state" toggle in terms of active highlighting
                            icon={isSidebarOpen ? <SidebarClose className="h-4 w-4" /> : <SidebarOpen className="h-4 w-4" />}
                            title={isSidebarOpen ? "Hide Sidebar (Focus Mode)" : "Show Sidebar"}
                        />
                    </div>
                    <div className="hidden lg:block mx-1 h-5 w-px bg-[var(--border-primary)]/50" />
                 </>
             )}

             {/* History Group */}
             <div className="flex bg-[var(--bg-secondary)] rounded-md border border-[var(--border-primary)] p-0.5">
                <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
                    isActive={false}
                    icon={<Undo className="h-4 w-4" />}
                    title="Undo"
                />
                <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
                    isActive={false}
                    icon={<Redo className="h-4 w-4" />}
                    title="Redo"
                />
             </div>

             <div className="mx-1 h-5 w-px bg-[var(--border-primary)]/50" />

             {/* Style Group (Headings) */}
             <div className="flex bg-[var(--bg-secondary)] rounded-md border border-[var(--border-primary)] p-0.5">
                 <div className="flex items-center">
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
             </div>

             <div className="mx-1 h-5 w-px bg-[var(--border-primary)]/50" />

             {/* Formatting Group */}
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
                <ToolbarButton
                        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
                        isActive={editor.isActive("strike")}
                        icon={<Strikethrough className="h-4 w-4" />}
                        title="Strikethrough"
                />
                 <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleCode().run(); }}
                    isActive={editor.isActive("code")}
                    icon={<Code className="h-4 w-4" />}
                    title="Inline Code"
                />
                 {/* Highlight Color Picker */}
                 <div className="relative group border-l border-[var(--border-primary)]/50 ml-0.5 pl-0.5">
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
            </div>

            <div className="mx-1 h-5 w-px bg-[var(--border-primary)]/50" />
            
            {/* Alignment Group */}
             <div className="flex bg-[var(--bg-secondary)] rounded-md border border-[var(--border-primary)] p-0.5">
                <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('left').run(); }}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    icon={<AlignLeft className="h-4 w-4" />}
                    title="Align Left"
                />
                <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('center').run(); }}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    icon={<AlignCenter className="h-4 w-4" />}
                    title="Align Center"
                />
                 <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('right').run(); }}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    icon={<AlignRight className="h-4 w-4" />}
                    title="Align Right"
                />
             </div>

             <div className="mx-1 h-5 w-px bg-[var(--border-primary)]/50" />

             {/* Lists & Insert Group */}
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
                 <div className="w-px h-5 bg-[var(--border-primary)]/50 mx-0.5" />
                 <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
                    isActive={editor.isActive("blockquote")}
                    icon={<Quote className="h-4 w-4" />}
                    title="Blockquote"
                />
                 <ToolbarButton
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleCodeBlock().run(); }}
                    isActive={editor.isActive("codeBlock")}
                    icon={<span className="font-mono text-xs font-bold">{"{}"}</span>}
                    title="Code Block"
                />
                <ToolbarButton
                        onClick={(e) => { e.preventDefault(); editor.chain().focus().setHorizontalRule().run(); }}
                        isActive={false}
                        icon={<Minus className="h-4 w-4" />}
                        title="Horizontal Rule"
                />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

             {/* Full Screen Toggle */}
            <div className="flex bg-[var(--bg-secondary)] rounded-md border border-[var(--border-primary)] p-0.5 ml-1">
               <ToolbarButton
                  onClick={toggleFullScreen}
                  isActive={isFullScreen}
                  icon={isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  title={isFullScreen ? "Minimize" : "Full Screen"}
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
      
      <div className="editor-scroll-container flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
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
