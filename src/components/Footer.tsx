"use client";

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa'
import { SiMessenger } from 'react-icons/si'
import { useLanguage } from '@/context/LanguageContext'
import { siteConfig } from '@/config/siteConfig'

function sectionHeading(text: string) {
  return (
    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
      {text}
    </h3>
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
      <span className="inline-flex h-7 min-w-18 items-center justify-center rounded-md border border-gray-200 bg-slate-100/90 px-2 text-[10px] font-medium text-slate-700 dark:border-neutral-600 dark:bg-neutral-800/70 dark:text-neutral-200">
        {fallbackLabel}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className="h-6 w-auto max-w-20 object-contain"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

export default function Footer() {
  const { t } = useLanguage()

  const exploreLinks: { href: string; label: string }[] = [
    { href: '/', label: t('footerLinkHome') },
    { href: '/shop', label: t('footerLinkShop') },
    { href: '/blog', label: t('footerLinkBlog') },
    { href: '/create-order', label: t('footerCreateOrder') },
    { href: '/track-order', label: t('footerTrackOrder') },
  ]

  const { websiteName, companyName, contact, social } = siteConfig
  const socials = [
    { href: social.instagram, label: t('footerInstagramLabel'), Icon: FaInstagram, hover: 'hover:bg-[#E4405F] hover:border-[#E4405F]' },
    { href: social.messenger, label: t('footerMessengerLabel'), Icon: SiMessenger, hover: 'hover:bg-[#0084FF] hover:border-[#0084FF]' },
    { href: social.youtube, label: t('footerYoutubeLabel'), Icon: FaYoutube, hover: 'hover:bg-[#FF0000] hover:border-[#FF0000]' },
    { href: social.tiktok, label: t('footerTiktokLabel'), Icon: FaTiktok, hover: 'hover:bg-black hover:border-black' },
  ]
  const linkCls =
    'inline-block text-slate-600 transition-colors hover:text-amber-600 dark:text-neutral-300 dark:hover:text-amber-400'

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white text-slate-800 dark:border-neutral-800 dark:bg-black dark:text-neutral-200 max-md:pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
      <div className="mx-auto w-full max-w-[96rem] px-4 pt-12 sm:px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.5fr_1fr_1.2fr_1.2fr]">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="mb-4 inline-flex items-center gap-2.5 transition-opacity hover:opacity-90">
              <img src="/Blue.png" alt={websiteName} className="h-9 w-9 dark:hidden" />
              <img src="/White.png" alt="" aria-hidden className="hidden h-9 w-9 dark:block" />
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">{websiteName}</span>
            </Link>
            <p className="mb-5 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-neutral-400">
              {t('footerTagline')}
            </p>
            <div className="flex items-center gap-2.5">
              {socials.map(({ href, label, Icon, hover }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-slate-700 transition-colors hover:text-white dark:border-neutral-700 dark:text-neutral-200 ${hover}`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            {sectionHeading(t('footerExploreTitle'))}
            <ul className="space-y-3 text-sm font-medium">
              {exploreLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={linkCls}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            {sectionHeading(t('footerContactTitle'))}
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a href={`mailto:${contact.email}`} className={`${linkCls} inline-flex items-start gap-2.5 break-all`}>
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${contact.phoneTel.replace(/\s/g, '')}`} className={`${linkCls} inline-flex items-center gap-2.5 whitespace-nowrap`}>
                  <Phone className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
                  {contact.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>

          {/* Payments */}
          <div className="col-span-2 lg:col-span-1">
            {sectionHeading(t('footerPaymentsTitle'))}
            <div className="flex flex-wrap items-center gap-2">
              {siteConfig.footerPaymentMethods.map(({ src, altKey }) => (
                <span
                  key={src}
                  className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-2.5 dark:border-neutral-700"
                >
                  <PaymentMethodLogo src={src} alt={t(altKey)} fallbackLabel={t(altKey)} />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-200 py-5 text-xs text-gray-500 dark:border-neutral-800 dark:text-neutral-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {companyName}. {t('allRightsReserved')}
          </p>
          <nav className="flex items-center gap-4" aria-label="Legal">
            <Link href="/terms" className="transition-colors hover:text-amber-600 dark:hover:text-amber-400">{t('footerTerms')}</Link>
            <Link href="/privacy" className="transition-colors hover:text-amber-600 dark:hover:text-amber-400">{t('footerPrivacy')}</Link>
          </nav>
          <p>
            {t('footerTechnologyPartnerLabel')}{' '}
            <a
              href={siteConfig.technologyPartner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-700 underline-offset-2 hover:text-amber-600 hover:underline dark:text-neutral-300 dark:hover:text-amber-400"
            >
              {siteConfig.technologyPartner.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
