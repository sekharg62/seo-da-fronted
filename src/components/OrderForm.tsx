"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { MobilePhoneInput } from '@/components/MobilePhoneInput'
import { SuccessPage } from '@/components/SuccessPage'
import { ErrorPage } from '@/components/ErrorPage'
import { Breadcrumb } from '@/components/Breadcrumb'
import { WhatsAppOrderBox } from '@/components/WhatsAppOrderBox'
import Link from 'next/link'
import { Download, PackageSearch } from 'lucide-react'
import { printOrderBillAsync } from '@/lib/orderBill'
import { saveOrder, savedOrdersSnapshot, subscribeSavedOrders } from '@/lib/orderHistory'
import { trackOrder } from '@/services/trackService'
import { needsPayerNumber, payerNumberError, payerNumberHint, payerNumberLabel, payerNumberPlaceholder, transactionIdHint } from '@/lib/payerNumber'
import { siteConfig } from '@/siteConfig'
import { GetServicesList, postOrderForm } from '@/services/serviceService'

const inputClass =
  'w-full rounded-lg border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-gray-900 dark:text-neutral-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500'

const initial = {
  name: '',
  phone: '',
  email: '',
  transactionId: '',
  serviceId: '',
  serviceName: '',
  price: '',
  paymentMethod: '',
  userPaymentMethodNumber: '',
}

/**
 * "Create order" form for customers who already paid (bKash/Nagad/Rocket/Binance).
 * Rendered by the /create-order route; the footer's "Create order" button links there.
 */
export function OrderForm() {
  const { t, language } = useLanguage()
  const lang = language === 'bn' ? 'bn' : 'en'
  const [form, setForm] = useState(initial)
  const [payerTouched, setPayerTouched] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [services, setServices] = useState<{ id: string; name: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  /** Set after a successful submit; the success screen stays until "Create another order" */
  const [success, setSuccess] = useState<null | { orderNo?: string; phone: string; paymentMethod: string; payerNumber?: string }>(null)
  const [billError, setBillError] = useState<string | null>(null)
  // How many orders this device already has (for the "track your orders" suggestion)
  const savedCount = useSyncExternalStore(
    subscribeSavedOrders,
    () => {
      try {
        const list = JSON.parse(savedOrdersSnapshot())
        return Array.isArray(list) ? list.length : 0
      } catch {
        return 0
      }
    },
    () => 0,
  )
  const [apiError, setApiError] = useState<string | null>(null)

  const paymentOptions = [
    { key: 'bkash', labelKey: 'paymentBkash', logoSrc: siteConfig.checkoutPayment.bkash.logoSrc },
    { key: 'nagad', labelKey: 'paymentNagad', logoSrc: siteConfig.checkoutPayment.nagad.logoSrc },
    { key: 'rocket', labelKey: 'paymentRocket', logoSrc: siteConfig.checkoutPayment.rocket.logoSrc },
    { key: 'binance', labelKey: 'paymentBinance', logoSrc: siteConfig.checkoutPayment.binance.logoSrc },
  ] as const

  const selectedPayment = paymentOptions.find((p) => p.key === form.paymentMethod) ?? null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setApiError(null)
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.transactionId.trim() ||
      !form.price.trim() ||
      !form.paymentMethod.trim() ||
      !(form.serviceId.trim() || form.serviceName.trim())
    ) {
      setFormError('Please fill in all required fields.')
      return
    }
    const payerError = payerNumberError(form.paymentMethod, form.userPaymentMethodNumber, lang)
    if (payerError) {
      setPayerTouched(true)
      setFormError(payerError)
      return
    }
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      transactionId: form.transactionId.trim(),
      serviceId: form.serviceId.trim() || undefined,
      serviceName: form.serviceId.trim() ? undefined : form.serviceName.trim(),
      price: form.price.trim(),
      paymentMethod: form.paymentMethod.trim(),
      userPaymentMethodNumber: needsPayerNumber(form.paymentMethod) ? form.userPaymentMethodNumber.trim() : undefined,
    }
    try {
      setSubmitting(true)
      const result = (await postOrderForm(payload)) as { orderNo?: string } | undefined
      const orderNo = typeof result?.orderNo === 'string' ? result.orderNo : undefined
      setSuccess({
        orderNo,
        phone: payload.phone,
        paymentMethod: payload.paymentMethod,
        payerNumber: payload.userPaymentMethodNumber,
      })
      setBillError(null)
      if (orderNo) {
        // Remember on this device for /track-order
        saveOrder({
          orderNo,
          phone: payload.phone,
          createdAt: new Date().toISOString(),
          summary: payload.serviceName ?? services.find((s) => s.id === payload.serviceId)?.name ?? form.serviceName.trim(),
          total: Number(payload.price),
        })
      }
      setForm(initial)
      setPayerTouched(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      const response = (err as { response?: { status?: number; data?: { message?: unknown } } })?.response
      if (response?.status === 400 && typeof response.data?.message === 'string') {
        // Validation problem (e.g. invalid bKash number): keep the form and show the message inline
        setFormError(response.data.message)
        return
      }
      setApiError('Something went wrong while submitting your order. Please try again.')
      window.setTimeout(() => setApiError(null), 3500)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    GetServicesList()
      .then((rows) => {
        if (cancelled) return
        setServices(
          (rows ?? [])
            .map((s) => ({ id: String(s.id), name: String(s.name ?? '').trim() }))
            .filter((s) => s.name.length > 0),
        )
      })
      .catch(() => {
        if (!cancelled) setServices([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 md:py-12">
      <Breadcrumb items={[{ label: t('footerCreateOrder' as any) }]} jsonLd={false} />
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-50 sm:text-3xl">
          {t('postOrderFormTitle')}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400 sm:text-base">
          {t('postOrderFormSubtitle')}
        </p>
      </div>

      {!success && savedCount > 0 && (
        <Link
          href="/track-order"
          className="mb-5 flex items-center gap-3 rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-900 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100 dark:hover:bg-amber-500/15"
        >
          <PackageSearch className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
          <span className="min-w-0 flex-1">
            {lang === 'bn'
              ? `এই ডিভাইস থেকে ${savedCount}টি অর্ডার করেছেন। আগের অর্ডারের অবস্থা দেখবেন?`
              : `You have ${savedCount} order${savedCount > 1 ? 's' : ''} from this device. Check the status of a previous order?`}
          </span>
          <span className="shrink-0 font-semibold">{lang === 'bn' ? 'ট্র্যাক →' : 'Track →'}</span>
        </Link>
      )}

      {success ? (
        <div className="space-y-4">
          <SuccessPage
            title={lang === 'bn' ? 'অর্ডার সফলভাবে জমা হয়েছে' : 'Order submitted successfully'}
            message={
              lang === 'bn'
                ? 'আপনার অনুরোধ পেয়েছি। আমাদের টিম শীঘ্রই এটি প্রসেস করবে।'
                : 'We received your request. Our team will process it shortly.'
            }
          />
          <WhatsAppOrderBox
            orderNo={success.orderNo}
            paymentMethod={success.paymentMethod}
            payerNumber={success.payerNumber}
          />
          {success.orderNo && (
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={async () => {
                  const { orderNo, phone } = success
                  if (!orderNo) return
                  const ok = await printOrderBillAsync(() => trackOrder(orderNo, phone))
                  setBillError(ok ? null : lang === 'bn' ? 'বিল খুলতে পপ-আপ অনুমতি দিন বা আবার চেষ্টা করুন।' : 'Allow pop-ups or try again to open the bill.')
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300"
              >
                <Download className="h-4 w-4" aria-hidden />
                {lang === 'bn' ? 'বিল ডাউনলোড করুন' : 'Download bill'}
              </button>
              <Link
                href={`/track-order?id=${success.orderNo}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500 px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-500/10"
              >
                <PackageSearch className="h-4 w-4" aria-hidden />
                {lang === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track order'}
              </Link>
            </div>
          )}
          {billError && <p className="text-xs text-red-600 dark:text-red-400">{billError}</p>}
          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-900"
          >
            {lang === 'bn' ? 'আরেকটি অর্ডার তৈরি করুন' : 'Create another order'}
          </button>
        </div>
      ) : apiError ? (
        <ErrorPage
          title="Order submission failed"
          message={apiError}
          hint="This form will be shown again in a few seconds."
          onRetry={() => setApiError(null)}
        />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-[#0f0f0f] sm:p-6"
        >
          {formError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              {formError}
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">
                {t('fullName')} <span className="text-red-600 dark:text-red-400">*</span>
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
                autoComplete="name"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">
                {t('phone')} <span className="text-red-600 dark:text-red-400">*</span>
              </span>
              <MobilePhoneInput
                name="phone"
                value={form.phone}
                onChange={(phone) => setForm((f) => ({ ...f, phone }))}
                defaultCountry="BD"
                inputClassName={inputClass}
                placeholder="1XXXXXXXXX"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">
                {t('email')} <span className="text-red-600 dark:text-red-400">*</span>
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={inputClass}
                autoComplete="email"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">
                {t('postOrderFieldServiceName')}{' '}
                <span className="text-red-600 dark:text-red-400">*</span>
              </span>
              <input
                type="text"
                name="serviceName"
                list="post-order-services"
                value={form.serviceName}
                onChange={(e) => {
                  const value = e.target.value
                  const match = services.find((s) => s.name === value)
                  setForm((f) => ({
                    ...f,
                    serviceName: value,
                    serviceId: match ? match.id : '',
                  }))
                }}
                className={inputClass}
                placeholder={services.length ? 'Select service or type...' : 'Type service name...'}
                required
              />
              <datalist id="post-order-services">
                {services.map((item) => (
                  <option key={item.id} value={item.name} />
                ))}
              </datalist>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">
                {t('postOrderFieldPrice')} <span className="text-red-600 dark:text-red-400">*</span>
              </span>
              <input
                type="number"
                min="0"
                name="price"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className={inputClass}
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">
                {t('postOrderFieldPaymentMethod')}{' '}
                <span className="text-red-600 dark:text-red-400">*</span>
              </span>
              {/* Hidden input so native form submission still includes the value */}
              <input type="hidden" name="paymentMethod" value={form.paymentMethod} />

              <div
                className="relative"
                tabIndex={0}
                onBlur={() => setPaymentOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setPaymentOpen((v) => !v)}
                  className={[
                    inputClass,
                    'flex items-center justify-between gap-3 text-left',
                    'cursor-pointer',
                  ].join(' ')}
                  aria-haspopup="listbox"
                  aria-expanded={paymentOpen}
                  aria-invalid={!form.paymentMethod.trim()}
                >
                  {selectedPayment ? (
                    <span className="flex min-w-0 items-center gap-2">
                      <img
                        src={selectedPayment.logoSrc}
                        alt={t(selectedPayment.labelKey as any)}
                        className="h-6 w-6 shrink-0 rounded-full bg-white object-contain p-1 dark:bg-[#0f0f0f]"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="truncate">{t(selectedPayment.labelKey as any)}</span>
                    </span>
                  ) : (
                    <span className="text-gray-500 dark:text-neutral-400">
                      {t('selectPaymentMethod') ?? 'Select payment method'}
                    </span>
                  )}
                  <span className="text-gray-500 dark:text-neutral-400">▾</span>
                </button>

                {paymentOpen ? (
                  <div
                    role="listbox"
                    className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-[#0f0f0f]"
                  >
                    {paymentOptions.map((p) => {
                      const active = p.key === form.paymentMethod
                      return (
                        <button
                          key={p.key}
                          type="button"
                          role="option"
                          aria-selected={active}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setForm((f) => ({ ...f, paymentMethod: p.key }))
                            setPaymentOpen(false)
                          }}
                          className={[
                            'flex w-full items-center gap-3 px-3 py-2 text-left text-sm',
                            active
                              ? 'bg-amber-50 text-gray-900 dark:bg-amber-500/10 dark:text-neutral-50'
                              : 'text-slate-800 hover:bg-slate-50 dark:text-neutral-100 dark:hover:bg-neutral-950',
                          ].join(' ')}
                        >
                          <img
                            src={p.logoSrc}
                            alt={t(p.labelKey as any)}
                            className="h-7 w-7 rounded-full bg-white object-contain p-1 dark:bg-[#0f0f0f]"
                            loading="lazy"
                            decoding="async"
                          />
                          <span className="min-w-0 truncate">{t(p.labelKey as any)}</span>
                        </button>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            </label>

            {needsPayerNumber(form.paymentMethod) && (() => {
              const error = payerTouched ? payerNumberError(form.paymentMethod, form.userPaymentMethodNumber, lang) : null
              return (
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">
                    {payerNumberLabel(form.paymentMethod, lang)} <span className="text-red-600 dark:text-red-400">*</span>
                  </span>
                  <input
                    type="text"
                    name="userPaymentMethodNumber"
                    inputMode={form.paymentMethod === 'binance' ? 'text' : 'tel'}
                    value={form.userPaymentMethodNumber}
                    onChange={(e) => setForm((f) => ({ ...f, userPaymentMethodNumber: e.target.value }))}
                    onBlur={() => setPayerTouched(true)}
                    placeholder={payerNumberPlaceholder(form.paymentMethod)}
                    aria-invalid={!!error}
                    className={`${inputClass} font-mono ${error ? 'border-red-400 dark:border-red-500/60' : ''}`}
                    required
                  />
                  <span className={`mt-1 block text-xs ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-neutral-400'}`}>
                    {error ?? payerNumberHint(form.paymentMethod, lang)}
                  </span>
                </label>
              )
            })()}

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">
                {t('transactionId')}{' '}
                <span className="font-normal text-gray-500 dark:text-neutral-400">
                  (Transaction ID or last 4 digits)
                </span>{' '}
                <span className="text-red-600 dark:text-red-400">*</span>
              </span>
              <input
                type="text"
                name="transactionId"
                value={form.transactionId}
                onChange={(e) => setForm((f) => ({ ...f, transactionId: e.target.value }))}
                className={inputClass}
                required
              />
              {transactionIdHint(form.paymentMethod, lang) && (
                <span className="mt-1 block text-xs text-gray-500 dark:text-neutral-400">{transactionIdHint(form.paymentMethod, lang)}</span>
              )}
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60 px-4 py-3 text-sm font-black text-neutral-950 shadow-lg shadow-amber-900/10 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 sm:w-full"
          >
            {submitting ? 'Submitting…' : t('postOrderSubmit')}
          </button>
        </form>
      )}
    </div>
  )
}
