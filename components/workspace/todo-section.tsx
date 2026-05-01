import { createTodoItem, deleteTodoItem, toggleTodoItem } from "@/actions/todo-items";
import { todayIso } from "@/lib/date";
import type { TodoItem } from "@/types/section-data";

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

export function TodoSection({ items }: TodoSectionProps) {
  const groups = {
    pending: items.filter((item) => !item.is_done),
    done: items.filter((item) => item.is_done),
  };

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
      <form action={createTodoItem} className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
        <input name="entryDate" type="hidden" value={todayIso()} />
        <p className="text-sm font-semibold text-[#05386B]">Add task for today</p>
        <div className="mt-4 grid gap-3">
          <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm" name="title" placeholder="Task title" required />
          <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm" name="priority">
            <option value="urgent">Urgent</option>
            <option value="important">Important</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
          <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm" name="color">
            <option value="red">Red</option>
            <option value="amber">Amber</option>
            <option value="blue">Blue</option>
            <option value="violet">Violet</option>
            <option value="green">Green</option>
          </select>
        </div>
        <button className="mt-4 rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1]" type="submit">Create task</button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(groups).map(([key, group]) => (
          <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm" key={key}>
            <p className="text-sm font-semibold capitalize text-[#05386B]">{key}</p>
            <div className="mt-4 space-y-3">
              {group.map((item) => (
                <div className="rounded-2xl bg-[#F7FBF4] p-4" key={item.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${colorMap[item.color] ?? colorMap.blue}`}>{item.priority}</span>
                      <p className="mt-2 font-medium text-[#05386B]">{item.title}</p>
                    </div>
                    <div className="flex gap-2">
                      <form action={toggleTodoItem}>
                        <input name="id" type="hidden" value={item.id} />
                        <input name="isDone" type="hidden" value={String(item.is_done)} />
                        <button className="text-xs font-medium text-[#379683]" type="submit">{item.is_done ? "Undo" : "Done"}</button>
                      </form>
                      <form action={deleteTodoItem}>
                        <input name="id" type="hidden" value={item.id} />
                        <button className="text-xs font-medium text-rose-700" type="submit">Delete</button>
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
