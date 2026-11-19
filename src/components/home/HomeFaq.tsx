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
      className="bg-white dark:bg-black"
    >
      <div className="mx-auto grid w-full max-w-[96rem] gap-6 px-4 py-8 sm:px-6 md:py-10 lg:grid-cols-[1fr_2fr] lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-neutral-50 md:text-2xl">
            {t('faqTitle')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            {t('faqSubtitle')}
          </p>
        </div>

        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-[#0f0f0f]">
          {faqItems.map((item, index) => {
            const isOpen = openFaqIndex === index
            const q = language === 'bn' ? item.qBn : item.qEn
            const a = language === 'bn' ? item.aBn : item.aEn
            return (
              <div key={index}>
                <button
                  type="button"
                  id={`faq-q-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${index}`}
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500 sm:px-5 sm:text-base ${
                    isOpen
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-gray-900 hover:bg-slate-50 dark:text-neutral-100 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  <span>{q}</span>
                  <ChevronDown
                    aria-hidden
                    className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-700' : 'text-slate-400'
                    }`}
                  />
                </button>
                <div
                  id={`faq-a-${index}`}
                  role="region"
                  aria-labelledby={`faq-q-${index}`}
                  className={`grid transition-all duration-200 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-sm leading-relaxed text-slate-600 dark:text-neutral-300 sm:px-5 sm:text-base">
                      {a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
