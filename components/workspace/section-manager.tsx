import { createSection, deleteSection, renameSection } from "@/actions/sections";
import type { WorkspaceSection } from "@/lib/workspace/sections";

type SectionManagerProps = {
  activeSection: WorkspaceSection;
};

export function SectionManager({ activeSection }: SectionManagerProps) {
  return (
    <section className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/90 p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#379683]">
        Section Studio
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-[#05386B]">
        Manage your workspace sections.
      </h3>

      <div className="mt-5 grid gap-4">
        <form action={createSection} className="rounded-3xl border border-[#8EE4AF]/45 bg-[#F8FCF6] p-5">
          <input name="redirectSection" type="hidden" value={activeSection.slug} />
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[#05386B]">Create new section</span>
            <input
              className="h-11 rounded-2xl border border-[#8EE4AF] bg-white px-3 text-sm text-[#05386B] outline-none transition focus:border-[#379683]"
              name="name"
              placeholder="Example: Study Lab"
              type="text"
            />
          </label>
          <button
            className="mt-4 rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1] transition hover:bg-[#0A4A86]"
            type="submit"
          >
            Create section
          </button>
        </form>

        <form action={renameSection} className="rounded-3xl border border-[#8EE4AF]/45 bg-[#F8FCF6] p-5">
          <input name="id" type="hidden" value={activeSection.id} />
          <input name="slug" type="hidden" value={activeSection.slug} />
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[#05386B]">Rename current section</span>
            <input
              className="h-11 rounded-2xl border border-[#8EE4AF] bg-white px-3 text-sm text-[#05386B] outline-none transition focus:border-[#379683]"
              defaultValue={activeSection.name}
              name="name"
              type="text"
            />
          </label>
          <button
            className="mt-4 rounded-2xl border border-[#379683]/30 bg-[#EDF5E1] px-4 py-2 text-sm font-medium text-[#05386B] transition hover:bg-[#8EE4AF]/35"
            type="submit"
          >
            Save section name
          </button>
        </form>

        {activeSection.is_system ? (
          <div className="rounded-3xl border border-dashed border-[#379683]/30 bg-[#EDF5E1]/60 p-5 text-sm leading-6 text-[#20555F]">
            System sections can be renamed, but they are protected from deletion to keep your core workspace stable.
          </div>
        ) : (
          <form action={deleteSection} className="rounded-3xl border border-[#8EE4AF]/45 bg-[#F8FCF6] p-5">
            <input name="id" type="hidden" value={activeSection.id} />
            <input name="slug" type="hidden" value={activeSection.slug} />
            <p className="text-sm font-medium text-[#05386B]">Delete current custom section</p>
            <p className="mt-2 text-sm leading-6 text-[#20555F]">
              Its documents will be moved back to Notes so you do not lose content.
            </p>
            <button
              className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
              type="submit"
            >
              Delete section
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
