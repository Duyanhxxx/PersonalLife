"use client";

import { useSearchParams } from "next/navigation";
import { FilePlus2 } from "lucide-react";
import { CreateDocumentButton } from "@/components/sidebar/create-document-button";
import { DocumentNode } from "@/components/sidebar/document-node";
import type { DocumentTreeNode } from "@/types/document";

type DocumentTreeProps = {
  sectionSlug: string;
  nodes: DocumentTreeNode[];
  onClose?: () => void;
};

export function DocumentTree({ sectionSlug, nodes, onClose }: DocumentTreeProps) {
  const searchParams = useSearchParams();
  const activeDocumentId = searchParams.get("document") ?? undefined;

  if (!nodes.length) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-400 bg-white p-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 text-gray-900">
          <FilePlus2 className="size-4" />
          <p className="font-medium">Chưa có trang trong phần này.</p>
        </div>
        <p className="mt-2 leading-6">
          Bắt đầu với một trang nhẹ, sau đó lồng các cơ sở dữ liệu hoặc tài liệu con bên dưới nó.
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
          onClose={onClose}
          sectionSlug={sectionSlug}
        />
      ))}
    </div>
  );
}
