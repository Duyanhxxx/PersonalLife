import { archiveDocument, renameDocument } from "@/actions/documents";
import { TemplatePreview } from "@/components/workspace/template-preview";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import type { DocumentRow } from "@/types/document";

type DocumentPanelProps = {
  document: DocumentRow | null;
  sectionSlug: string;
};

export function DocumentPanel({ document, sectionSlug }: DocumentPanelProps) {
  if (!document) {
    return (
      <section className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
        <h3 className="text-2xl font-semibold text-gray-900">Chọn một trang để bắt đầu chỉnh sửa.</h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-700">
          Thanh bên hỗ trợ tài liệu lồng nhau thực sự. Tạo một trang hoặc cơ sở dữ liệu, sau đó chọn nó ở đây để đổi tên, xem xét hoặc lưu trữ.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Tài liệu đang mở
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">
            {document.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-gray-700">
            Đây là {document.kind} đã chọn. Cấu trúc tài liệu và vòng đời hiện đã hoạt động.
          </p>
        </div>

        <form action={archiveDocument}>
          <input name="id" type="hidden" value={document.id} />
          <input name="sectionSlug" type="hidden" value={sectionSlug} />
          <button
            className="rounded-2xl border border-gray-400 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-100"
            type="submit"
          >
            Chuyển vào thùng rác
          </button>
        </form>
      </div>

      <TiptapEditor
        documentId={document.id}
        initialContent={document.content}
        sectionSlug={sectionSlug}
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <form action={renameDocument} className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
          <input name="id" type="hidden" value={document.id} />
          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Đổi tên trang</span>
            <input
              className="h-11 rounded-2xl border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400"
              defaultValue={document.title}
              name="title"
              type="text"
            />
          </label>
          <button
            className="mt-4 rounded-2xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            type="submit"
          >
            Lưu tiêu đề
          </button>
        </form>

        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm font-medium text-gray-900">Chi tiết tài liệu</p>
          <dl className="mt-4 space-y-3 text-sm text-gray-700">
            <div className="flex items-center justify-between gap-4">
              <dt>Loại</dt>
              <dd className="capitalize">{document.kind}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Cập nhật</dt>
              <dd>{new Date(document.updated_at).toLocaleDateString()}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Tạo lúc</dt>
              <dd>{new Date(document.created_at).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      <TemplatePreview metadata={document.metadata} />
    </section>
  );
}
