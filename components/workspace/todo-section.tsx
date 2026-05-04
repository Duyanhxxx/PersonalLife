import { createTodoItem, deleteTodoItem, toggleTodoItem } from "@/actions/todo-items";
import { ResponsiveSectionViews } from "@/components/workspace/responsive-section-views";
import { todayIso } from "@/lib/date";
import type { TodoItem } from "@/types/section-data";
import { getDictionary, getLanguage } from "@/lib/i18n/get-dictionary";

type TodoSectionProps = {
  items: TodoItem[];
};

const colorMap: Record<string, string> = {
  red: "bg-rose-100 text-rose-700",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-[#DCEEF6] text-[#05386B]",
  violet: "bg-violet-100 text-violet-700",
  green: "bg-[#D9F6E5] text-[#20555F]",
};

export async function TodoSection({ items }: TodoSectionProps) {
  const dictionary = await getDictionary();
  const locale = await getLanguage();
  const dict = dictionary.tasks;
  const groups = {
    [dictionary.tasks.todo]: items.filter((item) => !item.is_done),
    [dictionary.tasks.done]: items.filter((item) => item.is_done),
  };
  const pendingItems = groups[dictionary.tasks.todo];
  const doneItems = groups[dictionary.tasks.done];

  const renderList = (group: TodoItem[], title: string, emptyLabel: string) => (
    <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold capitalize text-[#05386B]">{title}</p>
        <span className="rounded-full bg-[#EDF5E1] px-3 py-1 text-xs font-semibold text-[#20555F]">
          {group.length}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {group.length ? (
          group.map((item) => (
            <div className="rounded-[1.5rem] border border-[#8EE4AF]/40 bg-[#F7FBF4] p-4" key={item.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${colorMap[item.color] ?? colorMap.blue}`}>
                    {item.priority}
                  </span>
                  <p className="mt-2 font-medium text-[#05386B]">{item.title}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <form action={toggleTodoItem}>
                    <input name="id" type="hidden" value={item.id} />
                    <input name="isDone" type="hidden" value={String(item.is_done)} />
                    <button className="text-xs font-medium text-[#379683]" type="submit">
                      {item.is_done ? (locale === "vi" ? "Hoàn tác" : "Undo") : dictionary.tasks.done}
                    </button>
                  </form>
                  <form action={deleteTodoItem}>
                    <input name="id" type="hidden" value={item.id} />
                    <button className="text-xs font-medium text-rose-700" type="submit">
                      {dictionary.common.delete}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-[1.5rem] border border-dashed border-[#8EE4AF] bg-[#F7FBF4] p-4 text-sm text-[#20555F]">
            {emptyLabel}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
      <form action={createTodoItem} className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
        <input name="entryDate" type="hidden" value={todayIso()} />
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#05386B]">{dict.new}</p>
          <span className="rounded-full bg-[#EDF5E1] px-3 py-1 text-xs font-semibold text-[#20555F]">
            {items.length} {locale === "vi" ? "mục" : "items"}
          </span>
        </div>
        <div className="mt-4 grid gap-3">
          <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="title" placeholder="Tiêu đề công việc" required />
          <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="priority">
            <option value="urgent">{locale === "vi" ? "Khẩn cấp" : "Urgent"}</option>
            <option value="important">{locale === "vi" ? "Quan trọng" : "Important"}</option>
            <option value="normal">{locale === "vi" ? "Bình thường" : "Normal"}</option>
            <option value="low">{locale === "vi" ? "Thấp" : "Low"}</option>
          </select>
          <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="color">
            <option value="red">Red</option>
            <option value="amber">Amber</option>
            <option value="blue">Blue</option>
            <option value="violet">Violet</option>
            <option value="green">Green</option>
          </select>
        </div>
        <button className="mt-4 rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1]" type="submit">Tạo công việc</button>
      </form>
      <div className="space-y-4">
        <div className="md:hidden">
          <ResponsiveSectionViews
            listLabel={dictionary.tasks.done}
            listView={renderList(
              doneItems,
              dictionary.tasks.done,
              locale === "vi" ? "Chưa có việc nào hoàn thành hôm nay." : "No completed tasks yet today.",
            )}
            monthLabel={dictionary.tasks.todo}
            monthView={renderList(
              pendingItems,
              dictionary.tasks.todo,
              locale === "vi" ? "Danh sách việc trống. Hãy thêm một việc mới." : "Your queue is clear. Add a new task.",
            )}
          />
        </div>
        <div className="hidden gap-4 md:grid md:grid-cols-2">
          {renderList(
            pendingItems,
            dictionary.tasks.todo,
            locale === "vi" ? "Danh sách việc trống. Hãy thêm một việc mới." : "Your queue is clear. Add a new task.",
          )}
          {renderList(
            doneItems,
            dictionary.tasks.done,
            locale === "vi" ? "Chưa có việc nào hoàn thành hôm nay." : "No completed tasks yet today.",
          )}
        </div>
      </div>
    </section>
  );
}
