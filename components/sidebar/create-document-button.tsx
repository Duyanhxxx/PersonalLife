import { createDocument } from "@/actions/documents";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type CreateDocumentButtonProps = {
  sectionSlug: string;
  parentId?: string;
  title?: string;
  kind?: "page" | "database";
  compact?: boolean;
};

export function CreateDocumentButton({
  sectionSlug,
  parentId,
  title = "Untitled",
  kind = "page",
  compact = false,
}: CreateDocumentButtonProps) {
  return (
    <form action={createDocument}>
      <input name="sectionSlug" type="hidden" value={sectionSlug} />
      <input name="title" type="hidden" value={title} />
      <input name="kind" type="hidden" value={kind} />
      {parentId ? <input name="parentId" type="hidden" value={parentId} /> : null}
      <Button size={compact ? "icon-sm" : "sm"} type="submit" variant={compact ? "ghost" : "secondary"}>
        <Plus className="size-4" />
        {compact ? null : kind === "database" ? "New database" : "New page"}
      </Button>
    </form>
  );
}
