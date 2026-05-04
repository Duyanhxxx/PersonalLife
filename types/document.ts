import type { JSONContent } from "@tiptap/core";

export type MetadataValue =
  | string
  | number
  | boolean
  | null
  | MetadataValue[]
  | { [key: string]: MetadataValue };

export type DocumentKind = "page" | "database" | "view" | "template";

export type DocumentRow = {
  id: string;
  user_id: string;
  section_id: string | null;
  parent_id: string | null;
  title: string;
  icon: string | null;
  kind: DocumentKind;
  metadata: Record<string, MetadataValue> | null;
  content: JSONContent | null;
  position: number;
  is_archived: boolean;
  updated_at: string;
  created_at: string;
};

export type DocumentTreeNode = DocumentRow & {
  children: DocumentTreeNode[];
};
