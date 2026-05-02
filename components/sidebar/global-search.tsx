"use client";

import { useEffect, useState, useTransition } from "react";
import { Search, FileText, CreditCard, CheckSquare, Target, Activity, Command } from "lucide-react";
import { searchAction } from "@/actions/search";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/i18n-context";

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { dictionary } = useI18n();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        const res = await searchAction(query);
        setResults(res);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-[15vh]">
      <div 
        className="w-full max-w-2xl rounded-[2rem] border border-gray-200 bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
          <Search className="size-5 text-gray-400" />
          <input
            autoFocus
            className="flex-1 bg-transparent text-lg text-gray-900 outline-none placeholder:text-gray-400"
            placeholder={dictionary.common.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="hidden md:flex h-6 items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 text-[10px] font-medium text-gray-500">
            <span className="text-xs">ESC</span>
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => {
                    router.push(result.url);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left hover:bg-gray-100 transition-colors"
                >
                  <div className="flex size-8 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                    {result.type === "document" && <FileText className="size-4" />}
                    {result.type === "finance" && <CreditCard className="size-4" />}
                    {result.type === "task" && <CheckSquare className="size-4" />}
                    {result.type === "mission" && <Target className="size-4" />}
                    {result.type === "habit" && <Activity className="size-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{result.title}</p>
                    <p className="text-xs text-gray-500 capitalize">{result.type}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">No results found for "{query}"</p>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Command className="mx-auto size-8 text-gray-200 mb-4" />
              <p className="text-sm text-gray-500">Search for documents, transactions, tasks and more...</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-3">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              <kbd className="rounded border border-gray-200 bg-white px-1 py-0.5 text-gray-500">ENTER</kbd>
              <span>to select</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">
            Close
          </button>
        </div>
      </div>
      {/* Backdrop click to close */}
      <div className="fixed inset-0 -z-10" onClick={() => setIsOpen(false)} />
    </div>
  );
}
