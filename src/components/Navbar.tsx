"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { FiSun, FiMoon } from "react-icons/fi";
import { CartIcon } from "@/components/CartIcon";
import { NavbarSearch } from "@/components/NavbarSearch";

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  return (
    <div className="inline-flex items-center rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/60 text-[11px] text-slate-700 dark:text-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setLanguage('bn')}
        className={`px-2 py-1 ${language === 'bn' ? 'bg-emerald-500 text-emerald-950' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
      >
        বাংলা
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 border-l border-slate-300 dark:border-slate-700 ${language === 'en' ? 'bg-emerald-500 text-emerald-950' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
      >
        EN
      </button>
    </div>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <FiSun className="h-4 w-4 sm:h-5 sm:w-5" /> : <FiMoon className="h-4 w-4 sm:h-5 sm:w-5" />}
    </button>
  );
}

export default function Navbar() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const headerActionsDesktop = (
    <>
      <CartIcon cartLabel={t('cart' as any)} />
      <ThemeToggle />
      <LanguageSwitcher />
    </>
  );

  const headerActionsMobile = (
    <>
      <ThemeToggle />
      <LanguageSwitcher />
    </>
  );

  return (
    <header className="fixed w-full top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-4 md:py-3.5 lg:gap-6">
        <div className="flex items-center justify-between gap-3 md:contents">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 transition hover:opacity-90">
            <img
              src={theme === 'dark' ? '/White.png' : '/Blue.png'}
              alt="DigitalAccess DA"
              className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
            />
            <p className="truncate text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-[17px]">
              DigitalAccess DA
            </p>
          </Link>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:hidden">
            {headerActionsMobile}
          </div>
        </div>

        <NavbarSearch placeholder={t('navSearchPlaceholder' as any) || 'Search services...'} />

        <div className="hidden shrink-0 items-center gap-2 sm:gap-3 md:flex">
          {headerActionsDesktop}
        </div>
      </div>
    </header>
  );
}
