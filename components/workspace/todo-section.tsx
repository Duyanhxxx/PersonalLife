import { createTodoItem, deleteTodoItem, toggleTodoItem } from "@/actions/todo-items";
import { todayIso } from "@/lib/date";
import type { TodoItem } from "@/types/section-data";
import { getDictionary, getLanguage } from "@/lib/i18n/get-dictionary";

type TodoSectionProps = {
  items: TodoItem[];
};

const colorMap: Record<string, string> = {
  red: "bg-rose-100 text-rose-700",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-sky-100 text-sky-700",
  violet: "bg-violet-100 text-violet-700",
  green: "bg-emerald-100 text-emerald-700",
};

export async function TodoSection({ items }: TodoSectionProps) {
  const dictionary = await getDictionary();
  const locale = await getLanguage();
  const dict = dictionary.tasks;
  const groups = {
    [dictionary.tasks.todo]: items.filter((item) => !item.is_done),
    [dictionary.tasks.done]: items.filter((item) => item.is_done),
  };

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
      <form action={createTodoItem} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
        <input name="entryDate" type="hidden" value={todayIso()} />
        <p className="text-sm font-semibold text-gray-900">{dict.new}</p>
        <div className="mt-4 grid gap-3">
          <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="title" placeholder="Tiêu đề công việc" required />
          <select className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="priority">
            <option value="urgent">{locale === "vi" ? "Khẩn cấp" : "Urgent"}</option>
            <option value="important">{locale === "vi" ? "Quan trọng" : "Important"}</option>
            <option value="normal">{locale === "vi" ? "Bình thường" : "Normal"}</option>
            <option value="low">{locale === "vi" ? "Thấp" : "Low"}</option>
          </select>
          <select className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="color">
            <option value="red">Red</option>
            <option value="amber">Amber</option>
            <option value="blue">Blue</option>
            <option value="violet">Violet</option>
            <option value="green">Green</option>
          </select>
        </div>
        <button className="mt-4 rounded-2xl bg-gray-900 px-4 py-2 text-sm font-medium text-white" type="submit">Tạo công việc</button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(groups).map(([key, group]) => (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm" key={key}>
            <p className="text-sm font-semibold capitalize text-gray-900">{key}</p>
            <div className="mt-4 space-y-3">
              {group.map((item) => (
                <div className="rounded-2xl bg-gray-50 p-4" key={item.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${colorMap[item.color] ?? colorMap.blue}`}>{item.priority}</span>
                      <p className="mt-2 font-medium text-gray-900">{item.title}</p>
                    </div>
                    <div className="flex gap-2">
                      <form action={toggleTodoItem}>
                        <input name="id" type="hidden" value={item.id} />
                        <input name="isDone" type="hidden" value={String(item.is_done)} />
                        <button className="text-xs font-medium text-gray-500" type="submit">{item.is_done ? (locale === "vi" ? "Hoàn tác" : "Undo") : dictionary.tasks.done}</button>
                      </form>
                      <form action={deleteTodoItem}>
                        <input name="id" type="hidden" value={item.id} />
                        <button className="text-xs font-medium text-rose-700" type="submit">{dictionary.common.delete}</button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
