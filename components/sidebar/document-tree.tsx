"use client";

import { useSearchParams } from "next/navigation";
import { FilePlus2 } from "lucide-react";
import { CreateDocumentButton } from "@/components/sidebar/create-document-button";
import { DocumentNode } from "@/components/sidebar/document-node";
import type { DocumentTreeNode } from "@/types/document";

type DocumentTreeProps = {
  sectionSlug: string;
  nodes: DocumentTreeNode[];
};

export function DocumentTree({ sectionSlug, nodes }: DocumentTreeProps) {
  const searchParams = useSearchParams();
  const activeDocumentId = searchParams.get("document") ?? undefined;

  if (!nodes.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[#379683]/35 bg-white/60 p-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 text-[#05386B]">
          <FilePlus2 className="size-4" />
          <p className="font-medium">No pages yet in this section.</p>
        </div>
        <p className="mt-2 leading-6">
          Start with a lightweight page, then nest databases or child documents under it.
        </p>
        <div className="mt-3">
          <CreateDocumentButton sectionSlug={sectionSlug} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <DocumentNode
          activeDocumentId={activeDocumentId}
          key={node.id}
          node={node}
          sectionSlug={sectionSlug}
        />
      ))}
    </div>
  );
}
