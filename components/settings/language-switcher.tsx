"use client";

import { useI18n } from "@/lib/i18n/i18n-context";
import { setLanguage } from "@/actions/i18n";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const { locale } = useI18n();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLang: string) => {
    startTransition(async () => {
      await setLanguage(newLang);
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">
        {locale === "vi" ? "Ngôn ngữ" : "Language"}
      </h3>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => handleLanguageChange("vi")}
          disabled={isPending}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            locale === "vi"
              ? "bg-gray-900 text-white shadow-sm"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Tiếng Việt
        </button>
        <button
          onClick={() => handleLanguageChange("en")}
          disabled={isPending}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            locale === "en"
              ? "bg-gray-900 text-white shadow-sm"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          English
        </button>
      </div>
      {isPending && (
        <p className="mt-2 text-xs text-gray-400 animate-pulse">
          {locale === "vi" ? "Đang cập nhật..." : "Updating..."}
        </p>
      )}
    </div>
  );
}
