"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry : "";
}

export async function createPlannerEvent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("planner_events").insert({
    user_id: user.id,
    title: value(formData, "title"),
    entry_date: value(formData, "entryDate"),
    start_time: value(formData, "startTime") || null,
    end_time: value(formData, "endTime") || null,
    tone: value(formData, "tone") || "blue",
    notes: value(formData, "notes") || null,
  });

  revalidatePath("/app");
  revalidatePath("/app/calendar");
}

export async function deletePlannerEvent(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("planner_events").delete().eq("id", value(formData, "id"));
  revalidatePath("/app");
  revalidatePath("/app/calendar");
}
