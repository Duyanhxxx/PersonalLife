import { createClient } from "@/lib/supabase/server";
import type { ReadingBook } from "@/types/section-data";

export async function getReadingBooks(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reading_books")
    .select("id, title, author, cover_path, cover_url, status")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return (data ?? []) as ReadingBook[];
}
