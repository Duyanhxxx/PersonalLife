"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Database, FileText } from "lucide-react";
import { CreateDocumentButton } from "@/components/sidebar/create-document-button";
import type { DocumentTreeNode } from "@/types/document";

type DocumentNodeProps = {
  node: DocumentTreeNode;
  sectionSlug: string;
  activeDocumentId?: string;
};

function hasActiveDescendant(node: DocumentTreeNode, activeId?: string): boolean {
  if (!activeId) {
    return false;
  }

  if (node.id === activeId) {
    return true;
  }

  return node.children.some((child) => hasActiveDescendant(child, activeId));
}

export function DocumentNode({
  node,
  sectionSlug,
  activeDocumentId,
}: DocumentNodeProps) {
  const startsOpen = useMemo(
    () => node.children.length > 0 && hasActiveDescendant(node, activeDocumentId),
    [activeDocumentId, node],
  );
  const [isOpen, setIsOpen] = useState(startsOpen);
  const Icon = node.kind === "database" ? Database : FileText;
  const isActive = node.id === activeDocumentId;
  const canExpand = node.children.length > 0;

  return (
    <div className="space-y-1">
      <div
        className={`group flex items-center gap-1 rounded-2xl pr-2 transition ${
          isActive ? "bg-[#05386B] text-[#EDF5E1]" : "hover:bg-white/70"
        }`}
      >
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition hover:text-foreground"
          onClick={() => canExpand && setIsOpen((value) => !value)}
          type="button"
        >
          {canExpand ? (
            isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />
          ) : (
            <span className="size-4" />
          )}
        </button>

        <Link
          className="flex min-w-0 flex-1 items-center gap-2 py-2 text-sm"
          href={`/app?section=${sectionSlug}&document=${node.id}`}
        >
          <Icon className="size-4 shrink-0" />
          <span className="truncate">{node.title}</span>
        </Link>

        <div className="opacity-0 transition group-hover:opacity-100">
          <CreateDocumentButton compact parentId={node.id} sectionSlug={sectionSlug} />
        </div>
      </div>

      {canExpand && isOpen ? (
        <div className="ml-4 border-l border-[#8EE4AF]/40 pl-2">
          {node.children.map((child) => (
            <DocumentNode
              activeDocumentId={activeDocumentId}
              key={child.id}
              node={child}
              sectionSlug={sectionSlug}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
