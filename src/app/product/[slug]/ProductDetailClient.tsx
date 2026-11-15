"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingCart, Zap, Globe, ShieldCheck, HeadphonesIcon } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import type { ServicePlanDto } from '@/services/servicePlanService'
import type { ServiceDetailDto } from '@/lib/catalog'
import { ServiceImage } from '@/components/ServiceImage'
import { Breadcrumb } from '@/components/Breadcrumb'

const CURRENCY = '৳'

const TRUST_BADGES = [
  { icon: Globe, label: 'Free Shipping Over the world' },
  { icon: ShieldCheck, label: 'Satisfaction Guaranteed' },
  { icon: ShieldCheck, label: 'Secure Payments' },
  { icon: Zap, label: 'Quick Delivery' },
  { icon: HeadphonesIcon, label: 'All Time Support' },
]

/** Per-card palette: light tinted surface + border; dark muted tint + border glow */
const TRUST_BADGE_VARIANTS = [
  {
    card: 'border-sky-200 bg-sky-50/90 dark:border-sky-500/35 dark:bg-sky-950/45',
    iconWrap: 'bg-sky-100 dark:bg-sky-500/20',
    icon: 'text-sky-600 dark:text-sky-400',
    text: 'text-sky-900 dark:text-sky-100',
  },
  {
    card: 'border-emerald-200 bg-emerald-50/90 dark:border-emerald-500/35 dark:bg-emerald-950/45',
    iconWrap: 'bg-emerald-100 dark:bg-emerald-500/20',
    icon: 'text-emerald-700 dark:text-emerald-400',
    text: 'text-emerald-900 dark:text-emerald-100',
  },
  {
    card: 'border-violet-200 bg-violet-50/90 dark:border-violet-500/35 dark:bg-violet-950/45',
    iconWrap: 'bg-violet-100 dark:bg-violet-500/20',
    icon: 'text-violet-600 dark:text-violet-400',
    text: 'text-violet-900 dark:text-violet-100',
  },
  {
    card: 'border-amber-200 bg-amber-50/90 dark:border-amber-500/35 dark:bg-amber-950/45',
    iconWrap: 'bg-amber-100 dark:bg-amber-500/20',
    icon: 'text-amber-700 dark:text-amber-400',
    text: 'text-amber-950 dark:text-amber-100',
  },
  {
    card: 'border-rose-200 bg-rose-50/90 dark:border-rose-500/35 dark:bg-rose-950/45',
    iconWrap: 'bg-rose-100 dark:bg-rose-500/20',
    icon: 'text-rose-600 dark:text-rose-400',
    text: 'text-rose-900 dark:text-rose-100',
  },
] as const

function defaultPlan(plans: ServicePlanDto[]): ServicePlanDto | null {
  return plans.find((p) => p.months === 1) ?? plans[0] ?? null
}

function defaultPriceType(plan: ServicePlanDto | null): 'shared' | 'personal' {
  if (plan && Number(plan.sharedPrice) <= 0 && Number(plan.personalPrice) > 0) return 'personal'
  return 'shared'
}

/** Interactive part of the product page. Data is fetched + cached on the server (see page.tsx). */
export default function ProductDetailClient({ service }: { service: ServiceDetailDto }) {
  const router = useRouter()
  const { addItem, setDrawerOpen } = useCart()

  const plans = service.servicePlans

  const [selectedPlan, setSelectedPlan] = useState<ServicePlanDto | null>(() => defaultPlan(plans))
  const [priceType, setPriceType] = useState<'shared' | 'personal'>(() => defaultPriceType(defaultPlan(plans)))
  const [qty, setQty] = useState<number | string>(1)

  function buildCartItem() {
    if (!selectedPlan || service.isActive === false) return null
    const sharedPrice = Number(selectedPlan.sharedPrice)
    const personalPrice = Number(selectedPlan.personalPrice)
    return {
      serviceId: service.id,
      slug: service.slug,
      imgUrl: service.imgUrl ?? null,
      nameEn: service.name,
      nameBn: service.name,
      offerPrice: priceType === 'personal' ? personalPrice : sharedPrice,
      sharedPrice,
      personalPrice,
      priceType,
      quantity: Number(qty) || 1,
      periodKey: selectedPlan.months === 1 ? ('month' as const) : ('year' as const),
    }
  }

  function handleAddToCart() {
    const item = buildCartItem()
    if (item) addItem(item)
  }

  /** Buy Now skips the cart and goes straight to the order form. */
  function handleBuyNow() {
    const item = buildCartItem()
    if (!item) return
    addItem(item, { openDrawer: false })
    setDrawerOpen(false)
    router.push('/confirm-order')
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      <Breadcrumb items={[{ label: 'Shop', href: '/shop' }, { label: service.name }]} />

      <h1 className="sr-only">{service.name}</h1>
      <>
          {service.isActive === false && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
              <span className="font-semibold">Out of stock.</span> This product is currently unavailable.
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
            {/* LEFT: Product image */}
            <div className="flex flex-col gap-4">
              <div className="relative">
                {service.isActive === false ? (
                  <div className="absolute left-3 top-3 z-10">
                    <span className="inline-flex items-center rounded-full border border-rose-200 b-50 px-2.5 py-1 text-[11px] font-semibold shadow-sm dark:border-rose-500/30 bg-rose-500 text-rose-200">
                      Out of stock
                    </span>
                  </div>
                ) : null}
                <ServiceImage service={service} variant="detail" />
                {service.isActive === false ? (
                  <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-slate-950/10 dark:bg-black/20" aria-hidden />
                ) : null}
              </div>
            </div>

            {/* RIGHT: Product details */}
            <div className="flex flex-col gap-5">
              {/* Price */}
              {selectedPlan && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Start from:</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {CURRENCY}
                    {Number(service.price).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Description */}
              {service.description && (
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              )}

              {/* Meta info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400 w-32">Product Name</span>
                  <span className="font-medium text-slate-800 dark:text-slate-100">{service.name} Subscription</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400 w-32">Source</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    Official
                  </span>
                </div>
              </div>

              {/* Validity - plan selector */}
              {plans.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Validity</p>
                  <div className="flex flex-wrap gap-2">
                    {plans.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => {
                          setSelectedPlan(plan)
                          if (priceType === 'shared' && Number(plan.sharedPrice) <= 0 && Number(plan.personalPrice) > 0) {
                            setPriceType('personal')
                          } else if (priceType === 'personal' && Number(plan.personalPrice) <= 0 && Number(plan.sharedPrice) > 0) {
                            setPriceType('shared')
                          }
                        }}
                        disabled={service.isActive === false}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${selectedPlan?.id === plan.id
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400'
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {plan.months === 1 ? '1 Month' : `${plan.months} Months`}
                      </button>
                    ))}
                  </div>
                  {selectedPlan && (
                    <div className="mt-2 space-y-2">
                      <div className="inline-flex rounded-full border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/40 p-1">
                        {Number(selectedPlan.sharedPrice) > 0 && (
                          <button
                            type="button"
                            onClick={() => setPriceType('shared')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${priceType === 'shared'
                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                          >
                            Shared
                          </button>
                        )}
                        {Number(selectedPlan.personalPrice) > 0 && (
                          <button
                            type="button"
                            onClick={() => setPriceType('personal')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${priceType === 'personal'
                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                          >
                            Personal
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-700 dark:text-slate-200">
                        {Number(selectedPlan.sharedPrice) > 0 && (
                          <div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">Shared</span>{' '}
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {CURRENCY}{Number(selectedPlan.sharedPrice).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {Number(selectedPlan.personalPrice) > 0 && (
                          <div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">Personal</span>{' '}
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {CURRENCY}{Number(selectedPlan.personalPrice).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quantity</p>
                <div className="inline-flex items-center ">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, (Number(q) || 1) - 1))}
                    disabled={service.isActive === false}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={qty}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '') {
                        setQty('');
                      } else {
                        const num = parseInt(v, 10);
                        if (!isNaN(num)) {
                          setQty(Math.min(99, num));
                        }
                      }
                    }}
                    onBlur={() => {
                      if (qty === '' || Number(qty) < 1) setQty(1);
                    }}
                    disabled={service.isActive === false}
                    className="h-9 w-16 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(99, (Number(q) || 1) + 1))}
                    disabled={service.isActive === false}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Total */}
              {selectedPlan && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total:{' '}
                  <span className="font-bold text-slate-900 dark:text-slate-50 text-base">
                    {CURRENCY}
                    {(
                      Number(priceType === 'personal' ? selectedPlan.personalPrice : selectedPlan.sharedPrice) *
                      (Number(qty) || 1)
                    ).toLocaleString()}
                  </span>
                </p>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  disabled={!selectedPlan || service.isActive === false}
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  disabled={!selectedPlan || service.isActive === false}
                  onClick={handleBuyNow}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-950 shadow-sm hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {TRUST_BADGES.map(({ icon: Icon, label }, i) => {
                const v = TRUST_BADGE_VARIANTS[i] ?? TRUST_BADGE_VARIANTS[0]
                return (
                  <div
                    key={label}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center shadow-sm dark:shadow-none ${v.card}`}
                  >
                    <div className={`rounded-full p-2.5 ${v.iconWrap}`}>
                      <Icon className={`h-5 w-5 ${v.icon}`} aria-hidden />
                    </div>
                    <p className={`text-xs font-medium ${v.text}`}>{label}</p>
                  </div>
                )
              })}
            </div>
          </div>

      </>
    </div>
  )
}
