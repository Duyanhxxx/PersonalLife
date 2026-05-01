import { createClient } from "@/lib/supabase/server";
import type { WorkspaceSection } from "@/lib/workspace/sections";
import type { DocumentRow, DocumentTreeNode } from "@/types/document";

function buildDocumentTree(documents: DocumentRow[]) {
  const nodes = new Map<string, DocumentTreeNode>();
  const roots: DocumentTreeNode[] = [];

  documents.forEach((document) => {
    nodes.set(document.id, {
      ...document,
      children: [],
    });
  });

  documents.forEach((document) => {
    const node = nodes.get(document.id);

    if (!node) {
      return;
    }

    if (document.parent_id) {
      const parent = nodes.get(document.parent_id);

      if (parent) {
        parent.children.push(node);
        return;
      }
    }

    roots.push(node);
  });

  return roots;
}

export async function getDocumentsForSidebar(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select(
      "id, user_id, section_id, parent_id, title, icon, kind, position, is_archived, updated_at, created_at",
    )
    .eq("user_id", userId)
    .eq("is_archived", false)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as DocumentRow[];
}

export function groupDocumentsBySection(
  documents: DocumentRow[],
  sections: WorkspaceSection[],
) {
  const sectionIds = new Map(sections.map((section) => [section.id, section.slug]));
  const defaultSectionSlug = sections[0]?.slug ?? "notes";

  return sections.reduce<Record<string, DocumentTreeNode[]>>((acc, section) => {
    const sectionDocuments = documents.filter((document) => {
      const slug = document.section_id
        ? sectionIds.get(document.section_id)
        : defaultSectionSlug;
      return slug === section.slug;
    });

    acc[section.slug] = buildDocumentTree(sectionDocuments);
    return acc;
  }, {});
}

export async function getSectionDocuments(userId: string, sectionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select(
      "id, user_id, section_id, parent_id, title, icon, kind, position, is_archived, updated_at, created_at",
    )
    .eq("user_id", userId)
    .eq("section_id", sectionId)
    .order("is_archived", { ascending: true })
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data) {
    return {
      active: [] as DocumentRow[],
      archived: [] as DocumentRow[],
    };
  }

  const documents = data as DocumentRow[];

  return {
    active: documents.filter((document) => !document.is_archived),
    archived: documents.filter((document) => document.is_archived),
  };
}
