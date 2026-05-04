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
    wallet_id: value(formData, "walletId") || null,
  });

  revalidatePath("/app");
  revalidatePath("/app/finance");
}

export async function deleteFinanceEntry(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("finance_entries").delete().eq("id", value(formData, "id"));
  revalidatePath("/app");
  revalidatePath("/app/finance");
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
    wallet_id: value(formData, "walletId") || null,
  }).eq("id", id);

  revalidatePath("/app");
  revalidatePath("/app/finance");
}

export async function createFinanceWallet(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("finance_wallets").insert({
    user_id: user.id,
    title: value(formData, "title"),
    description: value(formData, "description") || null,
    budget_amount: Number(value(formData, "budgetAmount") || 0),
    color: value(formData, "color") || "blue",
    start_date: value(formData, "startDate") || null,
    end_date: value(formData, "endDate") || null,
  });

  revalidatePath("/app");
  revalidatePath("/app/finance");
}

export async function deleteFinanceWallet(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("finance_wallets").delete().eq("id", value(formData, "id"));
  revalidatePath("/app");
  revalidatePath("/app/finance");
}

export async function createFinanceCommitment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("finance_commitments").insert({
    user_id: user.id,
    wallet_id: value(formData, "walletId") || null,
    title: value(formData, "title"),
    amount: Number(value(formData, "amount") || 0),
    commitment_type: value(formData, "commitmentType") || "expense",
    due_date: value(formData, "dueDate"),
    category: value(formData, "category") || "general",
  });

  revalidatePath("/app");
  revalidatePath("/app/finance");
}

export async function deleteFinanceCommitment(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("finance_commitments").delete().eq("id", value(formData, "id"));
  revalidatePath("/app");
  revalidatePath("/app/finance");
}
