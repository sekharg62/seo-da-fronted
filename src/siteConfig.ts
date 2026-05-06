export function formatWhatsappLocalFromDigits(whatsappDigits: string): string {
  const d = whatsappDigits.replace(/\D/g, '')
  if (d.startsWith('880') && d.length >= 12) return `0${d.slice(3)}`
  return whatsappDigits
}

export const siteConfig = {
  websiteName: 'DigitalAccess DA',
  companyName: 'DigitalAccess DA',
  shortName: 'DigitalAccess DA',
  title: 'DigitalAccess DA | Premium Digital Subscriptions',
  description: 'Providing modern, premium digital services and fast access for our clients.',

  contact: {
    email: 'daccessbd@gmail.com',
    phoneDisplay: '+880 1521-585818',
    phoneTel: '+8801521585818',
    whatsappDigits: '8801521585818',
  },

  websiteUrl: 'https://digitalaccessda.com',

  billing: {
    tagline: 'Premium Digital Subscriptions',
    addressLine: 'Dhaka, Bangladesh',
  },

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
    facebook: 'https://facebook.com/digitalaccessda',
  },

  footerPaymentMethods: [
    { src: '/bikash.svg', altKey: 'paymentBkash' },
    { src: '/nagad.png', altKey: 'paymentNagad' },
    { src: '/rocket.webp', altKey: 'paymentRocket' },
    { src: '/Binance_Logo.svg', altKey: 'paymentBinance' },
  ],
} as const

export type SiteConfig = typeof siteConfig
