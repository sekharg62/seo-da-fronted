/**
 * Static site / company details — single place to edit branding, contact, and checkout payment numbers.
 * Import from components (e.g. Navbar, Footer, layout) instead of hardcoding.
 */

export function formatWhatsappLocalFromDigits(whatsappDigits: string): string {
  const d = whatsappDigits.replace(/\D/g, '')
  if (d.startsWith('880') && d.length >= 12) return `0${d.slice(3)}`
  return whatsappDigits
}

export const siteConfig = {
  /** Shown in header, footer, and logo alt text */
  websiteName: 'DigitalAccess BD',
  /** Copyright and legal-style name */
  companyName: 'DigitalAccess BD',

  contact: {
    email: 'daccessbd@gmail.com',
    /** Human-readable phone (footer, etc.) */
    phoneDisplay: '+880 1521-585818',
    /** Use in tel: links (digits / + as stored) */
    phoneTel: '+8801521585818',
    /** WhatsApp: digits only with country code, no + (for https://wa.me/…) */
    whatsappDigits: '8801521585818',
  },
  /** Printable bill / receipt header (ConfirmOrder) */
  billing: {
    tagline: 'Premium Digital Subscriptions',
    addressLine: 'Dhaka, Bangladesh',
  },

  /** Public site URL if you need it elsewhere */
  websiteUrl: 'https://digitalaccessda.com',

  /**
   * Receive-money numbers for checkout.
   */
  checkoutPayment: {
    bkash: {
      accountNumber: '01521585818',
      instructionKey: 'instructionsBkash',
      logoSrc: '/bikash.svg',
    },
    nagad: {
      accountNumber: '01751311438',
      instructionKey: 'instructionsNagad',
      logoSrc: '/nagad.png',
    },
    rocket: {
      accountNumber: '01751311438',
      instructionKey: 'instructionsRocket',
      logoSrc: '/rocket.webp',
    },
    binance: {
      accountNumber: '',
      instructionKey: 'instructionsBinance',
      logoSrc: '/Binance_Logo.svg',
    },
  },

  social: {
    instagram: 'https://www.instagram.com/digitalaccessda/',
    messenger: 'https://m.me/digitalaccessda',
    youtube: 'https://www.youtube.com/@digitalaccessda',
    tiktok: 'https://www.tiktok.com/@digitalaccessda',
  },

  /** Credit line in footer */
  technologyPartner: {
    name: 'NodeCraft',
    url: 'https://node-craft-sekhar.vercel.app/',
  },

  footerPaymentMethods: [
    { src: '/bikash.svg', altKey: 'paymentBkash' },
    { src: '/nagad.png', altKey: 'paymentNagad' },
    { src: '/rocket.webp', altKey: 'paymentRocket' },
    { src: '/Binance_Logo.svg', altKey: 'paymentBinance' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
