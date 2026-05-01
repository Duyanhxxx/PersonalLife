export const systemSectionSlugs = [
  "notes",
  "finance",
  "calendar",
  "tasks",
  "habits",
  "missions",
  "reading",
] as const;

export type SystemSectionSlug = (typeof systemSectionSlugs)[number];

export type DocumentKind = "page" | "database" | "view" | "template";

export type EditorKind = "tiptap" | "novel";
