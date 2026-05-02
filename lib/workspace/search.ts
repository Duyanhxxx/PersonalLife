import { createClient } from "@/lib/supabase/server";

export async function globalSearch(userId: string, query: string) {
  if (!query || query.length < 2) return [];
  const supabase = await createClient();

  const [docs, finance, tasks, missions, habits] = await Promise.all([
    supabase
      .from("documents")
      .select("id, title, kind")
      .eq("user_id", userId)
      .ilike("title", `%${query}%`)
      .limit(5),
    supabase
      .from("finance_entries")
      .select("id, title, amount, entry_type")
      .eq("user_id", userId)
      .ilike("title", `%${query}%`)
      .limit(5),
    supabase
      .from("todo_items")
      .select("id, title, priority")
      .eq("user_id", userId)
      .ilike("title", `%${query}%`)
      .limit(5),
    supabase
      .from("missions")
      .select("id, title")
      .eq("user_id", userId)
      .ilike("title", `%${query}%`)
      .limit(5),
    supabase
      .from("habits")
      .select("id, title")
      .eq("user_id", userId)
      .ilike("title", `%${query}%`)
      .limit(5),
  ]);

  const results = [
    ...(docs.data ?? []).map((d) => ({ id: d.id, title: d.title, type: "document", url: `/app/notes?document=${d.id}` })),
    ...(finance.data ?? []).map((f) => ({ id: f.id, title: `${f.title} (${f.amount})`, type: "finance", url: "/app/finance" })),
    ...(tasks.data ?? []).map((t) => ({ id: t.id, title: t.title, type: "task", url: "/app/tasks" })),
    ...(missions.data ?? []).map((m) => ({ id: m.id, title: m.title, type: "mission", url: "/app/missions" })),
    ...(habits.data ?? []).map((h) => ({ id: h.id, title: h.title, type: "habit", url: "/app/habits" })),
  ];

  return results;
}
