"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, TimerReset, X } from "lucide-react";

type FocusModeProps = {
  backgroundUrl: string;
  quote: string;
  author: string;
  taskTitle?: string | null;
  locale: "en" | "vi";
};

const DEFAULT_DURATION = 25 * 60;

function formatTime(totalSeconds: number) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function FocusMode({
  backgroundUrl,
  quote,
  author,
  taskTitle,
  locale,
}: FocusModeProps) {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_DURATION);

  const closeFocusMode = () => {
    setOpen(false);
    setRunning(false);
    setSecondsLeft(DEFAULT_DURATION);
  };

  useEffect(() => {
    if (!open || !running) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [open, running]);

  const headline = useMemo(() => {
    if (taskTitle) return taskTitle;
    return locale === "vi" ? "Một việc quan trọng duy nhất" : "One important thing";
  }, [locale, taskTitle]);

  return (
    <>
      <button
        className="rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1] shadow-sm transition hover:bg-[#0B477C]"
        onClick={() => setOpen(true)}
        type="button"
      >
        {locale === "vi" ? "Bật Focus Mode" : "Enter Focus Mode"}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-[#05386B]/80 p-6"
          style={{
            backgroundImage: `linear-gradient(rgba(5,56,107,0.64), rgba(5,56,107,0.74)), url(${backgroundUrl})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <button
            aria-label={locale === "vi" ? "Thoát Focus Mode" : "Exit Focus Mode"}
            className="absolute right-5 top-5 rounded-full border border-white/25 bg-white/10 p-2 text-white backdrop-blur"
            onClick={closeFocusMode}
            type="button"
          >
            <X className="size-5" />
          </button>

          <div className="w-full max-w-3xl rounded-[2rem] border border-white/20 bg-white/10 p-8 text-white backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8EE4AF]">
              {locale === "vi" ? "Chế độ tập trung" : "Focus Mode"}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">{headline}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
              “{quote}”
            </p>
            <p className="mt-2 text-sm font-medium text-[#8EE4AF]">{author}</p>

            <div className="mt-10 rounded-[2rem] border border-white/15 bg-black/10 p-6">
              <p className="text-sm uppercase tracking-[0.16em] text-white/70">
                {locale === "vi" ? "Pomodoro" : "Pomodoro"}
              </p>
              <p className="mt-4 text-6xl font-semibold tracking-tight md:text-7xl">
                {formatTime(secondsLeft)}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#8EE4AF] px-4 py-3 text-sm font-semibold text-[#05386B]"
                  onClick={() => setRunning((current) => !current)}
                  type="button"
                >
                  {running ? <Pause className="size-4" /> : <Play className="size-4" />}
                  {running
                    ? locale === "vi"
                      ? "Tạm dừng"
                      : "Pause"
                    : locale === "vi"
                      ? "Bắt đầu"
                      : "Start"}
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white"
                  onClick={() => {
                    setRunning(false);
                    setSecondsLeft(DEFAULT_DURATION);
                  }}
                  type="button"
                >
                  <TimerReset className="size-4" />
                  {locale === "vi" ? "Đặt lại" : "Reset"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
