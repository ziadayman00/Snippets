import { BookOpen, Code, Database, FileText, Keyboard, Layout, Search, Settings, Share2, Zap } from "lucide-react";

export interface DocSection {
  id: string;
  title: string;
  icon: any;
  content: string;
  subsections?: {
    id: string;
    title: string;
    content: string;
  }[];
}

export const DOCS_DATA: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Zap,
    content: "Welcome to Snippets! This guide will help you set up your account and structure your knowledge vault for maximum efficiency.",
    subsections: [
        {
            id: "account-setup",
            title: "Account Setup",
            content: "Sign up is passwordless. Just enter your email, and we'll send you a magic link. Once logged in, you can customize your profile and set your preferred theme."
        },
        {
            id: "first-technology",
            title: "Creating Your First Technology",
            content: "Snippets organizes code by 'Technology'. Think of these as top-level folders like 'React', 'Python', or 'DevOps'. Click the '+ New Technology' button on the dashboard to get started."
        }
    ]
  },
  {
    id: "editor",
    title: "The Editor",
    icon: Code,
    content: "Our editor is powered by CodeMirror 6 and Tiptap, giving you a best-in-class experience for both rich text and code.",
    subsections: [
        {
            id: "markdown",
            title: "Rich Text Support",
            content: "Write freely with full markdown support. Use standard shortcuts like **Cmd+B** for bold, **#** for headings, and **-** for lists."
        },
        {
            id: "code-blocks",
            title: "Smart Code Blocks",
            content: "Type ``` to start a code block. The editor automatically detects the language (or you can set it manually) and applies syntax highlighting."
        }
    ]
  },
  {
    id: "knowledge-graph",
    title: "Knowledge Graph",
    icon: Database,
    content: "Connect your snippets to create a personal knowledge web.",
    subsections: [
        {
            id: "linking",
            title: "Linking Snippets",
            content: "Type '@' anywhere in the editor to bring up the snippet linker. Select a snippet to create a bidirectional connection."
        },
        {
            id: "backlinks",
            title: "Bi-Directional References",
            content: "When you link to a snippet, a backlink is automatically created on the target snippet. Check the 'Context' sidebar to see all incoming connections."
        }
    ]
  },
  {
      id: "search",
      title: "Search & Discovery",
      icon: Search,
      content: "Find what you need, instantly.",
      subsections: [
          {
              id: "semantic-search",
              title: "Semantic Search",
              content: "Our search doesn't just look for keywords. It understands intent. You can search for 'how to center a div' and find snippets about Flexbox, even if they don't contain the exact words."
          },
          {
              id: "quick-find",
              title: "Quick Find (Cmd+K)",
              content: "Press Cmd+K (or Ctrl+K) anywhere in the app to open the Omni-search bar. Navigate your entire vault without lifting your hands from the keyboard."
          }
      ]
  }
];
