"use client";

import { useEffect, useState, type FormEvent } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { MobilePhoneInput } from '@/components/MobilePhoneInput'
import { SuccessPage } from '@/components/SuccessPage'
import { ErrorPage } from '@/components/ErrorPage'
import { siteConfig } from '@/siteConfig'
import { GetServicesList, postOrderForm } from '@/services/serviceService'

const inputClass =
  'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'

const initial = {
  name: '',
  phone: '',
  email: '',
  transactionId: '',
  serviceId: '',
  serviceName: '',
  price: '',
  paymentMethod: '',
}

export default function PostOrderForm() {
  const { t } = useLanguage()
  const [form, setForm] = useState(initial)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [services, setServices] = useState<{ id: string; name: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
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
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      transactionId: form.transactionId.trim(),
      serviceId: form.serviceId.trim() || undefined,
      serviceName: form.serviceId.trim() ? undefined : form.serviceName.trim(),
      price: form.price.trim(),
      paymentMethod: form.paymentMethod.trim(),
    }
    try {
      setSubmitting(true)
      const order = await postOrderForm(payload)
      console.log('[PostOrderForm] created order:', order)
      setForm(initial)
      setSuccess(true)
      window.setTimeout(() => setSuccess(false), 3000)
    } catch {
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
    <main className="mx-auto max-w-2xl flex-1 px-4 pt-24 pb-8 sm:pt-10 sm:pb-12">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
          {t('postOrderFormTitle')}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          {t('postOrderFormSubtitle')}
        </p>
      </div>

      {success ? (
        <SuccessPage
          title="Order submitted successfully"
          message="We received your request. Our team will process it shortly."
          hint="This form will reset automatically in a few seconds."
        />
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
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6"
        >
          {formError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              {formError}
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
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
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
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
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
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

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
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
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('transactionId')}{' '}
                <span className="font-normal text-slate-500 dark:text-slate-400">
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
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
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
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
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
                        className="h-6 w-6 shrink-0 rounded-full bg-white object-contain p-1 dark:bg-slate-950"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="truncate">{t(selectedPayment.labelKey as any)}</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400">
                      {t('selectPaymentMethod') ?? 'Select payment method'}
                    </span>
                  )}
                  <span className="text-slate-500 dark:text-slate-400">▾</span>
                </button>

                {paymentOpen ? (
                  <div
                    role="listbox"
                    className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-950"
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
                              ? 'bg-emerald-50 text-slate-900 dark:bg-emerald-500/10 dark:text-slate-50'
                              : 'text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-900',
                          ].join(' ')}
                        >
                          <img
                            src={p.logoSrc}
                            alt={t(p.labelKey as any)}
                            className="h-7 w-7 rounded-full bg-white object-contain p-1 dark:bg-slate-900"
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
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 sm:w-auto sm:min-w-[12rem]"
          >
            {submitting ? 'Submitting…' : t('postOrderSubmit')}
          </button>
        </form>
      )}
    </main>
  )
}
