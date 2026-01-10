# Snippets - Your Programming Knowledge Vault

A minimal, distraction-free web application for developers to store, organize, and manage code snippets, configuration files, and technical notes. Built with Next.js 16, Supabase, and CodeMirror 6.

![Version](https://img.shields.io/badge/version-1.0.0--beta-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

### 🎯 Core Functionality
- **Unified Entry Editor**: A powerful, distraction-free writing environment that combines Tiptap rich text with CodeMirror 6 code blocks.
- **Smart Knowledge Graph**: Bi-directional linking between snippets (Mentions & Backlinks).
- **Ask AI**: Natural language interface to query your entire knowledge base, providing synthesized answers with sources.

### 📊 Dashboard & Analytics
- **Activity Heatmap**: GitHub-style contribution graph to track your learning consistency.
- **Interactive Onboarding**: Guided tours for new users to explain the Dashboard and Editor.
- **Focus Mode**: Smart suggestions based on recently viewed and edited snippets.

### 🔐 Authentication & Security
- **Magic Link Authentication**: Passwordless email-based login via Supabase.
- **Row Level Security (RLS)**: Strict database-level isolation ensuring user data privacy.

### 📱 User Interface
- **Responsive Design**: Mobile-first architecture with swipeable toolbars and overlay sidebars.
- **Dark Theme**: Eye-friendly dark mode using Tailwind 4 CSS variables.
- **Micro-Interactions**: Smooth animations using Framer Motion and Lucide icons.

### 🛠️ Developer Experience
- **Full CRUD**: Robust server actions for detailed data management.
- **Collections**: Curate snippets across different technologies into logical groups.
- **Type Safety**: End-to-end TypeScript coverage from DB (Drizzle) to UI.

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16.1 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Editor**: TipTap + CodeMirror 6

### Backend
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth
- **API**: Next.js Server Actions

### Code Editor
- **Core**: CodeMirror 6
- **Languages**: JavaScript, TypeScript, Python, CSS, HTML, JSON, SQL, and more
- **Theme**: One Dark
- **Features**: Auto-completion, syntax highlighting, line numbers

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd snippets
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Connection (for Drizzle)
DATABASE_URL=your_postgres_connection_string
```

**How to get these values:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to Settings → API
4. Copy the Project URL and anon/public key
5. For DATABASE_URL, go to Settings → Database → Connection String (Direct connection)

### 4. Database Setup

#### Run Drizzle Migrations
```bash
npm run db:push
```

This will create the necessary tables in your Supabase database:
- `technologies` - Technology categories (React, Python, Docker, etc.)
- `entries` - Code snippets and notes

#### Enable Row Level Security (RLS)
Run these SQL commands in your Supabase SQL Editor:

```sql
-- Enable RLS on technologies table
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own technologies"
  ON technologies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own technologies"
  ON technologies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own technologies"
  ON technologies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own technologies"
  ON technologies FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on entries table
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own entries"
  ON entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries"
  ON entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
  ON entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
  ON entries FOR DELETE
  USING (auth.uid() = user_id);
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
snippets/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication routes
│   │   └── login/               # Login page
│   ├── dashboard/               # Main dashboard
│   ├── technology/[id]/         # Technology detail pages
│   │   ├── page.tsx            # Entry list
│   │   ├── new/                # Create new entry
│   │   └── edit/[entryId]/     # Edit entry
│   ├── about/                   # About page
│   ├── docs/                    # Documentation page
│   ├── privacy/                 # Privacy policy
│   ├── terms/                   # Terms of service
│   └── page.tsx                 # Landing page
├── components/
│   ├── dashboard/               # Dashboard components
│   │   ├── header.tsx          # App header
│   │   ├── tech-card.tsx       # Technology card
│   │   └── entry-card.tsx      # Entry card
│   ├── editor/                  # Editor components
│   │   ├── tiptap-editor.tsx   # Main editor
│   │   └── codemirror-block.tsx # Code block editor
│   ├── landing/                 # Landing page components
│   │   └── sticky-nav.tsx      # Sticky navigation
│   └── ui/                      # Reusable UI components
├── lib/
│   ├── actions/                 # Server actions
│   │   ├── technology.ts       # Technology CRUD
│   │   └── entry.ts            # Entry CRUD
│   ├── drizzle/                 # Database
│   │   ├── schema.ts           # Database schema
│   │   └── db.ts               # Database client
│   └── supabase/                # Supabase clients
│       ├── client.ts           # Client-side
│       └── server.ts           # Server-side
└── middleware.ts                # Auth middleware
```

## 🎨 Key Features Explained

### CodeMirror Integration
The app uses a custom CodeMirror 6 integration for code blocks:
- **Language Detection**: Automatically switches syntax highlighting based on selected language
- **Professional Features**: Line numbers, active line highlighting, bracket matching
- **Theme**: One Dark theme for consistency
- **Copy Button**: One-click copy to clipboard

### Responsive Design
- **Mobile-First**: All pages optimized for mobile devices
- **Breakpoints**: 
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Touch-Friendly**: Larger touch targets on mobile

### Landing Page
- **Sticky Navigation**: Transforms from transparent to compact on scroll
- **Animated Features**: Staggered fade-in animations
- **FAQ Accordion**: Collapsible questions with smooth transitions
- **Before/After Demo**: Visual comparison of organized vs. scattered notes

## 🚀 Deployment to Vercel

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Manual Deployment

#### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

#### 2. Import to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### 3. Environment Variables
Add these in Vercel → Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
```

#### 4. Deploy
Click "Deploy" and wait for the build to complete.

#### 5. Configure Supabase Redirect URLs
In Supabase Dashboard → Authentication → URL Configuration:
- Add your Vercel domain to "Site URL"
- Add `https://your-domain.vercel.app/auth/callback` to "Redirect URLs"

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema changes
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## 🔧 Configuration

### Tailwind CSS
The app uses Tailwind CSS 4 with custom CSS variables for theming. See `app/globals.css` for theme configuration.

### Database Schema
Schema is defined in `lib/drizzle/schema.ts` using Drizzle ORM. To modify:
1. Edit `schema.ts`
2. Run `npm run db:push` to apply changes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [CodeMirror](https://codemirror.net/) - Code editor
- [TipTap](https://tiptap.dev/) - Rich text editor
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Lucide](https://lucide.dev/) - Icon library

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for developers who value clarity and organization.**
