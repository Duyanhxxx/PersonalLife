"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry : "";
}

export async function createReadingBook(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const file = formData.get("cover");
  let coverPath: string | null = null;
  let coverUrl: string | null = null;

  if (file instanceof File && file.size > 0) {
    coverPath = `${user.id}/${crypto.randomUUID()}-${file.name}`;
    await supabase.storage.from("book-covers").upload(coverPath, file, {
      contentType: file.type,
      upsert: false,
    });
    const { data } = supabase.storage.from("book-covers").getPublicUrl(coverPath);
    coverUrl = data.publicUrl;
  }

  await supabase.from("reading_books").insert({
    user_id: user.id,
    title: value(formData, "title"),
    author: value(formData, "author") || null,
    status: value(formData, "status") || "to_read",
    cover_path: coverPath,
    cover_url: coverUrl,
  });

  revalidatePath("/app");
}

export async function updateReadingStatus(formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("reading_books")
    .update({ status: value(formData, "status") })
    .eq("id", value(formData, "id"));
  revalidatePath("/app");
}

export async function deleteReadingBook(formData: FormData) {
  const supabase = await createClient();
  const id = value(formData, "id");
  const path = value(formData, "coverPath");

  if (path) {
    await supabase.storage.from("book-covers").remove([path]);
  }

  await supabase.from("reading_books").delete().eq("id", id);
  revalidatePath("/app");
}
