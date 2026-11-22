/**
 * Client-side copy of digital-access-backend/src/utils/paymentNumber.ts — the number the customer
 * paid FROM (Order.userPaymentMethodNumber). The API re-validates; keep both in sync.
 */
type Lang = 'en' | 'bn'

const MOBILE_WALLETS = ['bkash', 'nagad', 'rocket']

const LABELS: Record<string, { en: string; bn: string; placeholder: string }> = {
  bkash: { en: 'Your bKash number', bn: 'আপনার বিকাশ নম্বর', placeholder: '01XXXXXXXXX' },
  nagad: { en: 'Your Nagad number', bn: 'আপনার নগদ নম্বর', placeholder: '01XXXXXXXXX' },
  rocket: { en: 'Your Rocket number', bn: 'আপনার রকেট নম্বর', placeholder: '01XXXXXXXXX' },
  binance: { en: 'Your Binance Pay ID / UID', bn: 'আপনার বাইন্যান্স পে আইডি / UID', placeholder: 'e.g. 123456789' },
  bank_to_wallet: {
    en: 'Your bank name & account (last 4 digits)',
    bn: 'আপনার ব্যাংকের নাম ও অ্যাকাউন্ট (শেষ ৪ ডিজিট)',
    placeholder: 'e.g. City Bank ••1234',
  },
}

/** Methods whose payer field is free text rather than a phone number. */
export function payerInputMode(method: string): 'text' | 'tel' {
  const m = method.toLowerCase()
  return m === 'binance' || m === 'bank_to_wallet' ? 'text' : 'tel'
}

export function needsPayerNumber(method: string): boolean {
  return method.toLowerCase() in LABELS
}

export function payerNumberLabel(method: string, lang: Lang): string {
  return LABELS[method.toLowerCase()]?.[lang] ?? (lang === 'bn' ? 'পেমেন্ট নম্বর' : 'Payment number')
}

export function payerNumberPlaceholder(method: string): string {
  return LABELS[method.toLowerCase()]?.placeholder ?? ''
}

export function payerNumberHint(method: string, lang: Lang): string {
  if (method.toLowerCase() === 'bank_to_wallet') {
    return lang === 'bn' ? 'যে ব্যাংক অ্যাকাউন্ট থেকে টাকা পাঠিয়েছেন' : 'The bank account you sent the money from'
  }
  if (method.toLowerCase() === 'binance') {
    return lang === 'bn' ? 'যে বাইন্যান্স অ্যাকাউন্ট থেকে পেমেন্ট করেছেন' : 'The Binance account you paid from'
  }
  return lang === 'bn' ? 'যে নম্বর থেকে টাকা পাঠিয়েছেন' : 'The number you sent the money from'
}

function normalizeBdMobile(raw: string, allowRocketCheckDigit: boolean): string | null {
  let digits = raw.replace(/[\s\-().]/g, '')
  if (digits.startsWith('+')) digits = digits.slice(1)
  if (!/^\d+$/.test(digits)) return null
  if (digits.startsWith('880')) digits = digits.slice(2)
  if (/^01[3-9]\d{8}$/.test(digits)) return digits
  if (allowRocketCheckDigit && /^01[3-9]\d{9}$/.test(digits)) return digits
  return null
}

/** Returns an error message, or null when the value is valid (or not needed). */
export function payerNumberError(method: string, raw: string, lang: Lang): string | null {
  const m = method.toLowerCase()
  const value = raw.trim()
  if (!needsPayerNumber(m)) return null
  if (!value) return lang === 'bn' ? `${payerNumberLabel(m, 'bn')} দিন` : `${payerNumberLabel(m, 'en')} is required`
  if (MOBILE_WALLETS.includes(m)) {
    return normalizeBdMobile(value, m === 'rocket')
      ? null
      : lang === 'bn'
        ? 'সঠিক মোবাইল নম্বর দিন (যেমন 01XXXXXXXXX)'
        : 'Enter a valid mobile number (e.g. 01XXXXXXXXX)'
  }
  if (m === 'bank_to_wallet') {
    return value.length >= 3 && value.length <= 50
      ? null
      : lang === 'bn'
        ? 'ব্যাংকের নাম ও অ্যাকাউন্টের শেষ ৪ ডিজিট লিখুন (৩–৫০ অক্ষর)'
        : 'Enter your bank name and the last 4 digits of the account (3–50 characters)'
  }
  return /^[A-Za-z0-9]{4,30}$/.test(value)
    ? null
    : lang === 'bn'
      ? 'সঠিক বাইন্যান্স পে আইডি দিন (৪–৩০ অক্ষর/সংখ্যা)'
      : 'Enter a valid Binance Pay ID (4–30 letters or digits)'
}

/** Where the customer finds the transaction ID for the chosen method (shown under the field). */
export function transactionIdHint(method: string, lang: Lang): string | null {
  const m = method.toLowerCase()
  if (m === 'bank_to_wallet') {
    return lang === 'bn'
      ? 'ব্যাংক ট্রান্সফারের রেফারেন্স অথবা বিকাশ/নগদ/রকেটের কনফার্মেশন SMS-এর TrxID দিন'
      : 'Enter the bank transfer reference, or the TrxID from the bKash/Nagad/Rocket confirmation SMS'
  }
  if (m === 'binance') {
    return lang === 'bn'
      ? 'বাইন্যান্স অ্যাপের পেমেন্ট হিস্টোরি থেকে অর্ডার / ট্রানজেকশন আইডি দিন'
      : 'Find the order / transaction ID in your Binance Pay history'
  }
  if (MOBILE_WALLETS.includes(m)) {
    const name = { bkash: lang === 'bn' ? 'বিকাশ' : 'bKash', nagad: lang === 'bn' ? 'নগদ' : 'Nagad', rocket: lang === 'bn' ? 'রকেট' : 'Rocket' }[m]
    return lang === 'bn'
      ? `${name} থেকে আসা কনফার্মেশন SMS-এ TrxID পাবেন`
      : `You'll find the TrxID in the ${name} confirmation SMS`
  }
  return null
}
