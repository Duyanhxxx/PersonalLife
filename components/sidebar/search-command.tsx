"use client";

import { Dialog } from "@base-ui/react";
import { Search, FileText, X, Command } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { searchDocuments } from "@/actions/documents";
import Link from "next/link";

type SearchResult = {
  id: string;
  title: string;
  sectionSlug: string;
};

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!query.trim()) return;

    const timer = setTimeout(() => {
      startTransition(async () => {
        const data = await searchDocuments(query);
        setResults(data);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const visibleResults = query.trim() ? results : [];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 transition hover:border-gray-400 hover:text-gray-900"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Tìm kiếm...</span>
        <kbd className="hidden items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 font-mono text-[10px] font-medium text-gray-500 md:flex">
          <Command className="size-2.5" /> K
        </kbd>
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-300 data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
          <Dialog.Popup className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 rounded-[2rem] border border-gray-200 bg-white p-2 shadow-2xl transition-all duration-300 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100 outline-none">
            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
              <Search className="size-5 text-gray-400" />
              <input
                autoFocus
                className="flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm tài liệu..."
                value={query}
              />
              <Dialog.Close className="rounded-xl p-1 text-gray-400 hover:bg-gray-100 transition-colors">
                <X className="size-5" />
              </Dialog.Close>
            </div>

            <div className="max-h-[300px] overflow-y-auto p-2">
              {isPending && query && (
                <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                  Đang tìm kiếm...
                </div>
              )}
              
              {!isPending && query && visibleResults.length === 0 && (
                <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                  Không tìm thấy kết quả nào cho &quot;{query}&quot;
                </div>
              )}

              {!query && (
                <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                  Nhập từ khóa để bắt đầu tìm kiếm
                </div>
              )}

              <div className="space-y-1">
                {visibleResults.map((result) => (
                  <Link
                    key={result.id}
                    href={`/app/${result.sectionSlug}?document=${result.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                  >
                    <FileText className="size-4 text-gray-400" />
                    <span className="flex-1 truncate font-medium">{result.title}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      {result.sectionSlug}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-gray-100 px-4 py-3 text-[10px] text-gray-400">
              <div className="flex items-center gap-1">
                <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5">Enter</kbd>
                <span>để chọn</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5">Esc</kbd>
                <span>để đóng</span>
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
