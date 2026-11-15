"use client";

import { Mail, MessageCircle, Phone, MapPin } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { siteConfig, formatWhatsappLocalFromDigits } from '@/config/siteConfig'
import { Breadcrumb } from '@/components/Breadcrumb'
import { LEGAL_LAST_UPDATED, type LegalDocument, type LegalLanguage } from '@/content/legal'

type Props = {
  documents: Record<LegalLanguage, LegalDocument>
  /** English page label for the breadcrumb, e.g. "Privacy Policy" */
  breadcrumbLabel: string
}

function formatUpdated(language: LegalLanguage): string {
  return new Date(`${LEGAL_LAST_UPDATED}T00:00:00Z`).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** Renders a Terms / Privacy document in the visitor's selected language. */
export function LegalPage({ documents, breadcrumbLabel }: Props) {
  const { language } = useLanguage()
  const lang: LegalLanguage = language === 'bn' ? 'bn' : 'en'
  const doc = documents[lang]
  const { contact, billing } = siteConfig
  const whatsappLocal = formatWhatsappLocalFromDigits(contact.whatsappDigits)

  const contactRows = [
    { icon: Mail, label: lang === 'bn' ? 'ইমেইল' : 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { icon: Phone, label: lang === 'bn' ? 'ফোন' : 'Phone', value: contact.phoneDisplay, href: `tel:${contact.phoneTel.replace(/\s/g, '')}` },
    { icon: MessageCircle, label: lang === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp', value: whatsappLocal, href: `https://wa.me/${contact.whatsappDigits}`, external: true },
    { icon: MapPin, label: lang === 'bn' ? 'ঠিকানা' : 'Address', value: billing.addressLine },
  ]

  return (
    <div lang={lang} className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <Breadcrumb items={[{ label: breadcrumbLabel }]} />

      <header className="mb-10 border-b border-slate-200 pb-8 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{doc.title}</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {lang === 'bn' ? 'সর্বশেষ হালনাগাদ: ' : 'Last updated: '}
          <time dateTime={LEGAL_LAST_UPDATED}>{formatUpdated(lang)}</time>
        </p>
        <p className="mt-5 leading-relaxed text-slate-700 dark:text-slate-300">{doc.intro}</p>
      </header>

      <div className="space-y-9 text-slate-700 dark:text-slate-300">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">{section.heading}</h2>
            {section.paragraphs?.map((p) => (
              <p key={p} className="leading-relaxed [&+p]:mt-3">
                {p}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed marker:text-emerald-500">
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">{doc.contactHeading}</h2>
          <p className="leading-relaxed">{doc.contactIntro}</p>
          <dl className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 sm:grid-cols-2">
            {contactRows.map(({ icon: Icon, label, value, href, external }) => (
              <div key={label} className="flex min-w-0 items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden />
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</dt>
                  <dd className="break-all font-medium text-slate-900 dark:text-slate-100">
                    {href ? (
                      <a
                        href={href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="hover:text-emerald-600 hover:underline dark:hover:text-emerald-400"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  )
}
