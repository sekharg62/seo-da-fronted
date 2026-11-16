"use client"

import { FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'
import { siteConfig, formatWhatsappLocalFromDigits } from '@/config/siteConfig'

const METHOD_LABEL: Record<string, { en: string; bn: string }> = {
  bkash: { en: 'bKash number', bn: 'বিকাশ নম্বর' },
  nagad: { en: 'Nagad number', bn: 'নগদ নম্বর' },
  rocket: { en: 'Rocket number', bn: 'রকেট নম্বর' },
  binance: { en: 'Binance Pay ID', bn: 'বাইন্যান্স পে আইডি' },
}

type Props = {
  orderNo?: string | null
  paymentMethod: string
  /** Number the customer paid from (Order.userPaymentMethodNumber) */
  payerNumber?: string | null
  className?: string
}

/**
 * Small box on the order-success screen: shows the order ID + paid-from number and a button that
 * opens WhatsApp (siteConfig.contact.whatsappDigits) with that same short message prefilled.
 */
export function WhatsAppOrderBox({ orderNo, paymentMethod, payerNumber, className = '' }: Props) {
  const { language } = useLanguage()
  const bn = language === 'bn'
  const method = paymentMethod.toLowerCase()
  const numberLabel = METHOD_LABEL[method] ?? { en: `${paymentMethod} number`, bn: `${paymentMethod} নম্বর` }

  // The shop reads this, so it is always in English
  const message = [
    'Hi! I have created an order.',
    orderNo ? `Order ID: ${orderNo}` : null,
    payerNumber ? `${numberLabel.en}: ${payerNumber}` : null,
  ]
    .filter(Boolean)
    .join('\n')
  const href = `https://wa.me/${siteConfig.contact.whatsappDigits.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

  return (
    <div className={`rounded-xl border border-[#25D366]/40 bg-[#25D366]/5 p-4 text-left ${className}`}>
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
        <FaWhatsapp className="h-5 w-5 shrink-0 text-[#25D366]" aria-hidden />
        {bn ? 'হোয়াটসঅ্যাপে আমাদের জানান' : 'Let us know on WhatsApp'}
      </p>

      <dl className="mt-3 space-y-1.5 text-sm">
        {orderNo && (
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500 dark:text-slate-400">{bn ? 'অর্ডার আইডি' : 'Order ID'}</dt>
            <dd className="font-mono font-semibold text-slate-900 dark:text-slate-100">{orderNo}</dd>
          </div>
        )}
        {payerNumber && (
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500 dark:text-slate-400">{bn ? numberLabel.bn : numberLabel.en}</dt>
            <dd className="font-mono font-semibold text-slate-900 dark:text-slate-100">{payerNumber}</dd>
          </div>
        )}
      </dl>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1ebe5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      >
        <FaWhatsapp className="h-5 w-5" aria-hidden />
        {bn ? 'হোয়াটসঅ্যাপে পাঠান' : 'Send on WhatsApp'}
      </a>
      <p className="mt-1.5 text-center text-xs text-slate-500 dark:text-slate-400">
        {formatWhatsappLocalFromDigits(siteConfig.contact.whatsappDigits)}
      </p>
    </div>
  )
}
