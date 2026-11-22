"use client"

import { useEffect, useMemo, useState, useSyncExternalStore, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, ChevronDown, Download, Loader2, PackageSearch, Search, Smartphone, Trash2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { paymentMethodLabel } from '@/lib/paymentLabels'
import { Breadcrumb } from '@/components/Breadcrumb'
import { CartItemThumb } from '@/components/CartItemThumb'
import { WhatsAppOrderBox } from '@/components/WhatsAppOrderBox'
import { trackOrder, type TrackedOrder } from '@/services/trackService'
import { ORDER_STATUS, STATUS_STEPS, statusLabel } from '@/lib/orderStatus'
import { printOrderBill } from '@/lib/orderBill'
import {
  removeSavedOrder,
  saveOrder,
  savedOrdersSnapshot,
  subscribeSavedOrders,
  type SavedOrder,
} from '@/lib/orderHistory'

const TEXT = {
  en: {
    crumb: 'Track order',
    title: 'Track your order',
    subtitle: 'Check the status of your order and download your bill.',
    deviceTitle: 'Orders from this device',
    deviceHint: 'We remembered these orders on this device — tap one to see its status.',
    lookupTitle: 'Find an order',
    lookupHint: 'Enter the order ID from your confirmation and the phone number you ordered with.',
    orderId: 'Order ID',
    phone: 'Phone number',
    check: 'Check status',
    checking: 'Checking…',
    placed: 'Placed',
    items: 'Items',
    total: 'Total',
    payment: 'Payment',
    paidFrom: 'Paid from',
    trxId: 'Transaction ID',
    bill: 'Download bill',
    remove: 'Remove from this device',
    details: 'Details',
    hide: 'Hide',
    noDevice: 'No orders saved on this device yet.',
    newOrder: 'Create order',
    popupBlocked: 'Please allow pop-ups to download the bill.',
    loadingStatus: 'Loading…',
  },
  bn: {
    crumb: 'অর্ডার ট্র্যাক',
    title: 'আপনার অর্ডার ট্র্যাক করুন',
    subtitle: 'অর্ডারের অবস্থা দেখুন এবং বিল ডাউনলোড করুন।',
    deviceTitle: 'এই ডিভাইসের অর্ডার',
    deviceHint: 'এই ডিভাইসে এই অর্ডারগুলো মনে রাখা হয়েছে — অবস্থা দেখতে ট্যাপ করুন।',
    lookupTitle: 'অর্ডার খুঁজুন',
    lookupHint: 'কনফার্মেশনে পাওয়া অর্ডার আইডি এবং অর্ডারে দেওয়া ফোন নম্বর লিখুন।',
    orderId: 'অর্ডার আইডি',
    phone: 'ফোন নম্বর',
    check: 'অবস্থা দেখুন',
    checking: 'দেখা হচ্ছে…',
    placed: 'অর্ডারের সময়',
    items: 'পণ্য',
    total: 'মোট',
    payment: 'পেমেন্ট',
    paidFrom: 'পেমেন্ট করা নম্বর',
    trxId: 'ট্রানজেকশন আইডি',
    bill: 'বিল ডাউনলোড',
    remove: 'এই ডিভাইস থেকে সরান',
    details: 'বিস্তারিত',
    hide: 'লুকান',
    noDevice: 'এই ডিভাইসে এখনো কোনো অর্ডার সংরক্ষিত নেই।',
    newOrder: 'অর্ডার তৈরি করুন',
    popupBlocked: 'বিল ডাউনলোড করতে পপ-আপ অনুমতি দিন।',
    loadingStatus: 'লোড হচ্ছে…',
  },
} as const

type Lang = keyof typeof TEXT
const CURRENCY = '৳'

function formatDate(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function StatusBadge({ status, lang }: { status: TrackedOrder['status']; lang: Lang }) {
  const meta = ORDER_STATUS[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta?.tone ?? ''}`}>
      {statusLabel(status, lang)}
    </span>
  )
}

/** Full status card for one order */
function OrderStatusCard({ order, lang, onRemove }: { order: TrackedOrder; lang: Lang; onRemove?: () => void }) {
  const tx = TEXT[lang]
  const meta = ORDER_STATUS[order.status]
  const stepIndex = STATUS_STEPS.indexOf(order.status)
  const [billError, setBillError] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={order.status} lang={lang} />
          <span className="text-xs text-gray-500 dark:text-neutral-400">
            {tx.placed}: {formatDate(order.createdAt, lang)}
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-neutral-300">{lang === 'bn' ? meta?.hintBn : meta?.hintEn}</p>
      </div>

      {stepIndex >= 0 && (
        <ol className="grid grid-cols-3 gap-2" aria-label="Order progress">
          {STATUS_STEPS.map((step, i) => {
            const done = i <= stepIndex
            return (
              <li key={step} className="flex flex-col gap-1.5">
                <span className={`h-1.5 rounded-full ${done ? 'bg-amber-500' : 'bg-gray-200 dark:bg-neutral-700'}`} />
                <span
                  className={`flex items-center gap-1 text-[11px] font-medium ${
                    done ? 'text-amber-700 dark:text-amber-400' : 'text-slate-400'
                  }`}
                >
                  {done && <Check className="h-3 w-3" aria-hidden />}
                  {statusLabel(step, lang)}
                </span>
              </li>
            )
          })}
        </ol>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">{tx.items}</p>
        <ul className="space-y-2">
          {order.orderItems.map((item) => (
            <li key={item.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-2.5 dark:border-neutral-700">
              <CartItemThumb name={item.serviceName} imgUrl={item.service?.imgUrl} className="h-11 w-11" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-neutral-100">{item.serviceName}</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  {item.quantity} × {CURRENCY}{Number(item.price).toFixed(0)}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-gray-900 dark:text-neutral-100">
                {CURRENCY}{(Number(item.price) * item.quantity).toFixed(0)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-lg bg-slate-50 p-3 text-sm dark:bg-neutral-800/50">
        <dt className="text-gray-500 dark:text-neutral-400">{tx.total}</dt>
        <dd className="text-right font-bold text-amber-700 dark:text-amber-400">{CURRENCY}{Number(order.totalPrice).toFixed(0)}</dd>
        <dt className="text-gray-500 dark:text-neutral-400">{tx.payment}</dt>
        <dd className="text-right font-medium text-slate-800 dark:text-neutral-200">{paymentMethodLabel(order.paymentMethod, lang)}</dd>
        {order.userPaymentMethodNumber && (
          <>
            <dt className="text-gray-500 dark:text-neutral-400">{tx.paidFrom}</dt>
            <dd className="text-right font-mono text-slate-800 dark:text-neutral-200">{order.userPaymentMethodNumber}</dd>
          </>
        )}
        {order.transactionId && (
          <>
            <dt className="text-gray-500 dark:text-neutral-400">{tx.trxId}</dt>
            <dd className="truncate text-right font-mono text-slate-800 dark:text-neutral-200">{order.transactionId}</dd>
          </>
        )}
      </dl>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => setBillError(printOrderBill(order) ? null : tx.popupBlocked)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-amber-400 px-4 py-2.5 text-sm font-bold text-neutral-950 transition hover:bg-amber-300"
        >
          <Download className="h-4 w-4" aria-hidden /> {tx.bill}
        </button>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-900"
          >
            <Trash2 className="h-4 w-4" aria-hidden /> {tx.remove}
          </button>
        )}
      </div>
      {billError && <p className="text-xs text-red-600 dark:text-red-400">{billError}</p>}

      {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
        <WhatsAppOrderBox orderNo={order.orderNo} paymentMethod={order.paymentMethod} payerNumber={order.userPaymentMethodNumber} />
      )}
    </div>
  )
}

export default function TrackOrderClient() {
  const { language } = useLanguage()
  const lang: Lang = language === 'bn' ? 'bn' : 'en'
  const tx = TEXT[lang]
  const searchParams = useSearchParams()

  // Orders saved on this device (localStorage), kept in sync across tabs
  const snapshot = useSyncExternalStore(subscribeSavedOrders, savedOrdersSnapshot, () => '[]')
  const savedOrders = useMemo<SavedOrder[]>(() => {
    try {
      const list = JSON.parse(snapshot)
      return Array.isArray(list) ? list.filter((o) => typeof o?.orderNo === 'string' && typeof o?.phone === 'string') : []
    } catch {
      return []
    }
  }, [snapshot])

  // Live status for saved orders (fetched once per order)
  const [live, setLive] = useState<Record<string, TrackedOrder | { error: string }>>({})
  const [openOrderNo, setOpenOrderNo] = useState<string | null>(searchParams.get('id'))

  useEffect(() => {
    let cancelled = false
    for (const saved of savedOrders.slice(0, 10)) {
      if (live[saved.orderNo]) continue
      trackOrder(saved.orderNo, saved.phone)
        .then((order) => !cancelled && setLive((m) => ({ ...m, [saved.orderNo]: order })))
        .catch((err: Error) => !cancelled && setLive((m) => ({ ...m, [saved.orderNo]: { error: err.message } })))
    }
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `live` is only used to skip already-loaded orders
  }, [savedOrders])

  // Manual lookup
  const [orderId, setOrderId] = useState(() => {
    const id = searchParams.get('id') ?? ''
    return savedOrders.some((o) => o.orderNo === id) ? '' : id
  })
  const [phone, setPhone] = useState('')
  const [checking, setChecking] = useState(false)
  const [lookupError, setLookupError] = useState<string | null>(null)
  const [result, setResult] = useState<TrackedOrder | null>(null)

  async function handleLookup(e: FormEvent) {
    e.preventDefault()
    setLookupError(null)
    setResult(null)
    setChecking(true)
    try {
      const order = await trackOrder(orderId.replace(/\s/g, ''), phone)
      setResult(order)
      // Remember it on this device for next time
      saveOrder({
        orderNo: order.orderNo,
        phone,
        createdAt: order.createdAt,
        summary: order.orderItems[0]?.serviceName,
        total: Number(order.totalPrice),
      })
      setLive((m) => ({ ...m, [order.orderNo]: order }))
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setChecking(false)
    }
  }

  const inputCls =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-gray-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100'

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 md:py-12">
      <Breadcrumb items={[{ label: tx.crumb }]} jsonLd={false} />
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-50 sm:text-3xl">
          <PackageSearch className="h-7 w-7 text-amber-500" aria-hidden /> {tx.title}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400">{tx.subtitle}</p>
      </div>

      {/* Orders saved on this device — shown first when present */}
      {savedOrders.length > 0 && (
        <section className="mb-8" aria-labelledby="device-orders">
          <h2 id="device-orders" className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-neutral-50">
            <Smartphone className="h-5 w-5 text-amber-500" aria-hidden /> {tx.deviceTitle}
          </h2>
          <p className="mb-3 text-sm text-gray-500 dark:text-neutral-400">{tx.deviceHint}</p>
          <ul className="space-y-3">
            {savedOrders.map((saved) => {
              const state = live[saved.orderNo]
              const order = state && 'orderNo' in state ? state : null
              const open = openOrderNo === saved.orderNo
              return (
                <li key={saved.orderNo} className="rounded-lg border border-gray-200 bg-white dark:border-neutral-800 dark:bg-[#0f0f0f]">
                  <button
                    type="button"
                    onClick={() => setOpenOrderNo(open ? null : saved.orderNo)}
                    aria-expanded={open}
                    className="flex w-full items-center gap-3 p-4 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm font-semibold text-gray-900 dark:text-neutral-100">#{saved.orderNo}</p>
                      <p className="truncate text-xs text-gray-500 dark:text-neutral-400">
                        {saved.summary ?? '—'}
                        {saved.total ? ` · ${CURRENCY}${saved.total.toFixed(0)}` : ''} · {formatDate(saved.createdAt, lang)}
                      </p>
                    </div>
                    {order ? (
                      <StatusBadge status={order.status} lang={lang} />
                    ) : state && 'error' in state ? (
                      <span className="text-xs text-red-500">!</span>
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" aria-label={tx.loadingStatus} />
                    )}
                    <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
                  </button>
                  {open && (
                    <div className="border-t border-gray-200 p-4 dark:border-neutral-800">
                      {order ? (
                        <OrderStatusCard order={order} lang={lang} onRemove={() => removeSavedOrder(saved.orderNo)} />
                      ) : state && 'error' in state ? (
                        <div className="space-y-3">
                          <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
                          <button
                            type="button"
                            onClick={() => removeSavedOrder(saved.orderNo)}
                            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:underline dark:text-neutral-300"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden /> {tx.remove}
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">{tx.loadingStatus}</p>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* Manual lookup */}
      <section
        aria-labelledby="lookup-title"
        className="rounded-lg border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-[#0f0f0f] sm:p-6"
      >
        <h2 id="lookup-title" className="text-lg font-semibold text-gray-900 dark:text-neutral-50">{tx.lookupTitle}</h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-neutral-400">{tx.lookupHint}</p>
        <form onSubmit={handleLookup} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">{tx.orderId}</span>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              inputMode="numeric"
              autoComplete="off"
              placeholder="161126101500"
              className={`${inputCls} font-mono`}
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">{tx.phone}</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              className={`${inputCls} font-mono`}
              required
            />
          </label>
          <button
            type="submit"
            disabled={checking}
            className="inline-flex h-[46px] items-center justify-center gap-2 rounded-md bg-amber-400 px-5 text-sm font-bold text-neutral-950 transition hover:bg-amber-300 disabled:opacity-60"
          >
            {checking ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Search className="h-4 w-4" aria-hidden />}
            {checking ? tx.checking : tx.check}
          </button>
        </form>
        {lookupError && (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300" role="alert">
            {lookupError}
          </p>
        )}
        {result && (
          <div className="mt-5 border-t border-gray-200 pt-5 dark:border-neutral-800">
            <p className="mb-3 font-mono text-sm font-semibold text-gray-900 dark:text-neutral-100">#{result.orderNo}</p>
            <OrderStatusCard order={result} lang={lang} />
          </div>
        )}
      </section>

      {savedOrders.length === 0 && (
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-neutral-400">
          {tx.noDevice}{' '}
          <Link href="/create-order" className="font-medium text-amber-700 hover:underline dark:text-amber-400">
            {tx.newOrder}
          </Link>
        </p>
      )}
    </div>
  )
}
