/** Display names for the payment-method keys stored on orders (Order.paymentMethod). */
export const BANK_TO_WALLET = 'bank_to_wallet'

const LABELS: Record<string, { en: string; bn: string }> = {
  bkash: { en: 'bKash', bn: 'বিকাশ' },
  nagad: { en: 'Nagad', bn: 'নগদ' },
  rocket: { en: 'Rocket', bn: 'রকেট' },
  binance: { en: 'Binance', bn: 'বাইন্যান্স' },
  [BANK_TO_WALLET]: { en: 'Bank to bKash/Nagad/Rocket', bn: 'ব্যাংক থেকে বিকাশ/নগদ/রকেট' },
  bank: { en: 'Bank transfer', bn: 'ব্যাংক ট্রান্সফার' },
  cash: { en: 'Cash', bn: 'ক্যাশ' },
}

export function paymentMethodLabel(method: string, lang: 'en' | 'bn' = 'en'): string {
  const key = method.trim().toLowerCase()
  const hit = LABELS[key]
  if (hit) return hit[lang]
  return key ? key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ') : '—'
}
