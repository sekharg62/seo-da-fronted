"use client";

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa'
import { SiMessenger } from 'react-icons/si'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { siteConfig } from '@/config/siteConfig'

function sectionHeading(text: string) {
  return (
    <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-200">
      {text}
    </p>
  )
}

function PaymentMethodLogo({
  src,
  alt,
  fallbackLabel,
}: {
  src: string
  alt: string
  fallbackLabel: string
}) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span className="inline-flex h-8 min-w-18 items-center justify-center rounded-md border border-slate-200 bg-slate-100/90 px-2 text-[10px] font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200">
        {fallbackLabel}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className="h-8 w-auto max-w-22 object-contain opacity-90 dark:opacity-85"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

export default function Footer() {
  const { t } = useLanguage()
  const { theme } = useTheme()

  /** Three columns, balanced lengths — reads top-to-bottom per column like a newspaper. */
  const exploreColumns: { href: string; label: string }[][] = [
    [
      { href: '/', label: t('footerLinkHome') },
      { href: '/checkout', label: t('checkout') },
      { href: '/post-order', label: t('footerLinkPostOrder') },
    ],
    [
      { href: '/shop', label: t('footerLinkShop') },
      { href: '/blog', label: t('footerLinkBlog') },
    ],
    [
      { href: '/terms', label: t('footerTerms') },
      { href: '/privacy', label: t('footerPrivacy') },
    ],
  ]

  const { websiteName, companyName, contact, social } = siteConfig
  const mailto = `mailto:${contact.email}`
  const telHref = `tel:${contact.phoneTel.replace(/\s/g, '')}`
  const email = contact.email
  const phoneLabel = contact.phoneDisplay

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-emerald-200/90 bg-gradient-to-b from-emerald-50/95 via-teal-50/35 to-slate-100 text-slate-800 dark:border-emerald-500/25 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/25 dark:text-slate-200 max-md:pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
      {/* Light: richer emerald + teal wash; dark: subtle single glow */}
      <div
        className="pointer-events-none absolute inset-0 dark:hidden"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(ellipse 110% 75% at 50% -35%, rgba(16, 185, 129, 0.22), transparent 52%), radial-gradient(ellipse 80% 55% at 100% 100%, rgba(20, 184, 166, 0.14), transparent 50%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-60 dark:block"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(ellipse 120% 80% at 50% -40%, rgba(16, 185, 129, 0.14), transparent 55%)',
        }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/25 blur-3xl dark:bg-emerald-500/10" aria-hidden />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-teal-300/20 blur-3xl dark:bg-sky-500/5" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Row 1: brand | tagline | payments */}
        <div className="grid gap-10 lg:grid-cols-3 lg:items-start lg:gap-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 hover:opacity-90 transition">
              <img
                src={theme === 'dark' ? '/White.png' : '/Blue.png'}
                alt={websiteName}
                className="h-10 w-10"
              />
              <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {websiteName}
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              © {new Date().getFullYear()} {companyName}. {t('allRightsReserved')}
            </p>
          </div>

          <div className="lg:px-2">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 lg:mx-auto lg:max-w-sm lg:text-center">
              {t('footerTagline')}
            </p>
          </div>

          <div className="lg:text-right">
            {sectionHeading(t('footerPaymentsTitle'))}
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              {siteConfig.footerPaymentMethods.map(({ src, altKey }) => (
                <PaymentMethodLogo key={src} src={src} alt={t(altKey)} fallbackLabel={t(altKey)} />
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: pages (balanced columns) | contact + social */}
        <div className="mt-10 grid gap-10 border-t border-emerald-200/70 pt-10 dark:border-slate-700/70 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-5">
            {sectionHeading(t('footerExploreTitle'))}
            <nav
              className="grid grid-cols-2 gap-x-8 sm:grid-cols-3 sm:gap-x-10"
              aria-label={t('footerExploreTitle')}
            >
              {exploreColumns.map((col, colIndex) => (
                <ul key={colIndex} className="min-w-0 space-y-2.5 text-sm">
                  {col.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="inline-block text-slate-600 transition-colors hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-8 lg:col-span-7 lg:justify-end lg:gap-14">
            <div className="min-w-0 sm:min-w-60 lg:text-right">
              {sectionHeading(t('footerContactTitle'))}
              <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300 lg:items-end">
                <a
                  href={mailto}
                  title={email}
                  className="inline-flex max-w-full items-start gap-2.5 text-left transition-colors hover:text-slate-900 dark:hover:text-slate-50 sm:items-center"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 opacity-80 sm:mt-0" aria-hidden />
                  <span className="min-w-0 sm:whitespace-nowrap">{email}</span>
                </a>
                <a
                  href={telHref}
                  className="inline-flex items-center gap-2.5 whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-slate-50"
                >
                  <Phone className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  {phoneLabel}
                </a>
              </div>
            </div>

            <div className="shrink-0 sm:border-l sm:border-slate-200/80 sm:pl-8 dark:sm:border-slate-600/60 lg:pl-10">
              {sectionHeading(t('footerSocialTitle'))}
              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-emerald-500/15 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400"
                  aria-label={t('footerInstagramLabel')}
                >
                  <FaInstagram className="h-7 w-7" aria-hidden />
                </a>
                <a
                  href={social.messenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-emerald-500/15 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400"
                  aria-label={t('footerMessengerLabel')}
                >
                  <SiMessenger className="h-7 w-7" aria-hidden />
                </a>
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-emerald-500/15 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400"
                  aria-label={t('footerYoutubeLabel')}
                >
                  <FaYoutube className="h-7 w-7" aria-hidden />
                </a>
                <a
                  href={social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-emerald-500/15 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400"
                  aria-label={t('footerTiktokLabel')}
                >
                  <FaTiktok className="h-7 w-7" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 border-t border-emerald-200/50 pt-3 text-center text-[10px] leading-relaxed text-slate-500 dark:border-slate-700/50 dark:text-slate-400">
          <span>{t('footerTechnologyPartnerLabel')}</span>{' '}
          <a
            href={siteConfig.technologyPartner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 underline-offset-2 transition-colors hover:text-emerald-700 hover:underline dark:text-slate-300 dark:hover:text-emerald-400"
          >
            {siteConfig.technologyPartner.name}
          </a>
        </p>
      </div>
    </footer>
  );
}
