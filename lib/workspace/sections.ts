import { systemSectionSlugs, type SystemSectionSlug } from "@/types/workspace";
import { createClient } from "@/lib/supabase/server";

export type WorkspaceSection = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
};

const fallbackLabels: Record<SystemSectionSlug, string> = {
  notes: "Notes",
  finance: "Finance",
  calendar: "Calendar",
  tasks: "To-do",
  habits: "Habits",
  missions: "Missions",
  reading: "Reading",
};

export async function getWorkspaceSections(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workspace_sections")
    .select("id, name, slug, icon")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (!error && data?.length) {
    return data as WorkspaceSection[];
  }

  return systemSectionSlugs.map((slug) => ({
    id: slug,
    name: fallbackLabels[slug],
    slug,
    icon: null,
  }));
}
