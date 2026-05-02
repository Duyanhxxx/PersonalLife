"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Quote,
  Undo,
  Redo,
  Link as LinkIcon
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { updateDocumentContent } from "@/actions/documents";

type TiptapEditorProps = {
  documentId: string;
  initialContent: any;
  sectionSlug: string;
};

export function TiptapEditor({ documentId, initialContent, sectionSlug }: TiptapEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Bắt đầu viết nội dung của bạn ở đây...",
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      setSaveStatus("saving");
      
      // Debounce saving to avoid too many requests
      const timeoutId = setTimeout(() => {
        startTransition(async () => {
          try {
            await updateDocumentContent(documentId, json, sectionSlug);
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 2000);
          } catch (error) {
            setSaveStatus("error");
          }
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sticky top-0 z-10">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded-xl transition ${editor.isActive("bold") ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"}`}
          title="In đậm"
        >
          <Bold className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded-xl transition ${editor.isActive("italic") ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"}`}
          title="In nghiêng"
        >
          <Italic className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-xl transition ${editor.isActive("underline") ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"}`}
          title="Gạch chân"
        >
          <UnderlineIcon className="size-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-200 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-xl transition ${editor.isActive("heading", { level: 1 }) ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"}`}
          title="Tiêu đề 1"
        >
          <Heading1 className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-xl transition ${editor.isActive("heading", { level: 2 }) ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"}`}
          title="Tiêu đề 2"
        >
          <Heading2 className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-xl transition ${editor.isActive("bulletList") ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"}`}
          title="Danh sách dấu chấm"
        >
          <List className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-xl transition ${editor.isActive("orderedList") ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"}`}
          title="Danh sách số"
        >
          <ListOrdered className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-xl transition ${editor.isActive("blockquote") ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"}`}
          title="Trích dẫn"
        >
          <Quote className="size-4" />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <button
          onClick={() => {
            const url = window.prompt("Nhập URL liên kết:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-2 rounded-xl transition ${editor.isActive("link") ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"}`}
          title="Thêm liên kết"
        >
          <LinkIcon className="size-4" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-2 px-3 py-1 text-xs text-gray-500">
          {saveStatus === "saving" && <span className="animate-pulse">Đang lưu...</span>}
          {saveStatus === "saved" && <span className="text-emerald-600">Đã lưu</span>}
          {saveStatus === "error" && <span className="text-rose-600">Lỗi lưu!</span>}
        </div>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded-xl transition hover:bg-gray-100 text-gray-700 disabled:opacity-30"
          title="Hoàn tác"
        >
          <Undo className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded-xl transition hover:bg-gray-100 text-gray-700 disabled:opacity-30"
          title="Làm lại"
        >
          <Redo className="size-4" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm focus-within:border-gray-300 transition-colors">
        <EditorContent editor={editor} className="prose prose-sm max-w-none focus:outline-none" />
      </div>
    </div>
  );
}
