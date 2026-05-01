"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function createSection(formData: FormData) {
  const name = getValue(formData, "name").trim();
  const redirectSection = getValue(formData, "redirectSection") || "notes";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !name) {
    redirect(`/app?section=${redirectSection}`);
  }

  const slugBase = slugify(name) || "section";
  let slug = slugBase;
  let counter = 1;

  while (true) {
    const { data: existing } = await supabase
      .from("workspace_sections")
      .select("id")
      .eq("user_id", user.id)
      .eq("slug", slug)
      .maybeSingle();

    if (!existing) {
      break;
    }

    counter += 1;
    slug = `${slugBase}-${counter}`;
  }

  const { data: lastSection } = await supabase
    .from("workspace_sections")
    .select("sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from("workspace_sections").insert({
    user_id: user.id,
    name,
    slug,
    color: "custom",
    sort_order: (lastSection?.sort_order ?? -1) + 1,
    is_system: false,
  });

  revalidatePath("/app");
  redirect(`/app?section=${slug}`);
}

export async function renameSection(formData: FormData) {
  const id = getValue(formData, "id");
  const name = getValue(formData, "name").trim();
  const slug = getValue(formData, "slug") || "notes";
  const supabase = await createClient();

  if (name) {
    await supabase.from("workspace_sections").update({ name }).eq("id", id);
  }

  revalidatePath("/app");
  redirect(`/app?section=${slug}`);
}

export async function deleteSection(formData: FormData) {
  const id = getValue(formData, "id");
  const slug = getValue(formData, "slug");
  const fallbackSlug = "notes";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: section } = await supabase
    .from("workspace_sections")
    .select("id, slug, is_system")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!section || section.is_system) {
    redirect(`/app?section=${slug || fallbackSlug}`);
  }

  const { data: fallbackSection } = await supabase
    .from("workspace_sections")
    .select("id, slug")
    .eq("user_id", user.id)
    .eq("slug", fallbackSlug)
    .single();

  if (fallbackSection) {
    await supabase
      .from("documents")
      .update({ section_id: fallbackSection.id })
      .eq("user_id", user.id)
      .eq("section_id", id);
  }

  await supabase.from("workspace_sections").delete().eq("id", id);

  revalidatePath("/app");
  redirect(`/app?section=${fallbackSection?.slug ?? fallbackSlug}`);
}
