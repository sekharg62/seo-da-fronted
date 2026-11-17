"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, ChevronRight, ClipboardPlus, PackageSearch, FileText, Home, LayoutGrid, Mail, Menu, MessageCircle, Phone, Shield, X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { siteConfig } from '@/config/siteConfig'
import { LEGAL_LINKS, NAV_LINKS } from '@/lib/navLinks'
import { LanguageSwitcher, ThemeToggle } from './HeaderControls'

const NAV_ICONS: Record<string, typeof Home> = {
  '/': Home,
  '/shop': LayoutGrid,
  '/blog': BookOpen,
}
const LEGAL_ICONS: Record<string, typeof Home> = { '/terms': FileText, '/privacy': Shield }

const noopSubscribe = () => () => {}

/**
 * Hamburger button + slide-in navigation drawer (mobile / tablet only).
 * Rendered through a portal on <body>: the sticky header uses backdrop-blur, which would
 * otherwise trap this `position: fixed` drawer inside the header box.
 */
export function MobileMenu() {
  const { t } = useLanguage()
  const pathname = usePathname() ?? '/'
  const titleId = useId()
  const panelId = useId()

  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false)

  // Close when navigating (state adjusted during render — no effect needed)
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      // Keep Tab focus inside the drawer
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (!first || !last) return
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    // Drawer is hidden from md up; close it if the viewport grows past that
    const mq = window.matchMedia('(min-width: 768px)')
    const onResize = () => mq.matches && setOpen(false)

    document.addEventListener('keydown', onKeyDown)
    mq.addEventListener('change', onResize)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      mq.removeEventListener('change', onResize)
      trigger?.focus()
    }
  }, [open])

  const { contact } = siteConfig

  const drawer = (
    <div className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        inert={!open}
        className={`absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-[#0f0f0f] ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-neutral-800">
          <div className="flex min-w-0 items-center gap-2">
            <img src="/Blue.png" alt="" width={32} height={32} className="h-8 w-8 dark:hidden" />
            <img src="/White.png" alt="" width={32} height={32} className="hidden h-8 w-8 dark:block" />
            <h2 id={titleId} className="truncate text-base font-semibold text-gray-900 dark:text-neutral-50">
              {t('appName' as any)}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t('navCloseMenu' as any)}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-neutral-400 dark:hover:bg-neutral-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          <nav aria-label={t('navPrimaryAriaLabel' as any)}>
            <ul className="space-y-1">
              {NAV_LINKS.map(({ href, labelKey, match }) => {
                const active = match(pathname)
                const Icon = NAV_ICONS[href] ?? Home
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                        active
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-neutral-200 dark:hover:bg-neutral-950'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" aria-hidden />
                      <span className="flex-1">{t(labelKey as any)}</span>
                      <ChevronRight className={`h-4 w-4 shrink-0 ${active ? 'opacity-100' : 'opacity-40'}`} aria-hidden />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="my-4 border-t border-gray-200 dark:border-neutral-800" />

          <div className="mb-3 grid grid-cols-2 gap-2">
            <Link
              href="/create-order"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2.5 text-sm font-semibold text-neutral-950"
            >
              <ClipboardPlus className="h-4 w-4" aria-hidden /> {t('footerCreateOrder' as any)}
            </Link>
            <Link
              href="/track-order"
              onClick={() => setOpen(false)}
              aria-current={pathname.startsWith('/track-order') ? 'page' : undefined}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/70 px-3 py-2.5 text-sm font-semibold text-amber-700 dark:text-amber-300"
            >
              <PackageSearch className="h-4 w-4" aria-hidden /> {t('footerTrackOrder' as any)}
            </Link>
          </div>

          <ul className="space-y-1">
            {LEGAL_LINKS.map(({ href, labelKey }) => {
              const Icon = LEGAL_ICONS[href] ?? FileText
              const active = pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      active
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-neutral-400 dark:hover:bg-neutral-950'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {t(labelKey as any)}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 space-y-3 rounded-lg border border-gray-200 bg-slate-50 p-3 dark:border-neutral-800 dark:bg-[#0f0f0f]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-600 dark:text-neutral-300">{t('navLanguage' as any)}</span>
              <LanguageSwitcher />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-600 dark:text-neutral-300">{t('navTheme' as any)}</span>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t border-gray-200 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] text-sm dark:border-neutral-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t('footerContactTitle' as any)}</p>
          <a
            href={`https://wa.me/${contact.whatsappDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-700 hover:text-amber-600 dark:text-neutral-200 dark:hover:text-amber-400"
          >
            <MessageCircle className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            WhatsApp
          </a>
          <a
            href={`tel:${contact.phoneTel.replace(/\s/g, '')}`}
            className="flex items-center gap-2 text-slate-700 hover:text-amber-600 dark:text-neutral-200 dark:hover:text-amber-400"
          >
            <Phone className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            {contact.phoneDisplay}
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-2 break-all text-slate-700 hover:text-amber-600 dark:text-neutral-200 dark:hover:text-amber-400"
          >
            <Mail className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            {contact.email}
          </a>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('navOpenMenu' as any)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        className="-ml-1.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-neutral-200 dark:hover:bg-neutral-900 md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>
      {isClient && createPortal(drawer, document.body)}
    </>
  )
}
