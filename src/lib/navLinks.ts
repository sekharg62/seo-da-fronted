/** Primary site navigation, shared by the desktop navbar and the mobile menu drawer. */
export const NAV_LINKS = [
  { href: '/', labelKey: 'footerLinkHome', match: (p: string) => p === '/' },
  { href: '/shop', labelKey: 'footerLinkShop', match: (p: string) => p.startsWith('/shop') || p.startsWith('/product/') },
  { href: '/blog', labelKey: 'footerLinkBlog', match: (p: string) => p.startsWith('/blog') },
] as const

export const LEGAL_LINKS = [
  { href: '/terms', labelKey: 'footerTerms' },
  { href: '/privacy', labelKey: 'footerPrivacy' },
] as const
