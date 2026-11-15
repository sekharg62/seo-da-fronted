"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { CartIcon } from "@/components/CartIcon";
import { NavbarSearch } from "@/components/NavbarSearch";
import { MobileMenu } from "@/components/MobileMenu";
import { LanguageSwitcher, ThemeToggle } from "@/components/HeaderControls";
import { NAV_LINKS } from "@/lib/navLinks";


function Brand() {
  const { t } = useLanguage();
  const name = t("appName" as any);
  return (
    <Link
      href="/"
      aria-label={`${name} — ${t("footerLinkHome" as any)}`}
      className="flex min-w-0 shrink-0 items-center gap-2 rounded-lg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      {/* Both logos are rendered; CSS picks one, avoiding a flash/hydration mismatch on theme load */}
      <img src="/Blue.png" alt="" width={40} height={40} className="h-9 w-9 shrink-0 dark:hidden sm:h-10 sm:w-10" />
      <img src="/White.png" alt="" width={40} height={40} className="hidden h-9 w-9 shrink-0 dark:block sm:h-10 sm:w-10" />
      <span className="truncate text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-[17px]">
        {name}
      </span>
    </Link>
  );
}

function DesktopNavLinks() {
  const { t } = useLanguage();
  const pathname = usePathname() ?? "/";
  return (
    <nav aria-label={t("navPrimaryAriaLabel" as any)} className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {NAV_LINKS.map(({ href, labelKey, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  active
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white"
                }`}
              >
                {t(labelKey as any)}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-emerald-500" aria-hidden />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export default function Navbar() {
  const { t } = useLanguage();
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 4, () => false);

  return (
    <header
      className={`sticky top-0 z-30 w-full border-b backdrop-blur transition-shadow ${
        scrolled
          ? "border-slate-200 bg-white/95 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-black/30"
          : "border-transparent bg-white/80 dark:bg-slate-950/70"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50"
      >
        {t("navSkipToContent" as any)}
      </a>

      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-4 lg:gap-6">
        {/* Row 1 (mobile) / left side (desktop): brand + mobile-only actions */}
        <div className="flex items-center justify-between gap-3 md:contents">
          <div className="flex min-w-0 items-center gap-2">
            <MobileMenu />
            <Brand />
          </div>
          {/* Cart lives in the bottom nav on mobile */}
          {/* Language + full nav live in the ☰ drawer on mobile */}
          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <ThemeToggle />
          </div>
        </div>

        <DesktopNavLinks />

        <NavbarSearch placeholder={t("navSearchPlaceholder" as any) || "Search products…"} />

        <div className="hidden shrink-0 items-center gap-2 md:flex lg:gap-3">
          <CartIcon cartLabel={t("cart" as any)} />
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
