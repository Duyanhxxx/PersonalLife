"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry : "";
}

export async function createTodoItem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("todo_items").insert({
    user_id: user.id,
    entry_date: value(formData, "entryDate"),
    title: value(formData, "title"),
    priority: value(formData, "priority") || "normal",
    color: value(formData, "color") || "blue",
  });

  revalidatePath("/app");
  revalidatePath("/app/tasks");
}

export async function toggleTodoItem(formData: FormData) {
  const supabase = await createClient();
  const id = value(formData, "id");
  const isDone = value(formData, "isDone") === "true";

  await supabase.from("todo_items").update({ is_done: !isDone }).eq("id", id);
  revalidatePath("/app");
  revalidatePath("/app/tasks");
}

export async function deleteTodoItem(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("todo_items").delete().eq("id", value(formData, "id"));
  revalidatePath("/app");
  revalidatePath("/app/tasks");
}
