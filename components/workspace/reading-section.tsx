/* eslint-disable @next/next/no-img-element */

import { createReadingBook, deleteReadingBook, updateReadingStatus } from "@/actions/reading-books";
import { ResponsiveSectionViews } from "@/components/workspace/responsive-section-views";
import type { ReadingBook } from "@/types/section-data";
import { getDictionary, getLanguage } from "@/lib/i18n/get-dictionary";

type ReadingSectionProps = {
  books: ReadingBook[];
};

const lanes: ReadingBook["status"][] = ["to_read", "reading", "finished"];

export async function ReadingSection({ books }: ReadingSectionProps) {
  const dictionary = await getDictionary();
  const locale = await getLanguage();
  const dict = dictionary.reading;

  const labels = {
    to_read: dict.toRead,
    reading: dict.reading,
    finished: dict.finished,
  };

  const renderBoard = () => (
    <div className="grid gap-4 xl:grid-cols-3">
      {lanes.map((lane) => (
        <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-5 shadow-sm" key={lane}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#05386B]">{labels[lane]}</p>
            <span className="rounded-full bg-[#EDF5E1] px-3 py-1 text-xs font-semibold text-[#20555F]">
              {books.filter((book) => book.status === lane).length}
            </span>
          </div>
          <div className="mt-4 space-y-4">
            {books.filter((book) => book.status === lane).map((book) => (
              <article className="rounded-[1.5rem] border border-[#8EE4AF]/40 bg-[#F7FBF4] p-4 shadow-sm" key={book.id}>
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-[#DDEEE5]">
                  {book.cover_url ? (
                    <img alt={book.title} className="h-full w-full object-cover" src={book.cover_url} />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#379683]">
                      {locale === "vi" ? "Không có ảnh" : "No cover"}
                    </div>
                  )}
                </div>
                <p className="mt-3 font-semibold text-[#05386B]">{book.title}</p>
                <p className="mt-1 text-sm text-[#20555F]">{book.author || (locale === "vi" ? "Tác giả không rõ" : "Unknown author")}</p>
                <div className="mt-3 flex gap-2">
                  <form action={updateReadingStatus}>
                    <input name="id" type="hidden" value={book.id} />
                    <select className="rounded-xl border border-[#8EE4AF] bg-white px-2 py-1 text-xs text-[#05386B]" defaultValue={book.status} name="status">
                      <option value="to_read">{dict.toRead}</option>
                      <option value="reading">{dict.reading}</option>
                      <option value="finished">{dict.finished}</option>
                    </select>
                    <button className="ml-2 text-xs font-medium text-[#05386B]" type="submit">{dictionary.common.save}</button>
                  </form>
                  <form action={deleteReadingBook}>
                    <input name="id" type="hidden" value={book.id} />
                    <input name="coverPath" type="hidden" value={book.cover_path ?? ""} />
                    <button className="text-xs font-medium text-rose-700" type="submit">{dictionary.common.delete}</button>
                  </form>
                </div>
              </article>
            ))}
            {books.filter((book) => book.status === lane).length === 0 ? (
              <p className="rounded-[1.5rem] border border-dashed border-[#8EE4AF] bg-[#F7FBF4] p-4 text-sm text-[#20555F]">
                {locale === "vi" ? "Chưa có sách ở cột này." : "No books in this lane yet."}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );

  const mobileList = (
    <div className="space-y-3">
      {books.length ? (
        books.map((book) => (
          <article className="flex gap-4 rounded-[1.5rem] border border-[#8EE4AF]/40 bg-white/85 p-4 shadow-sm" key={`mobile-${book.id}`}>
            <div className="h-24 w-18 shrink-0 overflow-hidden rounded-2xl bg-[#DDEEE5]">
              {book.cover_url ? (
                <img alt={book.title} className="h-full w-full object-cover" src={book.cover_url} />
              ) : (
                <div className="flex h-full items-center justify-center px-2 text-center text-[11px] text-[#379683]">
                  {locale === "vi" ? "Chưa có ảnh" : "No cover"}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-[#05386B]">{book.title}</p>
              <p className="mt-1 text-sm text-[#20555F]">{book.author || (locale === "vi" ? "Tác giả không rõ" : "Unknown author")}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-[#379683]">
                {labels[book.status]}
              </p>
            </div>
          </article>
        ))
      ) : (
        <p className="rounded-[1.5rem] border border-dashed border-[#8EE4AF] bg-white/85 p-4 text-sm text-[#20555F]">
          {locale === "vi" ? "Chưa có quyển sách nào." : "No books yet."}
        </p>
      )}
    </div>
  );

  return (
    <section className="space-y-4">
      <form action={createReadingBook} className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm" encType="multipart/form-data">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#05386B]">{dict.new}</p>
          <span className="rounded-full bg-[#EDF5E1] px-3 py-1 text-xs font-semibold text-[#20555F]">
            {books.length} {locale === "vi" ? "quyển" : "books"}
          </span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="title" placeholder={dictionary.common.untitled} required />
          <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="author" placeholder={dict.author} />
          <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="status">
            <option value="to_read">{dict.toRead}</option>
            <option value="reading">{dict.reading}</option>
            <option value="finished">{dict.finished}</option>
          </select>
          <input accept="image/*" className="h-11 rounded-2xl border border-[#8EE4AF] px-3 py-2 text-sm text-[#05386B]" name="cover" type="file" />
        </div>
        <button className="mt-4 rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1]" type="submit">{dictionary.common.create}</button>
      </form>
      <div className="md:hidden">
        <ResponsiveSectionViews
          listLabel={locale === "vi" ? "Danh sách" : "List"}
          listView={mobileList}
          monthLabel={locale === "vi" ? "Bảng sách" : "Board"}
          monthView={renderBoard()}
        />
      </div>
      <div className="hidden md:block">{renderBoard()}</div>
    </section>
  );
}
