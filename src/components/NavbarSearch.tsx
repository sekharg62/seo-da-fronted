"use client";

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { fetchServices, type ServiceDto } from '@/services/homeApiService'
import { useLanguage } from '@/context/LanguageContext'
import { productHref } from '@/lib/productUrl'
import { CartItemThumb } from './CartItemThumb'
import { serviceSummary } from '@/lib/serviceText'

const CURRENCY = '৳'
const MAX_RESULTS = 6
const MIN_QUERY = 1

/** Name prefix matches first, then name contains, then description contains. */
function rankServices(services: ServiceDto[], query: string): ServiceDto[] {
  const scored: { s: ServiceDto; score: number }[] = []
  for (const s of services) {
    const name = s.name.toLowerCase()
    const desc = `${s.shortDesc ?? ''} ${s.description ?? ''}`.toLowerCase()
    let score = 0
    if (name.startsWith(query)) score = 3
    else if (name.split(/[\s\-—]+/).some((w) => w.startsWith(query))) score = 2.5
    else if (name.includes(query)) score = 2
    else if (desc.includes(query)) score = 1
    if (score > 0) scored.push({ s, score })
  }
  return scored
    .sort((a, b) => b.score - a.score || a.s.name.localeCompare(b.s.name))
    .slice(0, MAX_RESULTS)
    .map((x) => x.s)
}

export function NavbarSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLanguage()
  const listboxId = useId()

  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [services, setServices] = useState<ServiceDto[] | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')

  // Close and reset when the route changes (adjusting state during render, no effect needed)
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
    setQuery('')
    setActiveIndex(-1)
  }

  const normalized = query.trim().toLowerCase()
  const results = useMemo(
    () => (services && normalized.length >= MIN_QUERY ? rankServices(services, normalized) : []),
    [services, normalized],
  )
  const showPanel = open && normalized.length >= MIN_QUERY

  /** Services are loaded once, lazily, the first time the user interacts with search. */
  function ensureServices() {
    if (status === 'loading' || status === 'ready') return
    setStatus('loading')
    fetchServices()
      .then((list) => {
        setServices(list)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }

  function goTo(service: ServiceDto) {
    setOpen(false)
    setQuery('')
    setActiveIndex(-1)
    inputRef.current?.blur()
    router.push(productHref(service))
  }

  // Click outside closes the panel
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof Node && !containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  // "/" or Ctrl/⌘+K focuses search from anywhere (unless already typing in a field)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing = !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!results.length) return
      e.preventDefault()
      setOpen(true)
      const delta = e.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((i) => (i + delta + results.length) % results.length)
    } else if (e.key === 'Enter') {
      const pick = results[activeIndex] ?? results[0]
      if (pick) {
        e.preventDefault()
        goTo(pick)
      }
    } else if (e.key === 'Escape') {
      if (open) setOpen(false)
      else {
        setQuery('')
        inputRef.current?.blur()
      }
    }
  }

  const activeId = activeIndex >= 0 && results[activeIndex] ? `${listboxId}-opt-${activeIndex}` : undefined

  return (
    <div ref={containerRef} className="relative w-full min-w-0 md:flex-1">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
        aria-hidden
      />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={activeId}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setActiveIndex(-1)
          setOpen(true)
          ensureServices()
        }}
        onFocus={() => {
          ensureServices()
          if (normalized) setOpen(true)
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-xl border border-gray-200/90 bg-slate-50/90 py-2.5 pl-10 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400/60 focus:bg-white focus:ring-4 focus:ring-amber-500/10 dark:border-neutral-700/90 dark:bg-[#0f0f0f] dark:text-amber-50 dark:placeholder:text-neutral-500 dark:focus:border-amber-500/40 dark:focus:bg-neutral-950 dark:focus:ring-amber-400/15 [&::-webkit-search-cancel-button]:appearance-none"
      />

      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setActiveIndex(-1)
              inputRef.current?.focus()
            }}
            aria-label={t('navClearSearch' as any)}
            className="rounded-md p-1 text-slate-400 transition hover:bg-gray-200 hover:text-slate-700 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <kbd className="hidden rounded-md border border-slate-300 bg-white px-1.5 py-0.5 font-sans text-[10px] font-medium text-slate-400 dark:border-neutral-700 dark:bg-[#0f0f0f] lg:inline-block">
            /
          </kbd>
        )}
      </div>

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xl shadow-gray-900/10 dark:border-neutral-800 dark:bg-[#0f0f0f] dark:shadow-black/40">
          {status === 'loading' || status === 'idle' ? (
            <p className="p-3 text-sm text-gray-500" role="status">{t('navSearching' as any)}</p>
          ) : results.length ? (
            <ul id={listboxId} role="listbox" aria-label={t('navSearchResults' as any)} className="max-h-[60vh] overflow-y-auto py-1">
              {results.map((service, index) => {
                const active = index === activeIndex
                const price = Number(service.price)
                return (
                  <li key={service.id} id={`${listboxId}-opt-${index}`} role="option" aria-selected={active}>
                    <Link
                      href={productHref(service)}
                      tabIndex={-1}
                      onClick={(e) => {
                        e.preventDefault()
                        goTo(service)
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex items-center gap-3 px-3 py-2 text-sm transition ${
                        active ? 'bg-amber-50 dark:bg-amber-500/10' : 'hover:bg-slate-50 dark:hover:bg-neutral-950'
                      }`}
                    >
                      <CartItemThumb name={service.name} imgUrl={service.imgUrl} className="h-10 w-10" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold leading-tight text-slate-800 dark:text-neutral-100">{service.name}</p>
                        {serviceSummary(service) ? (
                          <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">{serviceSummary(service)}</p>
                        ) : null}
                      </div>
                      {Number.isFinite(price) && price > 0 && (
                        <span className="shrink-0 text-right text-xs text-gray-500 dark:text-neutral-400">
                          {t('navStartsFrom' as any)}
                          <span className="block text-sm font-semibold text-amber-700 dark:text-amber-400">
                            {CURRENCY}{price.toLocaleString()}
                          </span>
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="p-3 text-sm text-gray-500" role="status">
              {status === 'error' ? 'Could not load products. Please try again.' : t('navNoResults' as any)}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
