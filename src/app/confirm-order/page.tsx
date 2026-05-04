"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Copy, Check, CheckCircle, Download } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useCart } from '@/context/CartContext'
import { createOrder, type OrderDto } from '@/services/orderService'
import { apiClient } from '@/services/apiClient'
import { siteConfig, formatWhatsappLocalFromDigits } from '@/siteConfig'
import { MobilePhoneInput } from '@/components/MobilePhoneInput'

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
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? copiedLabel : copyLabel}
    </button>
  )
}

export default function ConfirmOrderPage() {
  const { t, language } = useLanguage()
  const { items, totalAmount, totalItems, removeItem, updatePriceType } = useCart()
  const router = useRouter()

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    address: '',
    orderNotes: '',
    paymentMethod: '' as '' | 'bkash' | 'nagad' | 'rocket' | 'binance',
    transactionId: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderNo, setOrderNo] = useState<string>('');
  const [orderData, setOrderData] = useState<OrderDto | null>(null)

  const [couponCode, setCouponCode] = useState('')
  const [couponApplying, setCouponApplying] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [discountPercent, setDiscountPercent] = useState<number>(0)
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  const discountAmount = Math.round((totalAmount * discountPercent) / 100)
  const finalTotal = Math.max(0, totalAmount - discountAmount)

  useEffect(() => {
    if (totalItems === 0 && !orderId) router.replace('/checkout')
  }, [totalItems, router, orderId])

  const paymentConfig =
    form.paymentMethod && CHECKOUT_PAYMENT_METHODS.includes(form.paymentMethod)
      ? siteConfig.checkoutPayment[form.paymentMethod]
      : null
  const instructionText =
    paymentConfig && paymentConfig.instructionKey
      ? (t(paymentConfig.instructionKey as any) || '').replace(/\{\{number\}\}/g, paymentConfig.accountNumber || '')
      : ''

  const whatsappLocal = formatWhatsappLocalFromDigits(siteConfig.contact.whatsappDigits)

  const requiredFilled =
    form.fullName.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.email.trim() !== '' &&
    form.paymentMethod !== '' &&
    form.transactionId.trim() !== ''

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
          address: form.address.trim() || undefined,
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
        orderNotes:
          [
            form.orderNotes.trim() || null,
            appliedCoupon ? `Coupon: ${appliedCoupon} (-${discountPercent}%)` : null,
          ].filter(Boolean).join(' | ') || undefined,
      })
      // Clear the cart
      items.forEach((i) => removeItem(i.serviceId))
      setOrderData(order)
      setOrderNo(order.orderNo)
      setOrderId(order.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setSubmitError(
        language === 'bn'
          ? 'অর্ডার জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'
          : 'Failed to submit order. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (orderId && orderData) {
    const o = orderData
    const printDate = new Date(o.createdAt).toLocaleString('en-GB', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

    const handlePrint = () => {
      const printContents = document.getElementById('bill-printable')?.innerHTML
      if (!printContents) return
      const win = window.open('', '_blank', 'width=800,height=900')
      if (!win) return
      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <title>Order Bill – ${siteConfig.websiteName}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; background: #fff; padding: 40px; }
            .header { text-align: center; margin-bottom: 28px; border-bottom: 2px solid #10b981; padding-bottom: 18px; }
            .header h1 { font-size: 26px; font-weight: 800; color: #059669; letter-spacing: -0.5px; }
            .header .tagline { font-size: 12px; color: #6b7280; margin-top: 2px; }
            .header .address { font-size: 12px; color: #374151; margin-top: 6px; }
            .header .contact { font-size: 12px; color: #374151; margin-top: 2px; }
            .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 6px; margin-top: 20px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 20px; font-size: 13px; }
            .info-grid .label { color: #6b7280; }
            .info-grid .value { color: #111; font-weight: 500; }
            .order-id { font-family: monospace; font-size: 11px; background: #f3f4f6; padding: 6px 10px; border-radius: 6px; color: #374151; margin-top: 6px; word-break: break-all; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
            thead tr { background: #f0fdf4; }
            th { text-align: left; padding: 8px 10px; font-weight: 600; color: #059669; border-bottom: 1px solid #d1fae5; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
            td { padding: 8px 10px; border-bottom: 1px solid #f3f4f6; color: #374151; }
            .text-right { text-align: right; }
            .total-row td { font-weight: 700; font-size: 14px; color: #059669; border-top: 2px solid #d1fae5; padding-top: 10px; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; background: #fef3c7; color: #92400e; }
            .footer { margin-top: 36px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 14px; }
            @media print {
              body { padding: 20px; }
              @page { margin: 15mm; }
            }
          </style>
        </head>
        <body>
          ${printContents}
          <script>window.onload = function() { window.print(); }<\/script>
        </body>
        </html>
      `)
      win.document.close()
    }

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 text-center py-12">
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 p-8 max-w-lg w-full shadow-lg">
          <CheckCircle className="mx-auto mb-4 h-14 w-14 text-emerald-500" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            {language === 'bn' ? 'অর্ডার সফল!' : 'Order Placed!'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
            {language === 'bn'
              ? 'আপনার অর্ডার গ্রহণ করা হয়েছে। পেমেন্ট যাচাই হলে আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।'
              : 'Your order has been received. We will contact you shortly after payment verification.'}
          </p>
          <p className="text-xs font-mono bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 text-slate-500 dark:text-slate-400 mb-6 break-all">
            {language === 'bn' ? 'অর্ডার আইডি: ' : 'Order ID: '}{orderNo}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 transition"
            >
              <Download className="h-4 w-4" />
              {language === 'bn' ? 'বিল ডাউনলোড করুন' : 'Download Bill'}
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {language === 'bn' ? 'হোমে ফিরুন' : 'Back to Home'}
            </Link>
          </div>
        </div>

        {/* Hidden printable bill — rendered off-screen, cloned into print window */}
        <div id="bill-printable" className="hidden">
          <div className="header">
            <h1>{siteConfig.websiteName}</h1>
            <div className="tagline">{siteConfig.billing.tagline}</div>
            <div className="address">{siteConfig.billing.addressLine}</div>
            <div className="contact">
              Email: {siteConfig.contact.email} &nbsp;|&nbsp; WhatsApp: {whatsappLocal} &nbsp;|&nbsp;               Phone: {siteConfig.contact.phoneDisplay}
            </div>
          </div>

          <div className="section-title">Order Information</div>
          <div className="order-id">Order ID: {o.orderNo}</div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
            Date: {printDate} &nbsp;|&nbsp;
            Status: <span className="badge">PENDING – Awaiting Verification</span>
          </div>

          <div className="section-title">Customer Details</div>
          <div className="info-grid">
            <span className="label">Name</span>
            <span className="value">{o.customer.fullName}</span>
            <span className="label">Phone</span>
            <span className="value">{o.customer.phone ?? '—'}</span>
            <span className="label">Email</span>
            <span className="value">{o.customer.email ?? '—'}</span>
            {o.customer.whatsappNumber && (
              <>
                <span className="label">WhatsApp</span>
                <span className="value">{o.customer.whatsappNumber}</span>
              </>
            )}
            {o.customer.address && (
              <>
                <span className="label">Address</span>
                <span className="value">{o.customer.address}</span>
              </>
            )}
          </div>

          <div className="section-title">Services Purchased</div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Service</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Unit Price</th>
                <th className="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {o.orderItems.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.serviceName}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">৳{Number(item.price).toFixed(0)}</td>
                  <td className="text-right">৳{(Number(item.price) * item.quantity).toFixed(0)}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan={4} className="text-right">Total Amount Paid</td>
                <td className="text-right">৳{Number(o.totalPrice).toFixed(0)}</td>
              </tr>
            </tbody>
          </table>

          <div className="section-title">Payment Details</div>
          <div className="info-grid">
            <span className="label">Payment Method</span>
            <span className="value" style={{ textTransform: 'uppercase' }}>{o.paymentMethod}</span>
            <span className="label">Transaction ID</span>
            <span className="value" style={{ fontFamily: 'monospace' }}>{o.transactionId ?? '—'}</span>
            <span className="label">Amount Paid</span>
            <span className="value" style={{ color: '#059669', fontWeight: 700 }}>৳{Number(o.totalPrice).toFixed(0)}</span>
          </div>
          {o.orderNotes && (
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#374151' }}>
              <strong>Notes:</strong> {o.orderNotes}
            </div>
          )}

          <div className="footer">
            <p>Thank you for choosing {siteConfig.websiteName}!</p>
            <p style={{ marginTop: '4px' }}>
              This is a system-generated receipt. For support, contact us via WhatsApp: {whatsappLocal}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (totalItems === 0) return null

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
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-6">
        {t('confirmOrderTitle' as any)}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Left: Billing details */}
        <div className="flex-1 space-y-6">
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              {t('billingDetails' as any)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{t('fullName' as any)}<span className="text-red-500 ml-1">*</span></label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder={language === 'bn' ? 'পুরো নাম' : 'Full name'}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{t('phone' as any)}<span className="text-red-500 ml-1">*</span></label>
                <MobilePhoneInput
                  name="phone"
                  value={form.phone}
                  onChange={(phone) => setForm((f) => ({ ...f, phone }))}
                  defaultCountry="BD"
                  inputClassName="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="01XXXXXXXXX"
                  required
                  wrapperClassName="w-full max-w-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{t('whatsappNumber' as any)}</label>
                <input
                  type="tel"
                  value={form.whatsappNumber}
                  onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="01XXXXXXXXX"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{t('email' as any)}<span className="text-red-500 ml-1">*</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="email@example.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{t('address' as any)}</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder={language === 'bn' ? 'ঠিকানা' : 'Address'}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{t('orderNotes' as any)}</label>
                <textarea
                  value={form.orderNotes}
                  onChange={(e) => setForm((f) => ({ ...f, orderNotes: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y"
                  placeholder={language === 'bn' ? 'অপশনাল নোট' : 'Optional notes'}
                />
              </div>
            </div>
          </section>

          {/* Payment information */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              {t('paymentInformation' as any)}
            </h2>

            {/* Payment & contact details */}
            <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                {t('paymentContactHeading' as any)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Email:</span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline break-all"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Phone:</span>
                  <a
                    href={`tel:${siteConfig.contact.phoneTel.replace(/\s/g, '')}`}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {siteConfig.contact.phoneDisplay}
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400">WhatsApp:</span>
                  <span className="text-slate-900 dark:text-slate-100">{whatsappLocal}</span>
                  <CopyButton text={whatsappLocal} copyLabel={t('copyLabel' as any)} copiedLabel={t('copiedLabel' as any)} />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
                  <span className="text-slate-500 dark:text-slate-400">{t('bkashPersonalLabel' as any)}:</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-slate-100">
                    {siteConfig.checkoutPayment.bkash.accountNumber}
                  </span>
                  <CopyButton
                    text={siteConfig.checkoutPayment.bkash.accountNumber}
                    copyLabel={t('copyLabel' as any)}
                    copiedLabel={t('copiedLabel' as any)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
                  <span className="text-slate-500 dark:text-slate-400">{t('nagadRocketLabel' as any)}:</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-slate-100">
                    {siteConfig.checkoutPayment.nagad.accountNumber}
                  </span>
                  <CopyButton
                    text={siteConfig.checkoutPayment.nagad.accountNumber}
                    copyLabel={t('copyLabel' as any)}
                    copiedLabel={t('copiedLabel' as any)}
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{t('selectPaymentMethod' as any)} <span className="text-red-500">*</span></p>

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
                      ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={key}
                      checked={form.paymentMethod === key}
                      onChange={() => setForm((f) => ({ ...f, paymentMethod: key }))}
                      className="h-4 w-4 text-emerald-500 focus:ring-emerald-500"
                    />
                    <img
                      src={row.logoSrc}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-lg object-contain bg-white dark:bg-slate-800 p-0.5"
                    />
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{t(labelKey as any)}</span>
                  </label>
                )
              })}
            </div>

            {paymentConfig && (
              <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                <div className="whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">
                  {instructionText.split('\n\n').map((para, i) => (
                    <div key={i} className="mb-2">
                      {paymentConfig.accountNumber && para.includes(paymentConfig.accountNumber) ? (
                        <span className="flex flex-wrap items-center gap-2">
                          {para.split(paymentConfig.accountNumber).map((part, j) => (
                            <span key={j}>
                              {part}
                              {j === 0 && (
                                <>
                                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                                    {paymentConfig.accountNumber}
                                  </span>
                                  <CopyButton
                                    text={paymentConfig.accountNumber}
                                    copyLabel={t('copyLabel' as any)}
                                    copiedLabel={t('copiedLabel' as any)}
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

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{t('transactionId' as any)} <span className="text-red-500 ml-1">*</span></label>
              <input
                type="text"
                value={form.transactionId}
                onChange={(e) => setForm((f) => ({ ...f, transactionId: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder={language === 'bn' ? 'ট্রানজেকশন আইডি লিখুন' : 'Enter transaction ID'}
              />
            </div>
          </section>
        </div>

        {/* Right: Order summary (cart) */}
        <div className="lg:w-96 shrink-0">
          <div className="sticky top-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              {t('orderSummary' as any)}
            </h2>
            <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => {
                const name = language === 'bn' ? item.nameBn : item.nameEn
                const lineTotal = item.offerPrice * item.quantity
                return (
                  <li key={item.serviceId} className="text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-slate-700 dark:text-slate-200 truncate">
                          {name} × {item.quantity}
                        </p>
                        {(Number(item.sharedPrice) > 0 || Number(item.personalPrice) > 0) && (
                          <div className="mt-1 inline-flex rounded-full border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/40 p-1">
                            {Number(item.sharedPrice) > 0 && (
                              <button
                                type="button"
                                onClick={() => updatePriceType(item.serviceId, 'shared')}
                                className={`px-2.5 py-1 text-xs font-medium rounded-full transition ${(item.priceType ?? 'shared') === 'shared'
                                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
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
                                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                  }`}
                              >
                                Personal
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-slate-100 shrink-0">
                        {CURRENCY}{lineTotal}
                      </span>
                    </div>
                    {(Number(item.sharedPrice) > 0 || Number(item.personalPrice) > 0) && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {Number(item.sharedPrice) > 0 && `Shared: ${CURRENCY}${Number(item.sharedPrice).toFixed(0)}`}
                        {Number(item.sharedPrice) > 0 && Number(item.personalPrice) > 0 && ' · '}
                        {Number(item.personalPrice) > 0 && `Personal: ${CURRENCY}${Number(item.personalPrice).toFixed(0)}`}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-3 text-base font-semibold text-slate-900 dark:text-slate-50">
              <span>{t('subtotal' as any)}</span>
              <span>{CURRENCY}{totalAmount}</span>
            </div>

            {/* Coupon */}
            <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-3">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                {language === 'bn' ? 'কুপন কোড' : 'Coupon code'}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder={language === 'bn' ? 'কুপন লিখুন' : 'Enter coupon'}
                  className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponApplying || couponCode.trim() === ''}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {couponApplying ? (language === 'bn' ? 'প্রয়োগ…' : 'Applying…') : (language === 'bn' ? 'Apply' : 'Apply')}
                </button>
              </div>
              {couponError && (
                <p className="mt-2 text-xs text-red-500 dark:text-red-400">{couponError}</p>
              )}
              {appliedCoupon && discountPercent > 0 && (
                <div className="mt-2 text-xs text-emerald-700 dark:text-emerald-300">
                  {language === 'bn'
                    ? `Applied: ${appliedCoupon} (-${discountPercent}%)`
                    : `Applied: ${appliedCoupon} (-${discountPercent}%)`}
                </div>
              )}
            </div>

            {discountPercent > 0 && (
              <div className="mt-3 flex justify-between text-sm text-slate-700 dark:text-slate-200">
                <span>{language === 'bn' ? 'Discount' : 'Discount'}</span>
                <span>-{CURRENCY}{discountAmount}</span>
              </div>
            )}

            <div className="mt-2 flex justify-between border-t border-slate-200 dark:border-slate-700 pt-3 text-base font-semibold text-slate-900 dark:text-slate-50">
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
              className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 shadow-sm transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
            >
              {submitting
                ? (language === 'bn' ? 'জমা দেওয়া হচ্ছে…' : 'Submitting…')
                : t('confirmOrderButton' as any)}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
