import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/ask/chat-interface";

export const metadata = {
  title: "Ask AI - Snippets",
  description: "Ask questions about your code snippets and notes.",
};

export default async function AskPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[var(--bg-primary)]">
      <div className="flex-1 flex flex-col items-center">
        <ChatInterface />
      </div>
    </div>
  );
}
