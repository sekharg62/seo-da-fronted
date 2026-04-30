"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export type FaqItem = {
  qEn: string
  qBn: string
  aEn: string
  aBn: string
}

export const faqItems: FaqItem[] = [
  {
    qEn: 'How do I get a subscription?',
    qBn: 'সাবস্ক্রিপশন কীভাবে পাব?',
    aEn: 'Visit our Shop page, choose your desired service (Netflix, YouTube Premium, etc.), and click Buy Now. We will contact you with account details after payment.',
    aBn: 'আমাদের Shop পেজে যান, পছন্দের সেবা (Netflix, YouTube Premium ইত্যাদি) বেছে নিন এবং Buy Now ক্লিক করুন। পেমেন্টের পর আমরা অ্যাকাউন্ট বিস্তারিত দিয়ে যোগাযোগ করব।',
  },
  {
    qEn: 'What payment methods do you accept?',
    qBn: 'কোন পেমেন্ট পদ্ধতি গ্রহণ করা হয়?',
    aEn: 'We accept bKash, Nagad, Rocket, and bank transfer. Payment details will be shared when you place an order.',
    aBn: 'আমরা bKash, Nagad, Rocket এবং ব্যাংক ট্রান্সফার গ্রহণ করি। অর্ডার দিলে পেমেন্ট বিস্তারিত শেয়ার করা হবে।',
  },
  {
    qEn: 'How long does it take to get my account?',
    qBn: 'অ্যাকাউন্ট পেতে কত সময় লাগে?',
    aEn: 'Usually within 24 hours after payment confirmation. For urgent requests, contact us directly.',
    aBn: 'পেমেন্ট নিশ্চিত হওয়ার পর সাধারণত ২৪ ঘণ্টার মধ্যে। জরুরি অনুরোধের জন্য সরাসরি যোগাযোগ করুন।',
  },
  {
    qEn: 'Can I share an account with family?',
    qBn: 'পরিবারের সাথে অ্যাকাউন্ট শেয়ার করা যাবে?',
    aEn: 'Yes. Our shared plans are designed for family use. You can manage who has access from the dashboard.',
    aBn: 'হ্যাঁ। আমাদের শেয়ার্ড প্ল্যান পরিবারের ব্যবহারের জন্য। ড্যাশবোর্ড থেকে কে অ্যাক্সেস পাবে তা ম্যানেজ করতে পারবেন।',
  },
  {
    qEn: 'What if my subscription expires?',
    qBn: 'সাবস্ক্রিপশন মেয়াদ শেষ হলে কী হবে?',
    aEn: 'You will get a reminder before expiry. You can renew from the dashboard or contact us to extend your plan.',
    aBn: 'মেয়াদ শেষ হওয়ার আগে রিমাইন্ডার পাবেন। ড্যাশবোর্ড থেকে রিনিউ করতে পারবেন বা প্ল্যান বাড়াতে আমাদের সাথে যোগাযোগ করুন।',
  },
]

export function HomeFaq() {
  const { t, language } = useLanguage()
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  return (
    <section
      id="faq"
      className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50"
    >
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-1">
            {t('faqTitle' as any)}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('faqSubtitle' as any)}
          </p>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index
              const q = language === 'bn' ? item.qBn : item.qEn
              const a = language === 'bn' ? item.aBn : item.aEn
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <span>{q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3 pt-0">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {a}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
