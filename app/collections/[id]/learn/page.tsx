import { getCollectionForLearning } from "@/lib/actions/collections";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { CollectionLearner } from "@/components/collections/collection-learner";

export default async function LearningPage({
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

  const collection = await getCollectionForLearning(id);

  if (!collection) {
    notFound();
  }

  return <CollectionLearner collection={collection} />;
}
