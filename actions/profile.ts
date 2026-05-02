"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function changePassword(formData: FormData) {
  const password = (formData.get("password") as string | null)?.trim() ?? "";
  const confirm = (formData.get("confirm") as string | null)?.trim() ?? "";

  if (!password || password !== confirm || password.length < 8) {
    redirect("/app/settings?error=password");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect("/app/settings?error=password");
  }

  revalidatePath("/app/settings");
  redirect("/app/settings?success=password");
}

export async function changeAvatar(formData: FormData) {
  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (uploadError) {
    redirect("/app/settings?error=avatar");
  }

  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(path);

  await supabase
    .from("profiles")
    .update({ avatar_url: urlData.publicUrl })
    .eq("id", user.id);

  revalidatePath("/app/settings");
  redirect("/app/settings?success=avatar");
}

export async function updateDisplayName(formData: FormData) {
  const name = (formData.get("displayName") as string | null)?.trim() ?? "";
  if (!name) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({ display_name: name })
    .eq("id", user.id);

  revalidatePath("/app/settings");
  redirect("/app/settings?success=name");
}
