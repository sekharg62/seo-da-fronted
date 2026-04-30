"use client"

import { useState, type ReactNode } from 'react'
import { MessageCircle, Phone, X } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { SiMessenger } from 'react-icons/si'
import { useTheme } from '@/context/ThemeContext'
import { siteConfig } from '@/siteConfig'

export type FloatingContactWidgetProps = {
  /** Tel: full value e.g. `tel:+8801…` (defaults to `siteConfig.contact.phoneTel`) */
  phoneNumber?: string
  /** Digits with country code, no +, or full `https://wa.me/…` URL (defaults to `siteConfig.contact.whatsappDigits`) */
  whatsappNumber?: string
  /** Facebook Messenger page URL (defaults to `siteConfig.social.messenger`) */
  messengerUrl?: string
  /** Optional class for the container */
  className?: string
}

const defaultPhone = `tel:${siteConfig.contact.phoneTel.replace(/\s/g, '')}`
const defaultWhatsApp = siteConfig.contact.whatsappDigits
const defaultMessenger = siteConfig.social.messenger

export function FloatingContactWidget({
  phoneNumber = defaultPhone,
  whatsappNumber = defaultWhatsApp,
  messengerUrl = defaultMessenger,
  className = '',
}: FloatingContactWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const telHref = phoneNumber.startsWith('tel:') ? phoneNumber : `tel:${phoneNumber.replace(/\s/g, '')}`
  const waHref = whatsappNumber.startsWith('http') ? whatsappNumber : `https://wa.me/${whatsappNumber.replace(/\s/g, '')}`

  const buttonBase =
    'flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const triggerButton = `${buttonBase} ${
    isDark
      ? 'bg-emerald-500 text-white hover:bg-emerald-400 focus:ring-emerald-400 ring-offset-slate-950'
      : 'bg-emerald-500 text-white hover:bg-emerald-400 focus:ring-emerald-400 ring-offset-white'
  }`

  const phoneButton = `${buttonBase} ${
    isDark
      ? 'bg-emerald-500 text-white hover:bg-emerald-400 focus:ring-emerald-400 ring-offset-slate-950'
      : 'bg-emerald-500 text-white hover:bg-emerald-400 focus:ring-emerald-400 ring-offset-white'
  }`

  const whatsappButton = `${buttonBase} ${
    isDark
      ? 'bg-[#25D366] text-white hover:bg-[#20BD5A] focus:ring-[#25D366] ring-offset-slate-950'
      : 'bg-[#25D366] text-white hover:bg-[#20BD5A] focus:ring-[#25D366] ring-offset-white'
  }`

  const messengerButton = `${buttonBase} ${
    isDark
      ? 'bg-[#0084FF] text-white hover:bg-[#0073E6] focus:ring-[#0084FF] ring-offset-slate-950'
      : 'bg-[#0084FF] text-white hover:bg-[#0073E6] focus:ring-[#0084FF] ring-offset-white'
  }`

  const closeButton = `${buttonBase} ${
    isDark
      ? 'bg-violet-600 text-white hover:bg-violet-500 focus:ring-violet-500 ring-offset-slate-950'
      : 'bg-violet-600 text-white hover:bg-violet-500 focus:ring-violet-500 ring-offset-white'
  }`

  const items: Array<
    | {
        type: 'link'
        href: string
        className: string
        label: string
        ariaLabel: string
        icon: ReactNode
        external?: boolean
      }
    | {
        type: 'button'
        onClick: () => void
        className: string
        label: string
        ariaLabel: string
        icon: ReactNode
      }
  > = [
    {
      type: 'link',
      href: telHref,
      className: phoneButton,
      label: 'Call',
      ariaLabel: 'Call us',
      icon: <Phone className="h-5 w-5" />,
      external: false,
    },
    {
      type: 'link',
      href: waHref,
      className: whatsappButton,
      label: 'WhatsApp',
      ariaLabel: 'WhatsApp',
      icon: <FaWhatsapp className="h-6 w-6" />,
      external: true,
    },
    {
      type: 'link',
      href: messengerUrl,
      className: messengerButton,
      label: 'Messenger',
      ariaLabel: 'Messenger',
      icon: <SiMessenger className="h-5 w-5" />,
      external: true,
    },
    {
      type: 'button',
      onClick: () => setIsOpen(false),
      className: closeButton,
      label: 'Close',
      ariaLabel: 'Close contact menu',
      icon: <X className="h-5 w-5" />,
    },
  ]

  return (
    <div
      className={`fixed right-6 z-50 flex flex-col items-center gap-2 bottom-6 max-md:bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))] ${className}`}
      aria-label="Contact options"
    >
      {isOpen ? (
        <>
          {items.map((item, index) => {
            const content = (
              <>
                {item.icon}
                <span
                  className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded px-2 py-1 text-xs font-medium text-white bg-slate-800 shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-slate-200 dark:text-slate-900"
                  style={{ transitionDelay: '0.1s' }}
                >
                  {item.label}
                </span>
              </>
            )
            const wrapperClass = `group relative animate-floating-widget-in ${item.className}`
            const style = { animationDelay: `${index * 0.06}s` }

            if (item.type === 'link') {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={wrapperClass}
                  style={style}
                  aria-label={item.ariaLabel}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  {content}
                </a>
              )
            }
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className={wrapperClass}
                style={style}
                aria-label={item.ariaLabel}
              >
                {content}
              </button>
            )
          })}
        </>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={triggerButton}
          aria-label="Open contact options"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
