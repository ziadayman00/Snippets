import { UnifiedEntryEditor } from "@/components/editor/unified-entry-editor";
import { db } from "@/lib/drizzle/db";
import { entries, technologies } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { getEntryTags } from "@/lib/actions/tags";
import { EditorTour } from "@/components/onboarding/editor-tour";

export default async function EditEntryPage({
 params,
}: {
  params: Promise<{ id: string; entryId: string }>;
}) {
  const { id, entryId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch technology
  const tech = await db.query.technologies.findFirst({
    where: eq(technologies.id, id),
  });

  if (!tech) {
    notFound();
  }

  // Fetch entry with relations
  const entry = await db.query.entries.findFirst({
    where: eq(entries.id, entryId),
    with: {
        outgoingLinks: {
            with: { target: true }
        },
        incomingLinks: {
            with: { source: true }
        }
    }
  });

  if (!entry) {
    notFound();
  }

  // Update last viewed
  await db.update(entries)
    .set({ lastViewedAt: new Date() })
    .where(eq(entries.id, entryId));

  const tags = await getEntryTags(entryId);
  const tagNames = tags.map(t => t.name);

  return (
    <div className="h-screen overflow-hidden bg-[var(--bg-primary)]">
      <UnifiedEntryEditor 
        entryId={entryId}
        technologyId={id}
        technologyName={tech.name}
        initialTitle={entry.title}
        initialTags={tagNames}
        initialContent={entry.content}
        incomingLinks={entry.incomingLinks}
        initialOutgoingLinks={entry.outgoingLinks}
        lastUpdated={entry.updatedAt}
      />
      <EditorTour />
    </div>
  );
}
