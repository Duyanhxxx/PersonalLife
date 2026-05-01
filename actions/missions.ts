"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry : "";
}

export async function createMission(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("missions").insert({
    user_id: user.id,
    title: value(formData, "title"),
    color: value(formData, "color") || "blue",
    target_value: Number(value(formData, "targetValue") || 100),
    current_value: Number(value(formData, "currentValue") || 0),
  });

  revalidatePath("/app");
}

export async function addMissionProgress(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const missionId = value(formData, "missionId");
  const delta = Number(value(formData, "progressDelta") || 0);

  await supabase.from("mission_entries").insert({
    mission_id: missionId,
    user_id: user.id,
    entry_date: value(formData, "entryDate"),
    progress_delta: delta,
    note: value(formData, "note") || null,
  });

  const { data: mission } = await supabase
    .from("missions")
    .select("current_value")
    .eq("id", missionId)
    .single();

  await supabase
    .from("missions")
    .update({ current_value: (mission?.current_value ?? 0) + delta })
    .eq("id", missionId);

  revalidatePath("/app");
}

export async function deleteMission(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("missions").delete().eq("id", value(formData, "id"));
  revalidatePath("/app");
}
