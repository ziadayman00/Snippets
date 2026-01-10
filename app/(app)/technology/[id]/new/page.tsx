import { UnifiedEntryEditor } from "@/components/editor/unified-entry-editor";
import { db } from "@/lib/drizzle/db";
import { technologies } from "@/lib/drizzle/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

export default async function NewEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch technology to get name
  const tech = await db.query.technologies.findFirst({
    where: eq(technologies.id, id),
  });

  if (!tech) {
    notFound();
  }

  return (
    <UnifiedEntryEditor 
        isNew={true}
        technologyId={id}
        technologyName={tech.name}
    />
  );
}
