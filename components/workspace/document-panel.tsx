import { archiveDocument, renameDocument } from "@/actions/documents";
import type { DocumentRow } from "@/types/document";

type DocumentPanelProps = {
  document: DocumentRow | null;
  sectionSlug: string;
};

export function DocumentPanel({ document, sectionSlug }: DocumentPanelProps) {
  if (!document) {
    return (
      <section className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/80 p-8 shadow-sm">
        <h3 className="text-2xl font-semibold text-[#05386B]">Pick a page to start shaping it.</h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#20555F]">
          Your sidebar now supports real nested documents. Create a page or database, then choose it here to rename, review, or archive it.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/90 p-8 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#379683]">
            Active document
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[#05386B]">
            {document.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-[#20555F]">
            This is the selected {document.kind}. The full rich editor comes in the next phase, but the document structure and lifecycle are now live.
          </p>
        </div>

        <form action={archiveDocument}>
          <input name="id" type="hidden" value={document.id} />
          <input name="sectionSlug" type="hidden" value={sectionSlug} />
          <button
            className="rounded-2xl border border-[#379683]/30 bg-[#EDF5E1] px-4 py-2 text-sm font-medium text-[#05386B] transition hover:bg-[#8EE4AF]/35"
            type="submit"
          >
            Move to trash
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <form action={renameDocument} className="rounded-3xl border border-[#8EE4AF]/45 bg-[#F8FCF6] p-5">
          <input name="id" type="hidden" value={document.id} />
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[#05386B]">Rename page</span>
            <input
              className="h-11 rounded-2xl border border-[#8EE4AF] bg-white px-3 text-sm text-[#05386B] outline-none transition focus:border-[#379683]"
              defaultValue={document.title}
              name="title"
              type="text"
            />
          </label>
          <button
            className="mt-4 rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1] transition hover:bg-[#0A4A86]"
            type="submit"
          >
            Save title
          </button>
        </form>

        <div className="rounded-3xl border border-[#8EE4AF]/45 bg-[#F8FCF6] p-5">
          <p className="text-sm font-medium text-[#05386B]">Document details</p>
          <dl className="mt-4 space-y-3 text-sm text-[#20555F]">
            <div className="flex items-center justify-between gap-4">
              <dt>Kind</dt>
              <dd className="capitalize">{document.kind}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Updated</dt>
              <dd>{new Date(document.updated_at).toLocaleDateString()}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Created</dt>
              <dd>{new Date(document.created_at).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
