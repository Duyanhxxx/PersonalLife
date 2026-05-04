import { FocusMode } from "@/components/workspace/focus-mode";

type InspirationHeroProps = {
  backgroundUrl: string;
  backgroundAttribution: string;
  backgroundSource?: "unsplash" | "fallback";
  quote: string;
  author: string;
  locale: "en" | "vi";
  primaryTask?: string | null;
};

export function InspirationHero({
  backgroundUrl,
  backgroundAttribution,
  backgroundSource = "fallback",
  quote,
  author,
  locale,
  primaryTask,
}: InspirationHeroProps) {
  return (
    <section
      className="overflow-hidden rounded-[2.5rem] border border-[#8EE4AF]/35 shadow-xl"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(5,56,107,0.78), rgba(55,150,131,0.62)), url(${backgroundUrl})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="flex flex-col gap-10 p-8 text-[#EDF5E1] md:p-10 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8EE4AF]">
            {locale === "vi" ? "Năng lượng mỗi ngày" : "Daily Energy"}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            {locale === "vi"
              ? "Mở Life OS với một khoảng xanh, một câu nhắc nhẹ, và một điểm tập trung rõ ràng."
              : "Open Life OS with a calm landscape, a fresh quote, and one clear point of focus."}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#EDF5E1]/92">
            “{quote}”
          </p>
          <p className="mt-3 text-sm font-medium text-[#8EE4AF]">{author}</p>
        </div>

        <div className="w-full max-w-md rounded-[2rem] border border-white/20 bg-white/10 p-6 backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8EE4AF]">
            {locale === "vi" ? "Điểm tập trung hôm nay" : "Today’s Focus"}
          </p>
          <p className="mt-3 text-xl font-semibold">
            {primaryTask || (locale === "vi" ? "Chọn một việc quan trọng để bắt đầu." : "Pick one meaningful task to begin with.")}
          </p>
          <p className="mt-3 text-sm leading-6 text-[#EDF5E1]/85">
            {locale === "vi"
              ? "Khi cần tập trung sâu, hãy bật Focus Mode để ẩn phần còn lại của hệ thống và giữ lại chỉ timer, nền thiên nhiên, và việc quan trọng nhất."
              : "When you need deep work, switch on Focus Mode to hide the rest of the system and keep only the timer, the landscape, and your most important task."}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <FocusMode
              author={author}
              backgroundUrl={backgroundUrl}
              locale={locale}
              quote={quote}
              taskTitle={primaryTask}
            />
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-[#EDF5E1]/85">
              {backgroundSource === "unsplash"
                ? locale === "vi"
                  ? "Nguồn ảnh: Unsplash trực tiếp"
                  : "Image source: Live Unsplash"
                : locale === "vi"
                  ? "Nguồn ảnh: bộ sưu tập dự phòng"
                  : "Image source: fallback set"}
            </span>
            <span className="text-xs text-[#EDF5E1]/75">{backgroundAttribution}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
