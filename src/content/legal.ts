import { siteConfig } from '@/config/siteConfig'

/**
 * Terms & Privacy content in English and Bangla.
 * Business details (name, email, phone, WhatsApp) come from siteConfig — never hardcode them here.
 * When you change the wording, bump LEGAL_LAST_UPDATED (also used by the sitemap).
 */
export const LEGAL_LAST_UPDATED = '2026-11-15'

export type LegalLanguage = 'en' | 'bn'

export type LegalSection = {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
}

export type LegalDocument = {
  title: string
  intro: string
  sections: LegalSection[]
  /** Heading + lead-in for the contact block rendered at the end of the page */
  contactHeading: string
  contactIntro: string
}

const name = siteConfig.websiteName

export const privacyPolicy: Record<LegalLanguage, LegalDocument> = {
  en: {
    title: 'Privacy Policy',
    intro: `This Privacy Policy explains what information ${name} collects when you visit our website or buy a digital subscription from us, how we use it, and the choices you have.`,
    sections: [
      {
        heading: '1. Information We Collect',
        bullets: [
          'Order details you give us: full name, phone number, WhatsApp number, email address and (optionally) your address and order notes.',
          'Payment details needed to verify your order: payment method (bKash, Nagad, Rocket, Binance) and the transaction ID. We never ask for or store your PIN, password or card number.',
          'Account details we deliver to you for the subscription you purchased, so we can provide support and renewals.',
          'Technical data such as IP address, browser/device type and pages visited, collected through cookies and analytics tools (Google Analytics / Google Tag Manager).',
          'Your preferences stored on your own device (cart, language and theme) using your browser’s local storage.',
        ],
      },
      {
        heading: '2. How We Use Your Information',
        bullets: [
          'To process, verify and deliver your order.',
          'To contact you about your order, renewals and support via phone, WhatsApp or email.',
          'To prevent fraud and misuse of our services.',
          'To understand how our website is used and improve it.',
          'To comply with applicable laws of Bangladesh.',
        ],
      },
      {
        heading: '3. Sharing of Information',
        paragraphs: [
          'We do not sell or rent your personal information. We share it only with service providers that help us run the website and process orders (for example hosting, analytics and payment providers), and only as much as they need, or when required by law.',
        ],
      },
      {
        heading: '4. Cookies',
        paragraphs: [
          'We use cookies and similar technologies to keep the site working and to measure traffic. You can block or delete cookies in your browser settings; some features (such as your saved cart) may then stop working.',
        ],
      },
      {
        heading: '5. Data Retention & Security',
        paragraphs: [
          'We keep order records for as long as needed to provide the service, handle support and renewals, and meet legal or accounting requirements. We use reasonable technical and organisational measures to protect your data, but no method of transmission over the internet or electronic storage is 100% secure.',
        ],
      },
      {
        heading: '6. Your Rights',
        paragraphs: [
          'You can ask us to access, correct or delete the personal information we hold about you, subject to any records we must keep by law. Contact us using the details below.',
        ],
      },
      {
        heading: '7. Changes to This Policy',
        paragraphs: [
          'We may update this policy from time to time. The “Last updated” date at the top of this page shows when it was last changed.',
        ],
      },
    ],
    contactHeading: '8. Contact Us',
    contactIntro: 'If you have any questions about this Privacy Policy or your data, contact us:',
  },
  bn: {
    title: 'গোপনীয়তা নীতি',
    intro: `আপনি যখন আমাদের ওয়েবসাইট ভিজিট করেন বা ${name} থেকে কোনো ডিজিটাল সাবস্ক্রিপশন কেনেন, তখন আমরা কী তথ্য সংগ্রহ করি, কীভাবে তা ব্যবহার করি এবং আপনার কী কী অধিকার রয়েছে — এই নীতিতে তা ব্যাখ্যা করা হয়েছে।`,
    sections: [
      {
        heading: '১. আমরা যে তথ্য সংগ্রহ করি',
        bullets: [
          'অর্ডারের জন্য আপনার দেওয়া তথ্য: পুরো নাম, ফোন নম্বর, হোয়াটসঅ্যাপ নম্বর, ইমেইল এবং (ঐচ্ছিক) ঠিকানা ও অর্ডার নোট।',
          'অর্ডার যাচাইয়ের জন্য প্রয়োজনীয় পেমেন্ট তথ্য: পেমেন্ট মাধ্যম (বিকাশ, নগদ, রকেট, বাইন্যান্স) ও ট্রানজেকশন আইডি। আমরা কখনোই আপনার পিন, পাসওয়ার্ড বা কার্ড নম্বর চাই না বা সংরক্ষণ করি না।',
          'আপনার কেনা সাবস্ক্রিপশনের যে অ্যাকাউন্ট তথ্য আমরা আপনাকে দিই — সাপোর্ট ও রিনিউয়ালের জন্য।',
          'কুকি ও অ্যানালিটিক্স টুলের (Google Analytics / Google Tag Manager) মাধ্যমে আইপি অ্যাড্রেস, ব্রাউজার/ডিভাইসের ধরন ও ভিজিট করা পেজের মতো টেকনিক্যাল তথ্য।',
          'আপনার ডিভাইসের ব্রাউজার স্টোরেজে সংরক্ষিত পছন্দসমূহ (কার্ট, ভাষা ও থিম)।',
        ],
      },
      {
        heading: '২. আমরা তথ্য যেভাবে ব্যবহার করি',
        bullets: [
          'আপনার অর্ডার প্রসেস, যাচাই ও ডেলিভারি করতে।',
          'অর্ডার, রিনিউয়াল ও সাপোর্ট বিষয়ে ফোন, হোয়াটসঅ্যাপ বা ইমেইলে যোগাযোগ করতে।',
          'প্রতারণা ও সেবার অপব্যবহার রোধ করতে।',
          'ওয়েবসাইট কীভাবে ব্যবহৃত হচ্ছে তা বুঝে উন্নত করতে।',
          'বাংলাদেশের প্রযোজ্য আইন মেনে চলতে।',
        ],
      },
      {
        heading: '৩. তথ্য শেয়ার করা',
        paragraphs: [
          'আমরা আপনার ব্যক্তিগত তথ্য বিক্রি বা ভাড়া দিই না। শুধুমাত্র ওয়েবসাইট পরিচালনা ও অর্ডার প্রসেসে সহায়তাকারী সেবাদাতাদের (যেমন হোস্টিং, অ্যানালিটিক্স ও পেমেন্ট সেবা) সাথে, তাদের প্রয়োজন অনুযায়ী, অথবা আইনগতভাবে বাধ্য হলে তথ্য শেয়ার করা হয়।',
        ],
      },
      {
        heading: '৪. কুকি',
        paragraphs: [
          'সাইট সঠিকভাবে চালাতে ও ভিজিটর পরিমাপ করতে আমরা কুকি ও অনুরূপ প্রযুক্তি ব্যবহার করি। ব্রাউজার সেটিংস থেকে আপনি কুকি ব্লক বা মুছে ফেলতে পারেন; সেক্ষেত্রে কিছু ফিচার (যেমন সংরক্ষিত কার্ট) কাজ নাও করতে পারে।',
        ],
      },
      {
        heading: '৫. তথ্য সংরক্ষণ ও নিরাপত্তা',
        paragraphs: [
          'সেবা প্রদান, সাপোর্ট ও রিনিউয়াল এবং আইনগত বা হিসাবরক্ষণের প্রয়োজন যতদিন থাকে, ততদিন আমরা অর্ডারের রেকর্ড সংরক্ষণ করি। আপনার তথ্য সুরক্ষায় আমরা যুক্তিসংগত প্রযুক্তিগত ও সাংগঠনিক ব্যবস্থা নিই, তবে ইন্টারনেটে তথ্য আদান-প্রদান বা ইলেকট্রনিক সংরক্ষণের কোনো পদ্ধতিই শতভাগ নিরাপদ নয়।',
        ],
      },
      {
        heading: '৬. আপনার অধিকার',
        paragraphs: [
          'আমাদের কাছে থাকা আপনার ব্যক্তিগত তথ্য দেখা, সংশোধন বা মুছে ফেলার অনুরোধ আপনি করতে পারেন (আইন অনুযায়ী যে রেকর্ড রাখা বাধ্যতামূলক তা ব্যতীত)। নিচের ঠিকানায় যোগাযোগ করুন।',
        ],
      },
      {
        heading: '৭. নীতির পরিবর্তন',
        paragraphs: [
          'আমরা সময়ে সময়ে এই নীতি হালনাগাদ করতে পারি। পেজের উপরে থাকা “সর্বশেষ হালনাগাদ” তারিখটি শেষ পরিবর্তনের সময় নির্দেশ করে।',
        ],
      },
    ],
    contactHeading: '৮. যোগাযোগ',
    contactIntro: 'এই গোপনীয়তা নীতি বা আপনার তথ্য সম্পর্কে কোনো প্রশ্ন থাকলে যোগাযোগ করুন:',
  },
}

export const termsAndConditions: Record<LegalLanguage, LegalDocument> = {
  en: {
    title: 'Terms and Conditions',
    intro: `Welcome to ${name}. These terms govern your use of our website and the purchase of digital subscriptions from us. By using this website or placing an order, you agree to these terms. If you do not agree, please do not use our services.`,
    sections: [
      {
        heading: '1. Our Services',
        paragraphs: [
          `${name} provides access to premium digital subscriptions (such as AI tools, streaming, VPN and creative software). We are an independent reseller and are not affiliated with, endorsed by or owned by the brands whose products we provide. All trademarks belong to their respective owners.`,
        ],
      },
      {
        heading: '2. Orders & Payment',
        bullets: [
          'Prices are shown in Bangladeshi Taka (৳) and may change without notice. The price at the time you place your order applies.',
          'Payment is made via bKash, Nagad, Rocket or Binance. You must enter the correct transaction ID when placing an order.',
          'An order is confirmed only after we verify your payment. We may cancel an order if the payment cannot be verified.',
          'Coupon codes are subject to their own conditions and cannot be exchanged for cash.',
        ],
      },
      {
        heading: '3. Delivery',
        paragraphs: [
          'After payment verification, we deliver your subscription or account access through your provided phone, WhatsApp or email. Please make sure your contact details are correct; we are not responsible for delays caused by incorrect information.',
        ],
      },
      {
        heading: '4. Shared & Personal Plans',
        bullets: [
          'Shared plans: the account is used by multiple customers. Do not change the password, email, profile settings or payment details, and do not share access with others.',
          'Personal plans: the account is for your use only and must not be resold or shared.',
          'Breaking these rules may lead to access being removed without a refund.',
        ],
      },
      {
        heading: '5. Validity & Renewal',
        paragraphs: [
          'Each plan is valid for the period you purchased (for example 1, 3 or 6 months), starting from delivery. Subscriptions do not renew automatically; contact us before expiry to renew.',
        ],
      },
      {
        heading: '6. Refunds & Replacements',
        paragraphs: [
          'If we cannot deliver your order, or a delivered account stops working because of an issue on our side during its validity, we will provide a replacement or a refund for the unused period. Refunds are not available once a working subscription has been delivered and used, or when access is removed because these terms were broken.',
        ],
      },
      {
        heading: '7. Acceptable Use',
        bullets: [
          'You must provide accurate information when placing an order.',
          'You must follow the terms of service of the platform whose subscription you use.',
          'You must not use our website or services for any unlawful purpose or in a way that harms the website or other users.',
        ],
      },
      {
        heading: '8. Limitation of Liability',
        paragraphs: [
          `${name} is not liable for changes, outages or policy decisions made by third-party platforms, or for any indirect or consequential loss arising from the use of our website or services. Our total liability for any order is limited to the amount you paid for that order.`,
        ],
      },
      {
        heading: '9. Changes to These Terms',
        paragraphs: [
          'We may update these terms from time to time. The “Last updated” date at the top of this page shows when they were last changed. Continued use of our services means you accept the updated terms.',
        ],
      },
    ],
    contactHeading: '10. Contact Us',
    contactIntro: 'For any questions about these terms or your order, contact us:',
  },
  bn: {
    title: 'নিয়ম ও শর্তাবলী',
    intro: `${name}-এ আপনাকে স্বাগতম। আমাদের ওয়েবসাইট ব্যবহার ও আমাদের কাছ থেকে ডিজিটাল সাবস্ক্রিপশন কেনার ক্ষেত্রে এই শর্তাবলী প্রযোজ্য। ওয়েবসাইট ব্যবহার বা অর্ডার করার মাধ্যমে আপনি এই শর্তাবলীতে সম্মত হচ্ছেন। সম্মত না হলে অনুগ্রহ করে আমাদের সেবা ব্যবহার করবেন না।`,
    sections: [
      {
        heading: '১. আমাদের সেবা',
        paragraphs: [
          `${name} প্রিমিয়াম ডিজিটাল সাবস্ক্রিপশনে (যেমন AI টুল, স্ট্রিমিং, VPN ও ক্রিয়েটিভ সফটওয়্যার) অ্যাক্সেস প্রদান করে। আমরা একটি স্বাধীন রিসেলার; যেসব ব্র্যান্ডের পণ্য আমরা দিই, তাদের সাথে আমাদের কোনো মালিকানা বা অনুমোদনগত সম্পর্ক নেই। সকল ট্রেডমার্ক তাদের নিজ নিজ মালিকের।`,
        ],
      },
      {
        heading: '২. অর্ডার ও পেমেন্ট',
        bullets: [
          'মূল্য বাংলাদেশি টাকায় (৳) দেখানো হয় এবং পূর্ব ঘোষণা ছাড়াই পরিবর্তিত হতে পারে। অর্ডার করার সময়ের মূল্য প্রযোজ্য হবে।',
          'বিকাশ, নগদ, রকেট বা বাইন্যান্সের মাধ্যমে পেমেন্ট করা যায়। অর্ডারের সময় সঠিক ট্রানজেকশন আইডি দিতে হবে।',
          'পেমেন্ট যাচাই হওয়ার পরেই অর্ডার নিশ্চিত হয়। পেমেন্ট যাচাই করা না গেলে আমরা অর্ডার বাতিল করতে পারি।',
          'কুপন কোড নিজস্ব শর্তসাপেক্ষ এবং নগদ টাকায় রূপান্তরযোগ্য নয়।',
        ],
      },
      {
        heading: '৩. ডেলিভারি',
        paragraphs: [
          'পেমেন্ট যাচাইয়ের পর আপনার দেওয়া ফোন, হোয়াটসঅ্যাপ বা ইমেইলের মাধ্যমে সাবস্ক্রিপশন বা অ্যাকাউন্ট অ্যাক্সেস পাঠানো হয়। আপনার যোগাযোগের তথ্য সঠিক কিনা নিশ্চিত করুন; ভুল তথ্যের কারণে দেরি হলে আমরা দায়ী নই।',
        ],
      },
      {
        heading: '৪. শেয়ার্ড ও পার্সোনাল প্ল্যান',
        bullets: [
          'শেয়ার্ড প্ল্যান: অ্যাকাউন্টটি একাধিক গ্রাহক ব্যবহার করেন। পাসওয়ার্ড, ইমেইল, প্রোফাইল সেটিংস বা পেমেন্ট তথ্য পরিবর্তন করবেন না এবং অন্য কারো সাথে অ্যাক্সেস শেয়ার করবেন না।',
          'পার্সোনাল প্ল্যান: অ্যাকাউন্টটি শুধুমাত্র আপনার ব্যবহারের জন্য; পুনরায় বিক্রি বা শেয়ার করা যাবে না।',
          'এই নিয়ম ভঙ্গ করলে রিফান্ড ছাড়াই অ্যাক্সেস বাতিল করা হতে পারে।',
        ],
      },
      {
        heading: '৫. মেয়াদ ও রিনিউয়াল',
        paragraphs: [
          'প্রতিটি প্ল্যান ডেলিভারির দিন থেকে আপনার কেনা মেয়াদ (যেমন ১, ৩ বা ৬ মাস) পর্যন্ত বৈধ। সাবস্ক্রিপশন স্বয়ংক্রিয়ভাবে রিনিউ হয় না; মেয়াদ শেষ হওয়ার আগে রিনিউ করতে আমাদের সাথে যোগাযোগ করুন।',
        ],
      },
      {
        heading: '৬. রিফান্ড ও রিপ্লেসমেন্ট',
        paragraphs: [
          'আমরা যদি অর্ডার ডেলিভারি করতে না পারি, অথবা মেয়াদের মধ্যে আমাদের দিকের সমস্যার কারণে ডেলিভার করা অ্যাকাউন্ট কাজ না করে, তাহলে আমরা রিপ্লেসমেন্ট দেব অথবা অব্যবহৃত সময়ের জন্য রিফান্ড করব। কার্যকর সাবস্ক্রিপশন ডেলিভার ও ব্যবহারের পর, অথবা শর্ত ভঙ্গের কারণে অ্যাক্সেস বাতিল হলে রিফান্ড প্রযোজ্য নয়।',
        ],
      },
      {
        heading: '৭. গ্রহণযোগ্য ব্যবহার',
        bullets: [
          'অর্ডার করার সময় সঠিক তথ্য দিতে হবে।',
          'যে প্ল্যাটফর্মের সাবস্ক্রিপশন ব্যবহার করছেন, তার নিজস্ব ব্যবহারের শর্তাবলী মেনে চলতে হবে।',
          'কোনো বেআইনি উদ্দেশ্যে, অথবা ওয়েবসাইট বা অন্য ব্যবহারকারীদের ক্ষতি হয় এমনভাবে আমাদের ওয়েবসাইট বা সেবা ব্যবহার করা যাবে না।',
        ],
      },
      {
        heading: '৮. দায়বদ্ধতার সীমা',
        paragraphs: [
          `তৃতীয় পক্ষের প্ল্যাটফর্মের পরিবর্তন, সার্ভিস বিভ্রাট বা নীতিগত সিদ্ধান্ত, অথবা আমাদের ওয়েবসাইট বা সেবা ব্যবহারের ফলে সৃষ্ট কোনো পরোক্ষ ক্ষতির জন্য ${name} দায়ী নয়। যেকোনো অর্ডারের ক্ষেত্রে আমাদের সর্বোচ্চ দায় ওই অর্ডারে আপনার পরিশোধিত অর্থের পরিমাণ পর্যন্ত সীমিত।`,
        ],
      },
      {
        heading: '৯. শর্তাবলীর পরিবর্তন',
        paragraphs: [
          'আমরা সময়ে সময়ে এই শর্তাবলী হালনাগাদ করতে পারি। পেজের উপরে থাকা “সর্বশেষ হালনাগাদ” তারিখটি শেষ পরিবর্তনের সময় নির্দেশ করে। পরিবর্তনের পরও সেবা ব্যবহার করলে আপনি হালনাগাদকৃত শর্তাবলী মেনে নিয়েছেন বলে গণ্য হবে।',
        ],
      },
    ],
    contactHeading: '১০. যোগাযোগ',
    contactIntro: 'এই শর্তাবলী বা আপনার অর্ডার সম্পর্কে কোনো প্রশ্ন থাকলে যোগাযোগ করুন:',
  },
}

const brands = 'Netflix, ExpressVPN, Google Gemini, Amazon Prime Video and CapCut'
const email = siteConfig.contact.email

export const disclaimer: Record<LegalLanguage, LegalDocument> = {
  en: {
    title: 'Disclaimer',
    intro: `${name} is an independent digital service provider. We are not an official representative, partner, authorized dealer, or affiliate of any company, platform, or brand mentioned on this website, and we do not claim any official relationship, sponsorship, or endorsement.`,
    sections: [
      {
        heading: '1. Trademarks',
        paragraphs: [
          `All product and service names and trademarks mentioned on this website, including ${brands}, and any other brand names shown, are the property of their respective owners. These names are used for identification purposes only, to describe which subscription or access service is offered.`,
        ],
      },
      {
        heading: '2. What We Sell',
        paragraphs: [
          'We provide digital subscription and access services only. There are no physical products and no physical delivery. The subscription is activated after payment is confirmed.',
        ],
      },
      {
        heading: '3. Service Terms',
        paragraphs: [
          "Each service is governed by the respective platform's own terms, policies, and privacy policy. Changes to a platform's features, pricing, or policies are beyond our control and may affect the service.",
        ],
      },
      {
        heading: '4. Support and Guarantee',
        paragraphs: [
          `We offer prompt support and replacement, subject to our Terms & Conditions, for the duration of the subscription. This is ${name}'s own service guarantee, not an official warranty from the original platform.`,
        ],
      },
      {
        heading: '5. Customer Responsibility',
        paragraphs: [
          "Customers must follow the respective platform's rules when using the service. We are not responsible for account restrictions caused by rule violations.",
        ],
      },
      {
        heading: '6. Copyright and Brand Concerns',
        paragraphs: [
          `If any brand or rights holder believes their content has been used incorrectly on this site, please contact us at ${email}, and we will promptly review and take appropriate action.`,
        ],
      },
    ],
    contactHeading: '7. Contact Us',
    contactIntro: 'For any questions about this disclaimer, contact us:',
  },
  bn: {
    title: 'দায়মুক্তি বিবৃতি (Disclaimer)',
    intro: `${name} একটি স্বাধীন ডিজিটাল সার্ভিস প্রদানকারী প্রতিষ্ঠান। এই ওয়েবসাইটে উল্লিখিত কোনো কোম্পানি, প্ল্যাটফর্ম বা ব্র্যান্ডের আমরা অফিসিয়াল প্রতিনিধি, পার্টনার, অনুমোদিত ডিলার বা অ্যাফিলিয়েট নই। কোনো ধরনের অফিসিয়াল সম্পর্ক, স্পনসরশিপ বা অনুমোদনের দাবিও আমরা করি না।`,
    sections: [
      {
        heading: '১. ট্রেডমার্ক',
        paragraphs: [
          `এই ওয়েবসাইটে উল্লিখিত ${brands} সহ সব পণ্য ও সেবার নাম এবং ট্রেডমার্ক তাদের নিজ নিজ মালিকের সম্পত্তি। কোন সাবস্ক্রিপশন বা অ্যাক্সেস সেবা দেওয়া হচ্ছে তা বোঝানোর জন্যই কেবল এই নামগুলো ব্যবহার করা হয়েছে।`,
        ],
      },
      {
        heading: '২. আমরা কী বিক্রি করি',
        paragraphs: [
          'আমরা শুধুমাত্র ডিজিটাল সাবস্ক্রিপশন ও অ্যাক্সেস সেবা প্রদান করি। কোনো ফিজিক্যাল পণ্য নেই এবং কোনো ফিজিক্যাল ডেলিভারিও নেই। পেমেন্ট নিশ্চিত হওয়ার পর সাবস্ক্রিপশন চালু করা হয়।',
        ],
      },
      {
        heading: '৩. সেবার শর্ত',
        paragraphs: [
          'প্রতিটি সেবা সংশ্লিষ্ট প্ল্যাটফর্মের নিজস্ব শর্ত, নীতিমালা ও প্রাইভেসি পলিসি দ্বারা পরিচালিত। প্ল্যাটফর্মের ফিচার, মূল্য বা নীতিমালার পরিবর্তন আমাদের নিয়ন্ত্রণের বাইরে এবং তা সেবাকে প্রভাবিত করতে পারে।',
        ],
      },
      {
        heading: '৪. সাপোর্ট ও গ্যারান্টি',
        paragraphs: [
          `সাবস্ক্রিপশনের মেয়াদকালে আমাদের নিয়ম ও শর্তাবলী অনুযায়ী আমরা দ্রুত সাপোর্ট ও রিপ্লেসমেন্ট দিয়ে থাকি। এটি ${name}-এর নিজস্ব সেবার গ্যারান্টি, মূল প্ল্যাটফর্মের অফিসিয়াল ওয়ারেন্টি নয়।`,
        ],
      },
      {
        heading: '৫. গ্রাহকের দায়িত্ব',
        paragraphs: [
          'সেবা ব্যবহারের সময় গ্রাহককে সংশ্লিষ্ট প্ল্যাটফর্মের নিয়ম মেনে চলতে হবে। নিয়ম লঙ্ঘনের কারণে কোনো অ্যাকাউন্টে বিধিনিষেধ এলে তার দায় আমাদের নয়।',
        ],
      },
      {
        heading: '৬. কপিরাইট ও ব্র্যান্ড সংক্রান্ত অভিযোগ',
        paragraphs: [
          `কোনো ব্র্যান্ড বা স্বত্বাধিকারী মনে করলে যে এই সাইটে তাদের কনটেন্ট ভুলভাবে ব্যবহার করা হয়েছে, অনুগ্রহ করে ${email} ঠিকানায় যোগাযোগ করুন। আমরা দ্রুত বিষয়টি পর্যালোচনা করে প্রয়োজনীয় ব্যবস্থা নেব।`,
        ],
      },
    ],
    contactHeading: '৭. যোগাযোগ',
    contactIntro: 'এই দায়মুক্তি বিবৃতি সম্পর্কে কোনো প্রশ্ন থাকলে যোগাযোগ করুন:',
  },
}
