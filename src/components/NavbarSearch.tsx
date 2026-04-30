"use client";

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { fetchServices, type ServiceDto } from '@/services/homeApiService'

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}

export function NavbarSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter()

  const containerRef = useRef<HTMLDivElement | null>(null)
  const servicesCacheRef = useRef<ServiceDto[] | null>(null)

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 300)
  const normalizedQuery = useMemo(() => debouncedQuery.trim().toLowerCase(), [debouncedQuery])

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ServiceDto[]>([])

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false)
    }

    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

  useEffect(() => {
    if (!normalizedQuery || normalizedQuery.length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    let cancelled = false

    ;(async () => {
      setLoading(true)
      try {
        const list = servicesCacheRef.current ?? (await fetchServices(false))
        servicesCacheRef.current = list

        if (cancelled) return

        const filtered = list
          .filter((s) => {
            const name = s.name.toLowerCase()
            const desc = (s.description ?? '').toLowerCase()
            return name.includes(normalizedQuery) || desc.includes(normalizedQuery)
          })
          .slice(0, 6)

        setResults(filtered)
        setOpen(true)
      } catch {
        if (cancelled) return
        setResults([])
        setOpen(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [normalizedQuery])

  return (
    <div ref={containerRef} className="relative min-w-0 w-full md:max-w-xl md:flex-1 lg:max-w-2xl">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        aria-hidden
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        title={placeholder}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && results[0]) {
            setOpen(false)
            router.push(`/product/${results[0].id}`)
          }
          if (e.key === 'Escape') setOpen(false)
        }}
        className="w-full cursor-text rounded-xl border border-slate-200/90 bg-slate-50/90 py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-inner shadow-slate-900/2 outline-none ring-emerald-500/0 transition placeholder:text-slate-400 focus:border-emerald-400/60 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/90 dark:bg-slate-900/50 dark:text-emerald-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500/40 dark:focus:bg-slate-900/80 dark:focus:ring-emerald-400/15"
      />

      {open && (
        <div
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950"
          role="listbox"
          aria-label="Search results"
        >
          {loading ? (
            <div className="p-3 text-sm text-slate-500">Searching...</div>
          ) : results.length ? (
            results.map((service) => (
              <Link
                key={service.id}
                href={`/product/${service.id}`}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900"
                role="option"
              >
                <div className="font-semibold leading-tight">{service.name}</div>
                {service.description ? (
                  <div className="mt-0.5 line-clamp-2 whitespace-pre-line text-xs text-slate-500 dark:text-slate-400">
                    {service.description}
                  </div>
                ) : null}
              </Link>
            ))
          ) : (
            <div className="p-3 text-sm text-slate-500">No results</div>
          )}
        </div>
      )}
    </div>
  )
}
