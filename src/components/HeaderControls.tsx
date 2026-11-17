"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

export const iconButton =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-700 transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-neutral-700 dark:bg-[#0f0f0f] dark:text-neutral-200 dark:hover:bg-neutral-900 sm:h-10 sm:w-10";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const option = (value: "bn" | "en", label: string, extra = "") => (
    <button
      type="button"
      lang={value}
      onClick={() => setLanguage(value)}
      aria-pressed={language === value}
      className={`px-2.5 py-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500 ${extra} ${
        language === value
          ? "bg-amber-400 font-semibold text-neutral-950"
          : "hover:bg-gray-200 dark:hover:bg-neutral-900"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div
      role="group"
      aria-label={t("navLanguage" as any)}
      className="inline-flex items-center overflow-hidden rounded-full border border-slate-300 bg-slate-100 text-[11px] text-slate-700 dark:border-neutral-700 dark:bg-[#0f0f0f] dark:text-neutral-200"
    >
      {option("bn", "বাংলা")}
      {option("en", "EN", "border-l border-slate-300 dark:border-neutral-700")}
    </div>
  );
}

/** Icons switch via the `dark` class (not JS state) so server and client markup always match. */
export function ThemeToggle() {
  const { toggleTheme } = useTheme();
  const { t } = useLanguage();
  return (
    <button type="button" onClick={toggleTheme} className={iconButton} aria-label={t("navThemeToggle" as any)}>
      <FiMoon className="h-4 w-4 dark:hidden sm:h-5 sm:w-5" aria-hidden />
      <FiSun className="hidden h-4 w-4 dark:block sm:h-5 sm:w-5" aria-hidden />
    </button>
  );
}
