import { createSection, deleteSection, renameSection } from "@/actions/sections";
import type { WorkspaceSection } from "@/lib/workspace/sections";

type SectionManagerProps = {
  activeSection: WorkspaceSection;
};

export function SectionManager({ activeSection }: SectionManagerProps) {
  return (
    <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
        Quản lý phần
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-gray-900">
        Quản lý các phần không gian làm việc.
      </h3>

      <div className="mt-5 grid gap-4">
        <form action={createSection} className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
          <input name="redirectSection" type="hidden" value={activeSection.slug} />
          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Tạo phần mới</span>
            <input
              className="h-11 rounded-2xl border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400"
              name="name"
              placeholder="Ví dụ: Phòng học"
              type="text"
            />
          </label>
          <button
            className="mt-4 rounded-2xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            type="submit"
          >
            Tạo phần
          </button>
        </form>

        <form action={renameSection} className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
          <input name="id" type="hidden" value={activeSection.id} />
          <input name="slug" type="hidden" value={activeSection.slug} />
          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Đổi tên phần hiện tại</span>
            <input
              className="h-11 rounded-2xl border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400"
              defaultValue={activeSection.name}
              name="name"
              type="text"
            />
          </label>
          <button
            className="mt-4 rounded-2xl border border-gray-400 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-100"
            type="submit"
          >
            Lưu section name
          </button>
        </form>

        {activeSection.is_system ? (
          <div className="rounded-3xl border border-dashed border-gray-400 bg-gray-100/60 p-5 text-sm leading-6 text-gray-700">
            Phần hệ thống có thể đổi tên, but they are protected from deletion to keep your core workspace stable.
          </div>
        ) : (
          <form action={deleteSection} className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <input name="id" type="hidden" value={activeSection.id} />
            <input name="slug" type="hidden" value={activeSection.slug} />
            <p className="text-sm font-medium text-gray-900">Xoá current custom section</p>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              Tài liệu sẽ được chuyển về Ghi chú so you do not lose content.
            </p>
            <button
              className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
              type="submit"
            >
              Xoá section
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
