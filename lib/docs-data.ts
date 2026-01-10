import { BookOpen, Code, Database, FileText, Keyboard, Layout, Search, Settings, Share2, Zap, Sparkles } from "lucide-react";

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
    id: "dashboard",
    title: "Your Dashboard",
    icon: Layout,
    content: "Your command center. Get a bird’s-eye view of your learning progress.",
    subsections: [
        {
            id: "activity-heatmap",
            title: "Contribution Heatmap",
            content: "Visualize your consistency over the last year. Every new snippet or edit lights up a square, motivating you to keep the streak alive."
        },
        {
            id: "focus-library",
            title: "Focus & Library",
            content: "Jump back into 'Recent Activity' or browse your 'Library' of technologies. The dashboard intelligently surfaces what you use most."
        }
    ]
  },
  {
      id: "collections",
      title: "Collections",
      icon: FileText,
      content: "Group related snippets into curated lists for easy access or sharing.",
      subsections: [
          {
              id: "creating-collections",
              title: "Curate Your Knowledge",
              content: "Create collections like 'React Best Practices' or 'Python Scripts'. Add snippets from any technology to build extensive guides."
          }
      ]
  },
  {
    id: "editor",
    title: "The Editor",
    icon: Code,
    content: "Our unified editor combines valid markdown writing with a rich-text experience, complete with an intelligent sidekick.",
    subsections: [
        {
            id: "clean-mode",
            title: "Distraction-Free Writing",
            content: "The editor is designed to keep you in flow. The sidebar tucks away, toolbar floats or sticks intelligently, and the interface adapts to mobile or desktop automatically."
        },
        {
            id: "code-blocks",
            title: "Smart Code Blocks",
            content: "Type ``` to start a code block. We use CodeMirror 6 under the hood, giving you VS Code-like power (syntax highlighting, bracket matching) right inside your notes."
        },
        {
            id: "sidebar-tools",
            title: "The Inspector Sidebar",
            content: "Toggle the right sidebar to see metadata, incoming backlinks, and outlinks. It's your command center for connecting ideas."
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
  },
  {
      id: "ask-feature",
      title: "Ask Your Notes",
      icon: Sparkles,
      content: "Transform your static notes into an interactive knowledge base. Use natural language to query your snippets and get instant, context-aware answers.",
      subsections: [
          {
              id: "ai-analysis",
              title: "AI Analysis",
              content: "Our advanced AI analyzes your question against your entire snippet library to synthesize comprehensive answers, not just keyword matches."
          },
          {
              id: "source-transparency",
              title: "Source Transparency",
              content: "Every answer comes with citations. See exactly which snippets were used to generate the response, complete with similarity scores."
          },
          {
              id: "conversation-history",
              title: "Conversation History",
              content: "Your questions and answers are saved locally, allowing you to easily revisit past insights without re-querying."
          }
      ]
  }
];
