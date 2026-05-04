"use server";

import { createClient } from "@/lib/supabase/server";
import type { JSONContent } from "@tiptap/core";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type SearchDocumentRow = {
  id: string;
  title: string;
  workspace_sections:
    | { slug: string | null }
    | Array<{ slug: string | null }>
    | null;
};

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function resolveSectionId(userId: string, slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("workspace_sections")
    .select("id")
    .eq("user_id", userId)
    .eq("slug", slug)
    .single();

  return data?.id ?? null;
}

export async function createDocument(formData: FormData) {
  const sectionSlug = getValue(formData, "sectionSlug");
  const title = getValue(formData, "title") || "Untitled";
  const kind = getValue(formData, "kind") || "page";
  const parentId = getValue(formData, "parentId") || null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const sectionId = await resolveSectionId(user.id, sectionSlug);
  let siblingsQuery = supabase
    .from("documents")
    .select("position")
    .eq("user_id", user.id)
    .eq("section_id", sectionId)
    .order("position", { ascending: false })
    .limit(1);

  siblingsQuery = parentId
    ? siblingsQuery.eq("parent_id", parentId)
    : siblingsQuery.is("parent_id", null);

  const { data: siblings } = await siblingsQuery;

  const position = (siblings?.[0]?.position ?? -1) + 1;

  const { data } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      section_id: sectionId,
      parent_id: parentId,
      title,
      kind,
      position,
      last_edited_by: user.id,
    })
    .select("id")
    .single();

  revalidatePath("/app");
  redirect(`/app/${sectionSlug}?document=${data?.id ?? ""}`);
}

export async function updateDocumentContent(
  id: string,
  content: JSONContent | null,
  sectionSlug: string,
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("documents")
    .update({ 
      content, 
      updated_at: new Date().toISOString(),
      last_edited_by: user.id 
    })
    .eq("id", id);

  revalidatePath(`/app/${sectionSlug}`);
}

export async function renameDocument(formData: FormData) {
  const id = getValue(formData, "id");
  const title = getValue(formData, "title") || "Untitled";
  const supabase = await createClient();

  await supabase.from("documents").update({ title }).eq("id", id);
  revalidatePath("/app");
}

export async function archiveDocument(formData: FormData) {
  const id = getValue(formData, "id");
  const sectionSlug = getValue(formData, "sectionSlug") || "notes";
  const supabase = await createClient();

  await supabase
    .from("documents")
    .update({
      is_archived: true,
      archived_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/app");
  redirect(`/app/${sectionSlug}`);
}

export async function restoreDocument(formData: FormData) {
  const id = getValue(formData, "id");
  const sectionSlug = getValue(formData, "sectionSlug") || "notes";
  const supabase = await createClient();

  await supabase
    .from("documents")
    .update({
      is_archived: false,
      archived_at: null,
    })
    .eq("id", id);

  revalidatePath("/app");
  redirect(`/app/${sectionSlug}?document=${id}`);
}

export async function searchDocuments(query: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !query.trim()) return [];

  const { data } = await supabase
    .from("documents")
    .select("id, title, workspace_sections(slug)")
    .eq("user_id", user.id)
    .ilike("title", `%${query}%`)
    .limit(10);

  return ((data ?? []) as SearchDocumentRow[]).map((doc) => ({
    id: doc.id,
    title: doc.title,
    sectionSlug:
      (Array.isArray(doc.workspace_sections)
        ? doc.workspace_sections[0]?.slug
        : doc.workspace_sections?.slug) || "notes",
  }));
}
