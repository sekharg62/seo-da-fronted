"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Check,
  CreditCard,
  HeadphonesIcon,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Users,
  User,
  Zap,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import { siteConfig } from '@/config/siteConfig'
import type { ServicePlanDto } from '@/services/servicePlanService'
import type { ServiceDetailDto } from '@/lib/catalog'
import { ServiceImage } from '@/components/ServiceImage'
import { Breadcrumb } from '@/components/Breadcrumb'
import { serviceDetails, serviceSummary } from '@/lib/serviceText'

const CURRENCY = '৳'
const MAX_QTY = 99

type AccountType = 'shared' | 'personal'

const TEXT = {
  en: {
    outOfStock: 'Out of stock',
    outOfStockNote: 'This product is currently unavailable. Message us on WhatsApp to be notified when it is back.',
    inStock: 'In stock',
    instantDelivery: 'Fast delivery',
    perMonth: '/month',
    for: 'for',
    accountType: 'Account type',
    shared: 'Shared',
    personal: 'Personal',
    sharedHint: 'Used with other members · lowest price',
    personalHint: 'Private account · only for you',
    duration: 'Duration',
    month: 'Month',
    months: 'Months',
    save: 'Save',
    notAvailable: 'Not available',
    quantity: 'Quantity',
    total: 'Total',
    addToCart: 'Add to Cart',
    added: 'Added',
    buyNow: 'Buy Now',
    askWhatsapp: 'Ask on WhatsApp',
    whatsappMsg: (name: string, plan: string) => `Hi! I want to buy ${name} (${plan}). Is it available?`,
    trust: [
      { title: 'Fast delivery', body: 'Access sent after payment verification' },
      { title: 'Secure payment', body: 'bKash, Nagad, Rocket & Binance' },
      { title: 'Guaranteed', body: 'Support for the full plan period' },
      { title: 'Support', body: 'Help via WhatsApp, phone & email' },
    ],
    weAccept: 'We accept',
    details: 'Product details',
    howToBuy: 'How to buy',
    steps: [
      'Choose your account type and duration, then tap Buy Now.',
      'Send the payment via bKash, Nagad, Rocket or Binance.',
      'Enter your details and the transaction ID, then confirm the order.',
      'We verify the payment and send your access on WhatsApp / email.',
    ],
    noPlans: 'Pricing is not available yet. Contact us on WhatsApp for details.',
  },
  bn: {
    outOfStock: 'স্টক নেই',
    outOfStockNote: 'পণ্যটি এই মুহূর্তে পাওয়া যাচ্ছে না। আবার স্টকে এলে জানতে হোয়াটসঅ্যাপে মেসেজ দিন।',
    inStock: 'স্টকে আছে',
    instantDelivery: 'দ্রুত ডেলিভারি',
    perMonth: '/মাস',
    for: '',
    accountType: 'অ্যাকাউন্টের ধরন',
    shared: 'শেয়ার্ড',
    personal: 'পার্সোনাল',
    sharedHint: 'অন্যদের সাথে ব্যবহার · সবচেয়ে কম দাম',
    personalHint: 'প্রাইভেট অ্যাকাউন্ট · শুধু আপনার জন্য',
    duration: 'মেয়াদ',
    month: 'মাস',
    months: 'মাস',
    save: 'সাশ্রয়',
    notAvailable: 'পাওয়া যাচ্ছে না',
    quantity: 'পরিমাণ',
    total: 'মোট',
    addToCart: 'কার্টে যোগ করুন',
    added: 'যোগ হয়েছে',
    buyNow: 'এখনই কিনুন',
    askWhatsapp: 'হোয়াটসঅ্যাপে জিজ্ঞেস করুন',
    whatsappMsg: (name: string, plan: string) => `আসসালামু আলাইকুম! আমি ${name} (${plan}) কিনতে চাই। এটি কি পাওয়া যাবে?`,
    trust: [
      { title: 'দ্রুত ডেলিভারি', body: 'পেমেন্ট যাচাইয়ের পর অ্যাক্সেস পাঠানো হয়' },
      { title: 'নিরাপদ পেমেন্ট', body: 'বিকাশ, নগদ, রকেট ও বাইন্যান্স' },
      { title: 'গ্যারান্টি', body: 'পুরো মেয়াদজুড়ে সাপোর্ট' },
      { title: 'সাপোর্ট', body: 'হোয়াটসঅ্যাপ, ফোন ও ইমেইলে সহায়তা' },
    ],
    weAccept: 'পেমেন্ট মাধ্যম',
    details: 'পণ্যের বিবরণ',
    howToBuy: 'কীভাবে কিনবেন',
    steps: [
      'অ্যাকাউন্টের ধরন ও মেয়াদ বেছে নিয়ে "এখনই কিনুন" চাপুন।',
      'বিকাশ, নগদ, রকেট বা বাইন্যান্সে পেমেন্ট পাঠান।',
      'আপনার তথ্য ও ট্রানজেকশন আইডি দিয়ে অর্ডার কনফার্ম করুন।',
      'পেমেন্ট যাচাই করে আমরা হোয়াটসঅ্যাপ / ইমেইলে অ্যাক্সেস পাঠিয়ে দেব।',
    ],
    noPlans: 'মূল্য এখনো যোগ করা হয়নি। বিস্তারিত জানতে হোয়াটসঅ্যাপে যোগাযোগ করুন।',
  },
} as const

const TRUST_ICONS = [Zap, ShieldCheck, Check, HeadphonesIcon]

function priceOf(plan: ServicePlanDto, type: AccountType): number {
  const n = Number(type === 'personal' ? plan.personalPrice : plan.sharedPrice)
  return Number.isFinite(n) && n > 0 ? n : 0
}

function fmt(n: number): string {
  return `${CURRENCY}${Math.round(n).toLocaleString('en-US')}`
}

/** Interactive part of the product page. Data is fetched + cached on the server (see page.tsx). */
export default function ProductDetailClient({ service }: { service: ServiceDetailDto }) {
  const router = useRouter()
  const { addItem, setDrawerOpen } = useCart()
  const { language } = useLanguage()
  const tx = TEXT[language === 'bn' ? 'bn' : 'en']
  const outOfStock = service.isActive === false

  const plans = useMemo(
    () => [...service.servicePlans].sort((a, b) => a.months - b.months),
    [service.servicePlans],
  )
  const accountTypes = useMemo(
    () => (['shared', 'personal'] as const).filter((t) => plans.some((p) => priceOf(p, t) > 0)),
    [plans],
  )

  const [accountType, setAccountType] = useState<AccountType>(() => accountTypes[0] ?? 'shared')
  const [planId, setPlanId] = useState<string | null>(() => {
    const first = plans.find((p) => priceOf(p, accountTypes[0] ?? 'shared') > 0)
    return (plans.find((p) => p.months === 1 && priceOf(p, accountTypes[0] ?? 'shared') > 0) ?? first)?.id ?? null
  })
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const selectedPlan = plans.find((p) => p.id === planId) ?? null
  const unitPrice = selectedPlan ? priceOf(selectedPlan, accountType) : 0

  /** Highest per-month rate for this account type (normally the 1-month plan) — baseline for "Save x%". */
  const basePerMonth = useMemo(() => {
    const rates = plans.filter((p) => priceOf(p, accountType) > 0).map((p) => priceOf(p, accountType) / p.months)
    return rates.length ? Math.max(...rates) : 0
  }, [plans, accountType])

  function savingsPercent(plan: ServicePlanDto): number {
    const price = priceOf(plan, accountType)
    if (!price || !basePerMonth || plan.months <= 1) return 0
    const pct = Math.round((1 - price / plan.months / basePerMonth) * 100)
    return pct >= 3 ? pct : 0
  }

  function durationLabel(months: number): string {
    return `${months} ${months === 1 ? tx.month : tx.months}`
  }

  function chooseType(type: AccountType) {
    setAccountType(type)
    if (selectedPlan && priceOf(selectedPlan, type) > 0) return
    const fallback = plans.find((p) => p.months === 1 && priceOf(p, type) > 0) ?? plans.find((p) => priceOf(p, type) > 0)
    setPlanId(fallback?.id ?? null)
  }

  const planText = selectedPlan
    ? `${durationLabel(selectedPlan.months)} · ${accountType === 'personal' ? TEXT.en.personal : TEXT.en.shared}`
    : ''

  function buildCartItem() {
    if (!selectedPlan || outOfStock || unitPrice <= 0) return null
    // Duration goes into the name so it is visible in the cart AND recorded on the order.
    const months = selectedPlan.months
    return {
      serviceId: service.id,
      slug: service.slug,
      imgUrl: service.imgUrl ?? null,
      nameEn: `${service.name} — ${months} ${months === 1 ? 'Month' : 'Months'}`,
      nameBn: `${service.name} — ${months} মাস`,
      offerPrice: unitPrice,
      sharedPrice: priceOf(selectedPlan, 'shared'),
      personalPrice: priceOf(selectedPlan, 'personal'),
      priceType: accountType,
      quantity: qty,
      periodKey: months === 1 ? ('month' as const) : ('year' as const),
    }
  }

  function handleAddToCart() {
    const item = buildCartItem()
    if (!item) return
    addItem(item)
    setJustAdded(true)
  }

  useEffect(() => {
    if (!justAdded) return
    const timer = window.setTimeout(() => setJustAdded(false), 1800)
    return () => window.clearTimeout(timer)
  }, [justAdded])

  /** Buy Now skips the cart and goes straight to the order form. */
  function handleBuyNow() {
    const item = buildCartItem()
    if (!item) return
    addItem(item, { openDrawer: false })
    setDrawerOpen(false)
    router.push('/confirm-order')
  }

  // Mobile sticky bar shows once the main buttons scroll out of view
  const actionsRef = useRef<HTMLDivElement | null>(null)
  const [actionsVisible, setActionsVisible] = useState(true)
  useEffect(() => {
    const el = actionsRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setActionsVisible(entry?.isIntersecting ?? true))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const canBuy = !!selectedPlan && unitPrice > 0 && !outOfStock
  const stickyBarShown = canBuy && !actionsVisible

  // Let other fixed UI (floating contact button) move above the sticky bar via CSS
  useEffect(() => {
    const root = document.documentElement
    if (stickyBarShown) root.dataset.buybar = 'on'
    else delete root.dataset.buybar
    return () => {
      delete root.dataset.buybar
    }
  }, [stickyBarShown])
  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsappDigits}?text=${encodeURIComponent(
    tx.whatsappMsg(service.name, planText || service.name),
  )}`
  const description = serviceDetails(service)
  const shortDescription = serviceSummary(service)
  const paymentLogos = Object.entries(siteConfig.checkoutPayment)

  return (
    <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 py-6 md:py-10">
      <Breadcrumb items={[{ label: 'Shop', href: '/shop' }, { label: service.name }]} />

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        {/* ── Image ─────────────────────────────────────────── */}
        <div className="md:sticky md:top-24 md:self-start">
          <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
            <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
              {outOfStock && (
                <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                  {tx.outOfStock}
                </span>
              )}
            </div>
            <div className={outOfStock ? 'opacity-70 grayscale-[0.3]' : ''}>
              <ServiceImage service={service} variant="detail" />
            </div>
          </div>
        </div>

        {/* ── Purchase panel ────────────────────────────────── */}
        <div className="flex min-w-0 flex-col gap-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
                  outOfStock
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${outOfStock ? 'bg-rose-500' : 'bg-emerald-500'}`} aria-hidden />
                {outOfStock ? tx.outOfStock : tx.inStock}
              </span>
              {!outOfStock && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2.5 py-1 text-sky-700 dark:text-sky-300">
                  <Zap className="h-3.5 w-3.5" aria-hidden /> {tx.instantDelivery}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {service.name}
            </h1>
            {shortDescription && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-neutral-300">
                {shortDescription}
              </p>
            )}
          </div>

          {outOfStock && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
              {tx.outOfStockNote}
            </div>
          )}

          {/* Price */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
            {selectedPlan && unitPrice > 0 ? (
              <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                <span className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-4xl">
                  {fmt(unitPrice)}
                </span>
                <span className="pb-1 text-sm text-slate-500 dark:text-neutral-400">
                  {tx.for} {durationLabel(selectedPlan.months)}
                  {selectedPlan.months > 1 && (
                    <> · {fmt(unitPrice / selectedPlan.months)}{tx.perMonth}</>
                  )}
                </span>
                {savingsPercent(selectedPlan) > 0 && (
                  <span className="mb-1 rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                    {tx.save} {savingsPercent(selectedPlan)}%
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-neutral-300">
                {plans.length ? fmt(Number(service.price)) : tx.noPlans}
              </p>
            )}
          </div>

          {/* Account type */}
          {accountTypes.length > 0 && (
            <fieldset disabled={outOfStock}>
              <legend className="mb-2 text-sm font-semibold text-slate-800 dark:text-neutral-200">{tx.accountType}</legend>
              <div className={`grid gap-3 ${accountTypes.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {accountTypes.map((type) => {
                  const active = accountType === type
                  const Icon = type === 'shared' ? Users : User
                  const priceHere = selectedPlan ? priceOf(selectedPlan, type) : 0
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => chooseType(type)}
                      aria-pressed={active}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                        active
                          ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500'
                          : 'border-slate-200 hover:border-emerald-400 dark:border-neutral-700'
                      }`}
                    >
                      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} aria-hidden />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-baseline gap-x-2">
                          <span className="font-semibold text-slate-900 dark:text-neutral-100">
                            {type === 'shared' ? tx.shared : tx.personal}
                          </span>
                          {priceHere > 0 && (
                            <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">{fmt(priceHere)}</span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-xs leading-snug text-slate-500 dark:text-neutral-400">
                          {type === 'shared' ? tx.sharedHint : tx.personalHint}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          {/* Duration */}
          {plans.length > 0 && (
            <fieldset disabled={outOfStock}>
              <legend className="mb-2 text-sm font-semibold text-slate-800 dark:text-neutral-200">{tx.duration}</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {plans.map((plan) => {
                  const price = priceOf(plan, accountType)
                  const available = price > 0
                  const active = plan.id === planId
                  const save = savingsPercent(plan)
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      disabled={!available}
                      onClick={() => setPlanId(plan.id)}
                      aria-pressed={active}
                      className={`relative rounded-xl border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed ${
                        active
                          ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500'
                          : available
                            ? 'border-slate-200 hover:border-emerald-400 dark:border-neutral-700'
                            : 'border-dashed border-slate-200 opacity-50 dark:border-neutral-800'
                      }`}
                    >
                      {save > 0 && (
                        <span className="absolute -top-2 right-2 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-amber-950">
                          -{save}%
                        </span>
                      )}
                      <span className="block text-sm font-semibold text-slate-900 dark:text-neutral-100">
                        {durationLabel(plan.months)}
                      </span>
                      <span className={`block text-xs ${active ? 'font-semibold text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-neutral-400'}`}>
                        {available ? fmt(price) : tx.notAvailable}
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          {/* Quantity + total */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-neutral-200" id="qty-label">{tx.quantity}</p>
              <div className="inline-flex items-center rounded-full border border-slate-300 bg-white dark:border-neutral-600 dark:bg-neutral-900" role="group" aria-labelledby="qty-label">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={outOfStock || qty <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-l-full text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={MAX_QTY}
                  value={qty}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10)
                    setQty(Number.isNaN(n) ? 1 : Math.min(MAX_QTY, Math.max(1, n)))
                  }}
                  disabled={outOfStock}
                  aria-label={tx.quantity}
                  className="h-10 w-12 border-x border-slate-300 bg-transparent text-center text-sm font-semibold text-slate-900 focus:outline-none dark:border-neutral-600 dark:text-neutral-100 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                  disabled={outOfStock || qty >= MAX_QTY}
                  className="flex h-10 w-10 items-center justify-center rounded-r-full text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            {canBuy && (
              <p className="text-right text-sm text-slate-500 dark:text-neutral-400" aria-live="polite">
                {tx.total}
                <span className="block text-2xl font-bold text-slate-900 dark:text-white">{fmt(unitPrice * qty)}</span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div ref={actionsRef} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={!canBuy}
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-950 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
              >
                {justAdded ? <Check className="h-4 w-4" aria-hidden /> : <ShoppingCart className="h-4 w-4" aria-hidden />}
                {justAdded ? tx.added : tx.addToCart}
              </button>
              <button
                type="button"
                disabled={!canBuy}
                onClick={handleBuyNow}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 shadow-sm shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Zap className="h-4 w-4" aria-hidden />
                {tx.buyNow}
              </button>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-emerald-400"
            >
              <MessageCircle className="h-4 w-4 text-emerald-500" aria-hidden />
              {tx.askWhatsapp}
            </a>
          </div>

          {/* Payment methods */}
          <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4 dark:border-neutral-800">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-neutral-400">
              <CreditCard className="h-4 w-4" aria-hidden /> {tx.weAccept}
            </span>
            {paymentLogos.map(([key, cfg]) => (
              <img
                key={key}
                src={cfg.logoSrc}
                alt={key}
                width={56}
                height={28}
                className="h-7 w-14 rounded-md border border-slate-200 bg-white object-contain p-1 dark:border-neutral-700"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Trust badges ──────────────────────────────────────── */}
      <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tx.trust.map((item, i) => {
          const Icon = TRUST_ICONS[i] ?? Check
          return (
            <li
              key={item.title}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950"
            >
              <span className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900 dark:text-neutral-100">{item.title}</span>
                <span className="mt-0.5 block text-xs leading-snug text-slate-500 dark:text-neutral-400">{item.body}</span>
              </span>
            </li>
          )
        })}
      </ul>

      {/* ── Details + how to buy ──────────────────────────────── */}
      <div className={`mt-10 grid gap-6 ${description ? 'lg:grid-cols-[1fr_22rem]' : ''}`}>
        {description && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950 sm:p-6">
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">{tx.details}</h2>
            <div className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-neutral-300">{description}</div>
          </section>
        )}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950 sm:p-6 lg:self-start">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">{tx.howToBuy}</h2>
          <ol className={`grid gap-4 ${description ? '' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
            {tx.steps.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-emerald-950">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-sm leading-relaxed text-slate-700 dark:text-neutral-300">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* ── Mobile sticky buy bar (above the bottom nav) ──────── */}
      {canBuy && (
        <div
          className={`fixed inset-x-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur transition-transform duration-200 dark:border-neutral-800 dark:bg-neutral-950 md:hidden bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] ${
            actionsVisible ? 'pointer-events-none translate-y-[200%]' : 'translate-y-0'
          }`}
          aria-hidden={actionsVisible}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-slate-500 dark:text-neutral-400">{planText}</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{fmt(unitPrice * qty)}</p>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              tabIndex={actionsVisible ? -1 : 0}
              aria-label={tx.addToCart}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500 text-emerald-600 dark:text-emerald-400"
            >
              {justAdded ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              tabIndex={actionsVisible ? -1 : 0}
              className="h-11 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-emerald-950"
            >
              {tx.buyNow}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
