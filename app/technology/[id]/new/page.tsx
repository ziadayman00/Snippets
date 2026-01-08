"use client";

import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { createEntry } from "@/lib/actions/entry";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { TagInput } from "@/components/tags/tag-input";

export default function NewEntryPage() {
  const params = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("technologyId", params.id as string);
    formData.append("tags", JSON.stringify(tags));

    try {
      const result = await createEntry(formData);
      if (result.success && result.entryId) {
        router.push(`/technology/${params.id}/edit/${result.entryId}`);
      } else {
        router.push(`/technology/${params.id}`);
      }
      router.refresh(); 
    } catch (error) {
      console.error(error);
      alert("Failed to create entry");
      setLoading(false);
    }
  };

 
  return (
    <div className="flex h-screen flex-col bg-[var(--bg-primary)]">
      <form onSubmit={handleSubmit} className="container mx-auto flex h-full max-w-5xl flex-col px-4 sm:px-6 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href={`/technology/${params.id}`}
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </Link>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]">
              New Entry
            </h1>
          </div>

          <button
            type="submit"
            disabled={loading || !title || !content}
            className="flex items-center justify-center gap-2 rounded-md bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90 disabled:opacity-50 w-full sm:w-auto"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Save Entry</span>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 sm:gap-6 overflow-hidden">
          <input
            type="text"
            placeholder="Entry Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full shrink-0 bg-transparent text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
            autoFocus
            required
          />
          
          <div className="shrink-0">
             <TagInput onChange={setTags} />
          </div>

          <TiptapEditor
            onChange={(json) => setContent(json)}
            editable={!loading}
            className="flex-1 overflow-y-auto" 
          />
        </div>
      </form>
    </div>
  );
}
