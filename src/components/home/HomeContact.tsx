"use client";

import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function HomeContact() {
  const { t } = useLanguage()

  return (
    <section
      id="contact"
      className="border-t border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/80"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-1">
            {t('contactTitle' as any)}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('contactSubtitle' as any)}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <a
            href={`mailto:${t('contactEmail' as any)}`}
            className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 hover:border-emerald-500/50 transition"
          >
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Email
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100 break-all">
                {t('contactEmail' as any)}
              </p>
            </div>
          </a>
          <a
            href={`tel:${t('contactPhone' as any).replace(/\s/g, '')}`}
            className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 hover:border-emerald-500/50 transition"
          >
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Phone
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {t('contactPhone' as any)}
              </p>
            </div>
          </a>
          <a
            href={`https://wa.me/88${t('contactWhatsapp' as any).replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 hover:border-emerald-500/50 transition"
          >
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <MessageCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                WhatsApp
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {t('contactWhatsapp' as any)}
              </p>
            </div>
          </a>
          <div className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4">
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Address
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {t('contactAddress' as any)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
