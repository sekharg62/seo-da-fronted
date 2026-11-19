"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check, CheckCircle, Download, Minus, Plus, PackageSearch, ShoppingCart, Trash2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useCart } from '@/context/CartContext'
import { createOrder, type OrderDto } from '@/services/orderService'
import { apiClient } from '@/services/apiClient'
import { siteConfig, formatWhatsappLocalFromDigits } from '@/siteConfig'
import { MobilePhoneInput } from '@/components/MobilePhoneInput'
import { CartItemThumb } from '@/components/CartItemThumb'
import { WhatsAppOrderBox } from '@/components/WhatsAppOrderBox'
import { printOrderBill } from '@/lib/orderBill'
import { saveOrder } from '@/lib/orderHistory'
import { productHref } from '@/lib/productUrl'
import { needsPayerNumber, payerNumberError, payerNumberHint, payerNumberLabel, payerNumberPlaceholder, transactionIdHint } from '@/lib/payerNumber'

const CURRENCY = '৳'

const CHECKOUT_PAYMENT_METHODS = ['bkash', 'nagad', 'rocket', 'binance'] as const

function CopyButton({ text, copyLabel, copiedLabel }: { text: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-neutral-600 bg-slate-100 dark:bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-neutral-800 transition"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-amber-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? copiedLabel : copyLabel}
    </button>
  )
}

export default function ConfirmOrderPage() {
  const { t, language } = useLanguage()
  const { items, totalAmount, totalItems, removeItem, updatePriceType, updateQuantity, hydrated } = useCart()

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    orderNotes: '',
    paymentMethod: '' as '' | 'bkash' | 'nagad' | 'rocket' | 'binance',
    transactionId: '',
    userPaymentMethodNumber: '',
  })
  const [payerTouched, setPayerTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderData, setOrderData] = useState<OrderDto | null>(null)
  /** serviceId → image, captured before the cart is cleared (fallback for the success screen) */
  const [orderedImages, setOrderedImages] = useState<Record<string, string | null | undefined>>({})

  const [couponCode, setCouponCode] = useState('')
  const [couponApplying, setCouponApplying] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [discountPercent, setDiscountPercent] = useState<number>(0)
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  const discountAmount = Math.round((totalAmount * discountPercent) / 100)
  const finalTotal = Math.max(0, totalAmount - discountAmount)

  const paymentConfig =
    form.paymentMethod && CHECKOUT_PAYMENT_METHODS.includes(form.paymentMethod)
      ? siteConfig.checkoutPayment[form.paymentMethod]
      : null
  const instructionText =
    paymentConfig && paymentConfig.instructionKey
      ? (t(paymentConfig.instructionKey) || '').replace(/\{\{number\}\}/g, paymentConfig.accountNumber || '')
      : ''

  const whatsappLocal = formatWhatsappLocalFromDigits(siteConfig.contact.whatsappDigits)

  const requiredFilled =
    form.fullName.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.email.trim() !== '' &&
    form.paymentMethod !== '' &&
    form.transactionId.trim() !== '' &&
    payerNumberError(form.paymentMethod, form.userPaymentMethodNumber, 'en') === null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!requiredFilled || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const order = await createOrder({
        customer: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          whatsappNumber: form.whatsappNumber.trim() || undefined,
        },
        items: items.map((i) => ({
          serviceId: i.serviceId,
          serviceName: i.nameEn,
          quantity: i.quantity,
          price: i.offerPrice,
        })),
        totalPrice: finalTotal,
        paymentMethod: form.paymentMethod,
        transactionId: form.transactionId.trim(),
        userPaymentMethodNumber: needsPayerNumber(form.paymentMethod) ? form.userPaymentMethodNumber.trim() : undefined,
        orderNotes:
          [
            form.orderNotes.trim() || null,
            appliedCoupon ? `Coupon: ${appliedCoupon} (-${discountPercent}%)` : null,
          ].filter(Boolean).join(' | ') || undefined,
      })
      setOrderedImages(Object.fromEntries(items.map((i) => [i.serviceId, i.imgUrl])))
      // Remember on this device for /track-order (order ID + phone are needed to look it up)
      saveOrder({
        orderNo: order.orderNo,
        phone: form.phone.trim(),
        createdAt: order.createdAt,
        summary: order.orderItems.length > 1
          ? `${order.orderItems[0]?.serviceName} +${order.orderItems.length - 1}`
          : order.orderItems[0]?.serviceName,
        total: Number(order.totalPrice),
      })
      // Clear the cart
      items.forEach((i) => removeItem(i.serviceId))
      setOrderData(order)
      setOrderId(order.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      // 400 = validation message from the API (e.g. invalid bKash number) — show it as-is
      const apiMessage = (err as { response?: { status?: number; data?: { message?: unknown } } })?.response
      setSubmitError(
        apiMessage?.status === 400 && typeof apiMessage.data?.message === 'string'
          ? apiMessage.data.message
          : language === 'bn'
            ? 'অর্ডার জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'
            : 'Failed to submit order. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (orderId && orderData) {
    const o = orderData


    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f] flex flex-col items-center justify-center px-4 text-center py-12">
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-[#0f0f0f] p-8 max-w-lg w-full shadow-lg">
          <CheckCircle className="mx-auto mb-4 h-14 w-14 text-amber-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50 mb-2">
            {language === 'bn' ? 'অর্ডার সফল!' : 'Order Placed!'}
          </h1>
          <p className="text-slate-600 dark:text-neutral-400 text-sm mb-4">
            {language === 'bn'
              ? 'আপনার অর্ডার গ্রহণ করা হয়েছে। পেমেন্ট যাচাই হলে আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।'
              : 'Your order has been received. We will contact you shortly after payment verification.'}
          </p>
          <WhatsAppOrderBox
            className="mb-5"
            orderNo={o.orderNo}
            paymentMethod={o.paymentMethod}
            payerNumber={o.userPaymentMethodNumber}
          />

          <ul className="mb-6 space-y-2 text-left">
            {o.orderItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800/50 p-2.5"
              >
                <CartItemThumb
                  name={item.serviceName}
                  imgUrl={item.service?.imgUrl ?? (item.serviceId ? orderedImages[item.serviceId] : null)}
                  className="h-12 w-12"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-neutral-100">{item.serviceName}</p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    {item.quantity} × {CURRENCY}{Number(item.price).toFixed(0)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-amber-700 dark:text-amber-400">
                  {CURRENCY}{(Number(item.price) * item.quantity).toFixed(0)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={() => printOrderBill(o)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-6 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-300 transition"
            >
              <Download className="h-4 w-4" />
              {language === 'bn' ? 'বিল ডাউনলোড করুন' : 'Download Bill'}
            </button>
            <Link
              href={`/track-order?id=${o.orderNo}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500 bg-transparent px-6 py-2.5 text-sm font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition"
            >
              <PackageSearch className="h-4 w-4" />
              {language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track order'}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-neutral-600 bg-transparent px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-900 transition"
            >
              {language === 'bn' ? 'হোমে ফিরুন' : 'Back to Home'}
            </Link>
          </div>
        </div>

      </div>
    )
  }

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 py-6 md:py-10" aria-busy="true">
        <div className="mb-6 h-8 w-56 rounded-lg bg-gray-200 dark:bg-neutral-900 animate-pulse" />
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          <div className="flex-1 h-96 rounded-lg bg-gray-200 dark:bg-neutral-900 animate-pulse" />
          <div className="lg:w-[26rem] h-72 rounded-lg bg-gray-200 dark:bg-neutral-900 animate-pulse" />
        </div>
      </div>
    )
  }

  if (totalItems === 0) {
    return (
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 py-10 md:py-16">
        <div className="rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0f0f0f] p-8 md:p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-900">
            <ShoppingCart className="h-10 w-10 text-slate-400 dark:text-neutral-500" strokeWidth={1.25} aria-hidden />
          </div>
          <p className="text-slate-600 dark:text-neutral-300 mb-2">{t('emptyCart')}</p>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">{t('emptyCartHint')}</p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-neutral-950 shadow-sm transition hover:bg-amber-300"
          >
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    )
  }

  async function applyCoupon() {
    const code = couponCode.trim()
    if (!code) return
    setCouponApplying(true)
    setCouponError(null)
    try {
      const res = await apiClient.get<{ couponCode: string; discount: number }>(`/api/public/coupons/validate?code=${encodeURIComponent(code)}`)
      const disc = Number(res.data.discount)
      if (!Number.isFinite(disc) || disc < 0 || disc > 100) throw new Error('Invalid discount')
      setDiscountPercent(Math.round(disc))
      setAppliedCoupon(res.data.couponCode)
    } catch {
      setDiscountPercent(0)
      setAppliedCoupon(null)
      setCouponError(language === 'bn' ? 'কুপন কোড সঠিক নয়।' : 'Invalid coupon code.')
    } finally {
      setCouponApplying(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-neutral-50 mb-6">
        {t('confirmOrderTitle')}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Left: Billing details */}
        <div className="flex-1 space-y-6">
          <section className="rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0f0f0f] p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-50 mb-4">
              {t('billingDetails')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">{t('fullName')}<span className="text-red-500 ml-1">*</span></label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-gray-900 dark:text-neutral-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder={language === 'bn' ? 'পুরো নাম' : 'Full name'}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">{t('phone')}<span className="text-red-500 ml-1">*</span></label>
                <MobilePhoneInput
                  name="phone"
                  value={form.phone}
                  onChange={(phone) => setForm((f) => ({ ...f, phone }))}
                  defaultCountry="BD"
                  inputClassName="w-full rounded-lg border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-gray-900 dark:text-neutral-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="01XXXXXXXXX"
                  required
                  wrapperClassName="w-full max-w-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">{t('whatsappNumber')}</label>
                <input
                  type="tel"
                  value={form.whatsappNumber}
                  onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-gray-900 dark:text-neutral-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="01XXXXXXXXX"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">{t('email')}<span className="text-red-500 ml-1">*</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-gray-900 dark:text-neutral-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="email@example.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">{t('orderNotes')}</label>
                <textarea
                  value={form.orderNotes}
                  onChange={(e) => setForm((f) => ({ ...f, orderNotes: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-gray-900 dark:text-neutral-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y"
                  placeholder={language === 'bn' ? 'অপশনাল নোট' : 'Optional notes'}
                />
              </div>
            </div>
          </section>

          {/* Payment information */}
          <section className="rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0f0f0f] p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-50 mb-4">
              {t('paymentInformation')}
            </h2>

            {/* Payment & contact details */}
            <div className="mb-6 rounded-xl border border-gray-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800/50 p-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-neutral-100 mb-3">
                {t('paymentContactHeading')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-500 dark:text-neutral-400">Email:</span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-amber-700 dark:text-amber-400 hover:underline break-all"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-500 dark:text-neutral-400">Phone:</span>
                  <a
                    href={`tel:${siteConfig.contact.phoneTel.replace(/\s/g, '')}`}
                    className="text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    {siteConfig.contact.phoneDisplay}
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-500 dark:text-neutral-400">WhatsApp:</span>
                  <span className="text-gray-900 dark:text-neutral-100">{whatsappLocal}</span>
                  <CopyButton text={whatsappLocal} copyLabel={t('copyLabel')} copiedLabel={t('copiedLabel')} />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
                  <span className="text-gray-500 dark:text-neutral-400">{t('bkashPersonalLabel')}:</span>
                  <span className="font-mono font-medium text-gray-900 dark:text-neutral-100">
                    {siteConfig.checkoutPayment.bkash.accountNumber}
                  </span>
                  <CopyButton
                    text={siteConfig.checkoutPayment.bkash.accountNumber}
                    copyLabel={t('copyLabel')}
                    copiedLabel={t('copiedLabel')}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
                  <span className="text-gray-500 dark:text-neutral-400">{t('nagadRocketLabel')}:</span>
                  <span className="font-mono font-medium text-gray-900 dark:text-neutral-100">
                    {siteConfig.checkoutPayment.nagad.accountNumber}
                  </span>
                  <CopyButton
                    text={siteConfig.checkoutPayment.nagad.accountNumber}
                    copyLabel={t('copyLabel')}
                    copiedLabel={t('copiedLabel')}
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-neutral-400 mb-4">{t('selectPaymentMethod')} <span className="text-red-500">*</span></p>

            <div className="space-y-3">
              {CHECKOUT_PAYMENT_METHODS.map((key) => {
                const row = siteConfig.checkoutPayment[key]
                const labelKey =
                  key === 'bkash'
                    ? 'paymentBkash'
                    : key === 'nagad'
                      ? 'paymentNagad'
                      : key === 'rocket'
                        ? 'paymentRocket'
                        : 'paymentBinance'
                return (
                  <label
                    key={key}
                    className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition ${form.paymentMethod === key
                      ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/20'
                      : 'border-gray-200 dark:border-neutral-700 hover:border-slate-300 dark:hover:border-neutral-600'
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={key}
                      checked={form.paymentMethod === key}
                      onChange={() => setForm((f) => ({ ...f, paymentMethod: key }))}
                      className="h-4 w-4 text-amber-500 focus:ring-amber-500"
                    />
                    <img
                      src={row.logoSrc}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-lg object-contain bg-white dark:bg-neutral-900 p-0.5"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-neutral-100">{t(labelKey)}</span>
                  </label>
                )
              })}
            </div>

            {paymentConfig && (
              <div className="mt-4 rounded-xl border border-gray-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800/50 p-4">
                <div className="whitespace-pre-line text-sm text-slate-700 dark:text-neutral-300">
                  {instructionText.split('\n\n').map((para, i) => (
                    <div key={i} className="mb-2">
                      {paymentConfig.accountNumber && para.includes(paymentConfig.accountNumber) ? (
                        <span className="flex flex-wrap items-center gap-2">
                          {para.split(paymentConfig.accountNumber).map((part, j) => (
                            <span key={j}>
                              {part}
                              {j === 0 && (
                                <>
                                  <span className="font-mono font-semibold text-gray-900 dark:text-neutral-100">
                                    {paymentConfig.accountNumber}
                                  </span>
                                  <CopyButton
                                    text={paymentConfig.accountNumber}
                                    copyLabel={t('copyLabel')}
                                    copiedLabel={t('copiedLabel')}
                                  />
                                </>
                              )}
                            </span>
                          ))}
                        </span>
                      ) : (
                        para
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {needsPayerNumber(form.paymentMethod) && (() => {
              const lang = language === 'bn' ? 'bn' : 'en'
              const error = payerTouched ? payerNumberError(form.paymentMethod, form.userPaymentMethodNumber, lang) : null
              return (
                <div className="mt-4">
                  <label htmlFor="payer-number" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">
                    {payerNumberLabel(form.paymentMethod, lang)} <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="payer-number"
                    type="text"
                    inputMode={form.paymentMethod === 'binance' ? 'text' : 'tel'}
                    autoComplete={form.paymentMethod === 'binance' ? 'off' : 'tel'}
                    value={form.userPaymentMethodNumber}
                    onChange={(e) => setForm((f) => ({ ...f, userPaymentMethodNumber: e.target.value }))}
                    onBlur={() => setPayerTouched(true)}
                    aria-invalid={!!error}
                    aria-describedby="payer-number-hint"
                    className={`w-full rounded-lg border bg-white dark:bg-neutral-900 px-3 py-2 font-mono text-gray-900 dark:text-neutral-100 placeholder-slate-400 focus:outline-none focus:ring-1 ${
                      error
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500 dark:border-red-500/60'
                        : 'border-slate-300 dark:border-neutral-600 focus:border-amber-500 focus:ring-amber-500'
                    }`}
                    placeholder={payerNumberPlaceholder(form.paymentMethod)}
                  />
                  <p id="payer-number-hint" className={`mt-1 text-xs ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-neutral-400'}`}>
                    {error ?? payerNumberHint(form.paymentMethod, lang)}
                  </p>
                </div>
              )
            })()}

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">{t('transactionId')} <span className="text-red-500 ml-1">*</span></label>
              <input
                type="text"
                value={form.transactionId}
                onChange={(e) => setForm((f) => ({ ...f, transactionId: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-gray-900 dark:text-neutral-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder={language === 'bn' ? 'ট্রানজেকশন আইডি লিখুন' : 'Enter transaction ID'}
              />
              {transactionIdHint(form.paymentMethod, language === 'bn' ? 'bn' : 'en') && (
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  {transactionIdHint(form.paymentMethod, language === 'bn' ? 'bn' : 'en')}
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Right: Order summary (cart) */}
        <div className="shrink-0 lg:w-[26rem] xl:w-[30rem]">
          <div className="sticky top-24 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0f0f0f] p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-50 mb-4">
              {t('orderSummary')}
            </h2>
            <ul className="space-y-3 mb-4 max-h-[26rem] overflow-y-auto pr-1">
              {items.map((item) => {
                const name = language === 'bn' ? item.nameBn : item.nameEn
                const lineTotal = item.offerPrice * item.quantity
                return (
                  <li
                    key={item.serviceId}
                    className="text-sm rounded-xl border border-gray-200 dark:border-neutral-700 bg-slate-50/60 dark:bg-neutral-800/40 p-3"
                  >
                    <div className="flex items-start gap-3">
                      {item.slug ? (
                        <Link href={productHref({ id: item.serviceId, slug: item.slug })} className="shrink-0">
                          <CartItemThumb name={name} imgUrl={item.imgUrl} />
                        </Link>
                      ) : (
                        <CartItemThumb name={name} imgUrl={item.imgUrl} />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-slate-800 dark:text-neutral-100 line-clamp-2">{name}</p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.serviceId)}
                            className="shrink-0 rounded p-1 text-slate-400 hover:bg-gray-200 dark:hover:bg-neutral-800 hover:text-red-600 dark:hover:text-red-400 transition"
                            aria-label={t('remove')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {(Number(item.sharedPrice) > 0 || Number(item.personalPrice) > 0) && (
                          <div className="mt-1 inline-flex rounded-full border border-gray-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-800/40 p-1">
                            {Number(item.sharedPrice) > 0 && (
                              <button
                                type="button"
                                onClick={() => updatePriceType(item.serviceId, 'shared')}
                                className={`px-2.5 py-1 text-xs font-medium rounded-full transition ${(item.priceType ?? 'shared') === 'shared'
                                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                                  : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800'
                                  }`}
                              >
                                Shared
                              </button>
                            )}
                            {Number(item.personalPrice) > 0 && (
                              <button
                                type="button"
                                onClick={() => updatePriceType(item.serviceId, 'personal')}
                                className={`px-2.5 py-1 text-xs font-medium rounded-full transition ${(item.priceType ?? 'shared') === 'personal'
                                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                                  : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800'
                                  }`}
                              >
                                Personal
                              </button>
                            )}
                          </div>
                        )}
                        {(Number(item.sharedPrice) > 0 || Number(item.personalPrice) > 0) && (
                          <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                            {Number(item.sharedPrice) > 0 && `Shared: ${CURRENCY}${Number(item.sharedPrice).toFixed(0)}`}
                            {Number(item.sharedPrice) > 0 && Number(item.personalPrice) > 0 && ' · '}
                            {Number(item.personalPrice) > 0 && `Personal: ${CURRENCY}${Number(item.personalPrice).toFixed(0)}`}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="inline-flex items-center rounded-lg border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-900">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.serviceId, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-l-lg transition"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-7 text-center text-xs font-semibold text-gray-900 dark:text-neutral-100" aria-live="polite">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.serviceId, Math.min(99, item.quantity + 1))}
                              className="flex h-7 w-7 items-center justify-center text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-r-lg transition"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-neutral-100 shrink-0">
                            {CURRENCY}{lineTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="flex justify-between border-t border-gray-200 dark:border-neutral-700 pt-3 text-base font-semibold text-gray-900 dark:text-neutral-50">
              <span>{t('subtotal')}</span>
              <span>{CURRENCY}{totalAmount}</span>
            </div>

            {/* Coupon */}
            <div className="mt-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800/40 p-3">
              <p className="text-sm font-semibold text-slate-800 dark:text-neutral-100 mb-2">
                {language === 'bn' ? 'কুপন কোড' : 'Coupon code'}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder={language === 'bn' ? 'কুপন লিখুন' : 'Enter coupon'}
                  className="flex-1 rounded-lg border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-neutral-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponApplying || couponCode.trim() === ''}
                  className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-amber-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {couponApplying ? (language === 'bn' ? 'প্রয়োগ…' : 'Applying…') : (language === 'bn' ? 'Apply' : 'Apply')}
                </button>
              </div>
              {couponError && (
                <p className="mt-2 text-xs text-red-500 dark:text-red-400">{couponError}</p>
              )}
              {appliedCoupon && discountPercent > 0 && (
                <div className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                  {language === 'bn'
                    ? `Applied: ${appliedCoupon} (-${discountPercent}%)`
                    : `Applied: ${appliedCoupon} (-${discountPercent}%)`}
                </div>
              )}
            </div>

            {discountPercent > 0 && (
              <div className="mt-3 flex justify-between text-sm text-slate-700 dark:text-neutral-200">
                <span>{language === 'bn' ? 'Discount' : 'Discount'}</span>
                <span>-{CURRENCY}{discountAmount}</span>
              </div>
            )}

            <div className="mt-2 flex justify-between border-t border-gray-200 dark:border-neutral-700 pt-3 text-base font-semibold text-gray-900 dark:text-neutral-50">
              <span>{language === 'bn' ? 'Total' : 'Total'}</span>
              <span>{CURRENCY}{finalTotal}</span>
            </div>
            {submitError && (
              <div className="mt-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                {submitError}
              </div>
            )}
            <button
              type="submit"
              disabled={!requiredFilled || submitting}
              className="mt-4 w-full rounded-lg bg-amber-400 px-4 py-3 text-sm font-semibold text-neutral-950 shadow-sm transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-500"
            >
              {submitting
                ? (language === 'bn' ? 'জমা দেওয়া হচ্ছে…' : 'Submitting…')
                : t('confirmOrderButton')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
