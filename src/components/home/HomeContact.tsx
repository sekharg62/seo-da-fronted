"use client";

import type { ReactNode } from 'react';
import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { siteConfig, formatWhatsappLocalFromDigits } from '@/config/siteConfig';

const LABELS = {
  en: { email: 'Email', phone: 'Phone', whatsapp: 'WhatsApp', address: 'Address', chat: 'Chat on WhatsApp' },
  bn: { email: 'ইমেইল', phone: 'ফোন', whatsapp: 'হোয়াটসঅ্যাপ', address: 'ঠিকানা', chat: 'হোয়াটসঅ্যাপে চ্যাট করুন' },
} as const

type Item = { key: string; label: string; value: string; icon: ReactNode; href?: string; external?: boolean }

const iconCls = 'h-5 w-5 text-amber-700 dark:text-amber-400'

export function HomeContact() {
  const { t, language } = useLanguage()
  const L = LABELS[language === 'bn' ? 'bn' : 'en']
  const { contact, billing } = siteConfig
  const waHref = `https://wa.me/${contact.whatsappDigits}`

  const items: Item[] = [
    { key: 'email', label: L.email, value: contact.email, icon: <Mail className={iconCls} aria-hidden />, href: `mailto:${contact.email}` },
    { key: 'phone', label: L.phone, value: contact.phoneDisplay, icon: <Phone className={iconCls} aria-hidden />, href: `tel:${contact.phoneTel.replace(/\s/g, '')}` },
    { key: 'whatsapp', label: L.whatsapp, value: formatWhatsappLocalFromDigits(contact.whatsappDigits), icon: <MessageCircle className={iconCls} aria-hidden />, href: waHref, external: true },
    { key: 'address', label: L.address, value: billing.addressLine, icon: <MapPin className={iconCls} aria-hidden /> },
  ]

  return (
    <section
      id="contact"
      className="bg-white dark:bg-transparent"
    >
      <div className="mx-auto w-full max-w-[96rem] px-4 py-8 sm:px-6 md:py-10">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-neutral-50 md:text-2xl">
              {t('contactTitle')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">{t('contactSubtitle')}</p>
          </div>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber-400 px-5 py-2.5 text-sm font-bold text-neutral-950 shadow-lg shadow-amber-900/10 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-neutral-950 md:w-auto"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            {L.chat}
          </a>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 dark:border-neutral-800 dark:bg-neutral-900 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ key, label, value, icon, href, external }) => {
            const inner = (
              <>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-amber-50 dark:bg-amber-950/50">
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">{label}</p>
                  <p className="mt-0.5 break-words text-sm font-bold text-gray-900 dark:text-neutral-50">{value}</p>
                </div>
              </>
            )
            const cls = 'flex items-center gap-3 bg-white p-4 dark:bg-[#0f0f0f] sm:p-5'
            return href ? (
              <a
                key={key}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={`${cls} transition-colors hover:bg-amber-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500 dark:hover:bg-neutral-900`}
              >
                {inner}
              </a>
            ) : (
              <div key={key} className={cls}>
                {inner}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
