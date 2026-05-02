/* eslint-disable @next/next/no-img-element */

import { createReadingBook, deleteReadingBook, updateReadingStatus } from "@/actions/reading-books";
import type { ReadingBook } from "@/types/section-data";

type ReadingSectionProps = {
  books: ReadingBook[];
};

const lanes: ReadingBook["status"][] = ["to_read", "reading", "finished"];
const labels = {
  to_read: "Sẽ đọc",
  reading: "Đang đọc",
  finished: "Đã xong",
};

export function ReadingSection({ books }: ReadingSectionProps) {
  return (
    <section className="space-y-4">
      <form action={createReadingBook} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm" encType="multipart/form-data">
        <p className="text-sm font-semibold text-gray-900">Thêm sách</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="title" placeholder="Tên sách" required />
          <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="author" placeholder="Tác giả" />
          <select className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="status">
            <option value="to_read">Sẽ đọc</option>
            <option value="reading">Đọc sách</option>
            <option value="finished">Đã xong</option>
          </select>
          <input accept="image/*" className="h-11 rounded-2xl border border-gray-300 px-3 py-2 text-sm" name="cover" type="file" />
        </div>
        <button className="mt-4 rounded-2xl bg-gray-900 px-4 py-2 text-sm font-medium text-white" type="submit">Tải lên</button>
      </form>
      <div className="grid gap-4 xl:grid-cols-3">
        {lanes.map((lane) => (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm" key={lane}>
            <p className="text-sm font-semibold text-gray-900">{labels[lane]}</p>
            <div className="mt-4 space-y-4">
              {books.filter((book) => book.status === lane).map((book) => (
                <article className="rounded-[1.5rem] border border-gray-200 bg-gray-50 p-4 shadow-sm" key={book.id}>
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-[#DDEEE5]">
                    {book.cover_url ? (
                      <img alt={book.title} className="h-full w-full object-cover" src={book.cover_url} />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500">Không có ảnh</div>
                    )}
                  </div>
                  <p className="mt-3 font-semibold text-gray-900">{book.title}</p>
                  <p className="mt-1 text-sm text-gray-700">{book.author || "Tác giả không rõ"}</p>
                  <div className="mt-3 flex gap-2">
                    <form action={updateReadingStatus}>
                      <input name="id" type="hidden" value={book.id} />
                      <select className="rounded-xl border border-gray-300 bg-white px-2 py-1 text-xs" defaultValue={book.status} name="status">
                        <option value="to_read">Sẽ đọc</option>
                        <option value="reading">Đọc sách</option>
                        <option value="finished">Đã xong</option>
                      </select>
                      <button className="ml-2 text-xs font-medium text-gray-900" type="submit">Lưu</button>
                    </form>
                    <form action={deleteReadingBook}>
                      <input name="id" type="hidden" value={book.id} />
                      <input name="coverPath" type="hidden" value={book.cover_path ?? ""} />
                      <button className="text-xs font-medium text-rose-700" type="submit">Xoá</button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
