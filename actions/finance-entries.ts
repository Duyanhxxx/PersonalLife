"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry : "";
}

export async function createFinanceEntry(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("finance_entries").insert({
    user_id: user.id,
    entry_date: value(formData, "entryDate"),
    title: value(formData, "title"),
    amount: Number(value(formData, "amount") || 0),
    entry_type: value(formData, "entryType") || "expense",
    category: value(formData, "category") || "general",
  });

  revalidatePath("/app");
}

export async function deleteFinanceEntry(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("finance_entries").delete().eq("id", value(formData, "id"));
  revalidatePath("/app");
}

export async function updateFinanceEntry(formData: FormData) {
  const supabase = await createClient();
  const id = value(formData, "id");
  
  await supabase.from("finance_entries").update({
    entry_date: value(formData, "entryDate"),
    title: value(formData, "title"),
    amount: Number(value(formData, "amount") || 0),
    entry_type: value(formData, "entryType"),
    category: value(formData, "category"),
  }).eq("id", id);

  revalidatePath("/app");
}

