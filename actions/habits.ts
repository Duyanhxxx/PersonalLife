"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function getValue(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function createHabit(formData: FormData) {
  const title = getValue(formData, "title").trim();
  const color = getValue(formData, "color") || "blue";
  if (!title) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("habits").insert({ user_id: user.id, title, color });
  revalidatePath("/app/habits");
}

export async function toggleHabitLog(formData: FormData) {
  const habitId = getValue(formData, "habitId");
  const isDone = getValue(formData, "isDone") === "true";
  const logId = getValue(formData, "logId");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (isDone && logId) {
    await supabase.from("habit_logs").delete().eq("id", logId);
  } else {
    await supabase
      .from("habit_logs")
      .upsert(
        { habit_id: habitId, user_id: user.id },
        { onConflict: "habit_id,log_date", ignoreDuplicates: true },
      );
  }

  revalidatePath("/app/habits");
}

export async function deleteHabit(formData: FormData) {
  const id = getValue(formData, "id");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("habits").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/app/habits");
}
