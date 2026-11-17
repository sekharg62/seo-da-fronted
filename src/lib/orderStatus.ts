import type { OrderStatus } from '@/services/trackService'

type Lang = 'en' | 'bn'

export const ORDER_STATUS: Record<OrderStatus, { en: string; bn: string; hintEn: string; hintBn: string; tone: string }> = {
  PENDING: {
    en: 'Pending',
    bn: 'অপেক্ষমাণ',
    hintEn: 'We received your order and are verifying the payment.',
    hintBn: 'অর্ডার পেয়েছি, পেমেন্ট যাচাই করা হচ্ছে।',
    tone: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  },
  PROCESSING: {
    en: 'Processing',
    bn: 'প্রসেসিং',
    hintEn: 'Payment verified — we are preparing your access.',
    hintBn: 'পেমেন্ট যাচাই হয়েছে — আপনার অ্যাক্সেস প্রস্তুত করা হচ্ছে।',
    tone: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300',
  },
  COMPLETED: {
    en: 'Completed',
    bn: 'সম্পন্ন',
    hintEn: 'Delivered. Check your WhatsApp / email for the access details.',
    hintBn: 'ডেলিভারি সম্পন্ন। অ্যাক্সেসের তথ্য হোয়াটসঅ্যাপ / ইমেইলে দেখুন।',
    tone: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  },
  CANCELLED: {
    en: 'Cancelled',
    bn: 'বাতিল',
    hintEn: 'This order was cancelled. Contact us on WhatsApp if this is unexpected.',
    hintBn: 'অর্ডারটি বাতিল হয়েছে। প্রশ্ন থাকলে হোয়াটসঅ্যাপে যোগাযোগ করুন।',
    tone: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
  },
  REFUNDED: {
    en: 'Refunded',
    bn: 'রিফান্ড হয়েছে',
    hintEn: 'The payment for this order was refunded.',
    hintBn: 'এই অর্ডারের পেমেন্ট ফেরত দেওয়া হয়েছে।',
    tone: 'bg-slate-200 text-slate-700 dark:bg-neutral-700 dark:text-neutral-200',
  },
}

/** Progress steps shown for active orders */
export const STATUS_STEPS: OrderStatus[] = ['PENDING', 'PROCESSING', 'COMPLETED']

export function statusLabel(status: OrderStatus, lang: Lang): string {
  return ORDER_STATUS[status]?.[lang] ?? status
}
