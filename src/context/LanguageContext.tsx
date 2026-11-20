"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'


const translations = {
  en: {
    appName: 'DigitalAccess DA',
    appTagline: 'Digital subscription management platform',
    dashboardTitle: 'Subscription dashboard',

    navOverview: 'Overview',
    navCustomers: 'Customers',
    navServiceAccounts: 'Service Accounts',
    navAllSubscriptions: 'All Subscriptions',
    navExpiringSoon: 'Expiring Soon',
    logout: 'Logout',
    navSearchPlaceholder: 'Search products…',
    mobileNavAriaLabel: 'Main navigation',
    navPrimaryAriaLabel: 'Primary',
    navSkipToContent: 'Skip to content',
    navSearchResults: 'Search results',
    navSearching: 'Searching…',
    navNoResults: 'No products found',
    navClearSearch: 'Clear search',
    navThemeToggle: 'Toggle dark mode',
    navLanguage: 'Language',
    navStartsFrom: 'From',
    navOpenMenu: 'Open menu',
    navCloseMenu: 'Close menu',
    navMenu: 'Menu',
    navTheme: 'Dark mode',

    homeBadge: 'Bangladeshi digital subscription service',
    homeHeroTitlePrefix: 'All your',
    homeHeroTitleHighlight: 'Netflix, CapCut, ChatGPT',
    homeHeroTitleSuffix: 'subscriptions in one place.',
    homeHeroDescription:
      'Pick a plan from our shop, pay with bKash, Nagad, Rocket or Binance, and get your access details from our team—simple ordering without a separate customer dashboard.',
    homeCtaPrimary: 'Sign in',
    homeCtaSecondary: 'See our services',
    homeCtaExploreProducts: 'Explore products',
    homeHeroTrustLine: 'Secure checkout · Trusted delivery',
    homeBullet1Title: 'Local payments',
    homeBullet1Body: 'Clear checkout steps for bKash, Nagad, Rocket and more.',
    homeBullet2Title: 'Human support',
    homeBullet2Body: 'We confirm your payment and help you get online fast.',
    homeStatProducts: 'Products',
    homeStatProductsSub: 'Streaming, apps & tools in one catalog',
    homeStatProductsStatus: 'Live',
    homeStatCategories: 'Categories',
    homeStatCategoriesSub: 'Shop by type and find plans faster',
    homeStatCategoriesStatus: 'Curated',
    homeStatDailyOrders: 'Daily orders',
    homeStatDailyOrdersSub: 'Checkout volume we process every day',
    homeStatDailyOrdersStatus: 'Active',
    homeStatCustomers: 'Happy customers',
    homeStatCustomersSub: 'Buyers who trust us across Bangladesh',
    homeStatCustomersStatus: 'Trusted',
    homeStatUpdatesLabel: 'Live updates',
    homeStatUpdatesBadge: 'Now',
    homeStatTicker1: 'Order confirmed',
    homeStatTicker2: 'Payment verified',
    homeStatTicker3: 'Access delivered',
    homeStatTicker4: 'Invoice & bill provided',
    homeServicesTitle: 'Services we provide',
    homeServicesBody:
      'From family shared accounts to reseller management, DigitalAccess DA is your partner for keeping everything on a single platform.',
    homeServiceStreamingTitle: 'Streaming subscription management',
    homeServiceStreamingDesc:
      'Securely manage all your streaming accounts like Netflix, Prime Video and YouTube Premium.',
    homeServiceAppsTitle: 'App subscriptions (CapCut, ChatGPT etc.)',
    homeServiceAppsDesc:
      'Easily manage premium access for CapCut, ChatGPT and other productivity tools.',
    homeServiceSecurityTitle: 'Secure data & account control',
    homeServiceSecurityDesc:
      'View data security, login details and access control for each account from one platform.',
    homeServiceAlertsTitle: 'Expiry alerts',
    homeServiceAlertsDesc:
      'Get notified before any subscription expires so you never miss a payment again.',
    homeFooterLine2:
      'Built for digital subscription businesses in Bangladesh.',

    shopSectionTitle: 'Digital services we provide',
    shopSectionSubtitle: 'Premium subscriptions at the best price.',
    viewAll: 'View all',
    buyNow: 'Buy now',
    actualPrice: 'Actual price',
    offerPrice: 'Offer price',
    perMonth: '/month',
    perYear: '/year',
    shopPageTitle: 'All digital services',
    shopPageSubtitle: 'Choose your plan and get instant access.',

    footerTerms: 'T & C',
    footerPrivacy: 'Privacy Policy',
    footerDisclaimerLink: 'Disclaimer',
    footerDisclaimer: '{{name}} is an independent digital service provider and is not officially affiliated with any of the brands mentioned. All trademarks belong to their respective owners.',
    allRightsReserved: 'All rights reserved.',
    footerTagline:
      'Built for digital subscription businesses in Bangladesh. Local payments, human support, instant delivery.',
    footerPaymentsTitle: 'We accept',
    footerSocialTitle: 'Follow us',
    footerContactTitle: 'Contact',
    footerExploreTitle: 'Pages',
    footerLinkHome: 'Home',
    footerLinkShop: 'Shop',
    footerLinkBlog: 'Blog',
    footerLinkPostOrder: 'Order details',
    footerCreateOrder: 'Create order',
    footerTrackOrder: 'Track order',
    footerCreateOrderHint: 'Already paid? Submit your order details',
    footerInstagramLabel: 'Instagram',
    footerMessengerLabel: 'Messenger',
    footerYoutubeLabel: 'YouTube',
    footerTiktokLabel: 'TikTok',
    footerTechnologyPartnerLabel: 'Technology partner:',

    contactTitle: 'Contact Us',
    contactSubtitle: 'Get in touch for support or inquiries.',
    contactEmail: 'daccessbd@gmail.com',
    contactPhone: '+880 1521-585818',
    contactWhatsapp: '01521585818',
    contactAddress: 'Dhaka, Bangladesh',

    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Common questions about our services.',

    customerFeedbackTitle: 'What our customers say?',

    cart: 'Cart',
    quantity: 'Quantity',
    addToCart: 'Add to cart',
    checkout: 'Checkout',
    yourCart: 'Your cart',
    emptyCart: 'Your cart is empty',
    emptyCartHint: 'Add items from the shop to continue.',
    subtotal: 'Subtotal',
    remove: 'Remove',
    proceedToCheckout: 'Proceed to checkout',
    continueShopping: 'Continue shopping',
    cartQuantity: 'Qty',
    placeOrder: 'Place order',
    shoppingCart: 'Shopping cart',
    viewCart: 'View cart',

    confirmOrderTitle: 'Confirm order',
    billingDetails: 'Billing details',
    fullName: 'Full name',
    phone: 'Phone',
    whatsappNumber: 'WhatsApp number',
    email: 'Email',
    address: 'Address',
    createAccount: 'Create account',
    password: 'Password',
    passwordRequired: 'Password',
    orderNotes: 'Order notes',
    paymentInformation: 'Payment information',
    selectPaymentMethod: 'Select payment method:',
    paymentBkash: 'Bkash Personal (Send Money)',
    paymentNagad: 'Nagad Personal (Send Money)',
    paymentRocket: 'Rocket Personal (Send Money)',
    paymentBinance: 'Binance',
    transactionId: 'Transaction ID',
    confirmOrderButton: 'Confirm order',
    copyLabel: 'Copy',
    copiedLabel: 'Copied',
    orderSummary: 'Order summary',
    instructionsBkash: '1. From the bKash app, choose the Send Money option.\n2. Send the total amount to the number above.\n3. Enter your number and the Transaction ID (TrxID) below.',
    instructionsNagad: '1. From the Nagad app, choose the Send Money option.\n2. Send the total amount to the number above.\n3. Enter your number and the Transaction ID (TrxID) below.',
    instructionsRocket: '1. From the Rocket app, choose the Send Money option.\n2. Send the total amount to the number above.\n3. Enter your number and the Transaction ID (TrxID) below.',
    instructionsBinance: '1. Open the Binance app and go to Pay → Send.\n2. Choose "Pay ID".\n3. Enter our Binance Pay ID:\n\n{{number}}\n\n4. Enter the amount and confirm the payment.\n5. Copy the Order ID / transaction ID from your Binance Pay history and paste it below.',
    payToNumber: 'Send money to this number',
    payToBinanceId: 'Binance Pay ID',
    payAmountLabel: 'Amount to pay',
    payHowTo: 'How to pay',
    payPickMethodHint: 'Choose a payment method to see the account number and step-by-step instructions.',
    payHelpHeading: 'Need help with payment?',
    payHelpHint: 'Message us on WhatsApp or call — we usually reply quickly.',
    payHelpWhatsapp: 'Chat on WhatsApp',
    payHelpMessage: 'Hello, I need help with the payment for my order.',
    paymentContactHeading: 'Payment & contact details',
    bkashPersonalLabel: 'Bkash Personal (Send Money)',
    nagadRocketLabel: 'Nagad / Rocket Personal (Send Money)',

    postOrderFormTitle: 'After your order',
    postOrderFormSubtitle:
      'Share your payment and service details so we can process your order quickly.',
    postOrderSubmit: 'Submit details',
    postOrderFieldServiceName: 'What you purchased',
    postOrderFieldPrice: 'Price',
    postOrderFieldPaymentMethod: 'Payment method',
  },
  bn: {
    appName: 'DigitalAccess DA',
    appTagline: 'ডিজিটাল সাবস্ক্রিপশন ম্যানেজমেন্ট প্ল্যাটফর্ম',
    dashboardTitle: 'সাবস্ক্রিপশন ড্যাশবোর্ড',

    navOverview: 'ওভারভিউ',
    navCustomers: 'কাস্টমারস',
    navServiceAccounts: 'সার্ভিস একাউন্টস',
    navAllSubscriptions: 'সব সাবস্ক্রিপশন',
    navExpiringSoon: 'মেয়াদ শেষের পথে',
    logout: 'লগআউট',
    navSearchPlaceholder: 'পণ্য খুঁজুন…',
    mobileNavAriaLabel: 'প্রধান নেভিগেশন',
    navPrimaryAriaLabel: 'প্রধান মেনু',
    navSkipToContent: 'মূল কনটেন্টে যান',
    navSearchResults: 'সার্চ ফলাফল',
    navSearching: 'খোঁজা হচ্ছে…',
    navNoResults: 'কোনো পণ্য পাওয়া যায়নি',
    navClearSearch: 'সার্চ মুছুন',
    navThemeToggle: 'ডার্ক মোড পরিবর্তন',
    navLanguage: 'ভাষা',
    navStartsFrom: 'শুরু',
    navOpenMenu: 'মেনু খুলুন',
    navCloseMenu: 'মেনু বন্ধ করুন',
    navMenu: 'মেনু',
    navTheme: 'ডার্ক মোড',

    homeBadge: 'বাংলাদেশি ডিজিটাল সাবস্ক্রিপশন সার্ভিস',
    homeHeroTitlePrefix: 'আপনার সব',
    homeHeroTitleHighlight: 'Netflix, CapCut, ChatGPT',
    homeHeroTitleSuffix: 'সাবস্ক্রিপশন এক জায়গায়।',
    homeHeroDescription:
      'শপ থেকে প্ল্যান বেছে নিন, বিকাশ, নগদ, রকেট বা বাইন্যান্স দিয়ে পেমেন্ট করুন, আর আমাদের টিম থেকে অ্যাক্সেস ডিটেইল পেয়ে যান—আলাদা গ্রাহক ড্যাশবোর্ড ছাড়াই সহজ অর্ডার।',
    homeCtaPrimary: 'লগইন করুন',
    homeCtaSecondary: 'আমাদের সার্ভিসসমূহ দেখুন',
    homeCtaExploreProducts: 'প্রোডাক্ট দেখুন',
    homeHeroTrustLine: 'নিরাপদ চেকআউট · বিশ্বস্ত ডেলিভারি',
    homeBullet1Title: 'দেশীয় পেমেন্ট',
    homeBullet1Body: 'বিকাশ, নগদ, রকেটসহ চেকআউটে স্পষ্ট নির্দেশনা।',
    homeBullet2Title: 'মানুষের সাপোর্ট',
    homeBullet2Body: 'পেমেন্ট যাচাই করে দ্রুত অনলাইনে পৌঁছে দিতে সাহায্য।',
    homeStatProducts: 'প্রোডাক্ট',
    homeStatProductsSub: 'স্ট্রিমিং, অ্যাপ ও টুল—এক ক্যাটালগে',
    homeStatProductsStatus: 'লাইভ',
    homeStatCategories: 'ক্যাটাগরি',
    homeStatCategoriesSub: 'ধরন অনুযায়ী খুঁজে দ্রুত প্ল্যান',
    homeStatCategoriesStatus: 'কিউরেটেড',
    homeStatDailyOrders: 'দৈনিক অর্ডার',
    homeStatDailyOrdersSub: 'প্রতিদিন যাচাই করা অর্ডার',
    homeStatDailyOrdersStatus: 'সক্রিয়',
    homeStatCustomers: 'খুশি গ্রাহক',
    homeStatCustomersSub: 'বাংলাদেশ জুড়ে আমাদের ওপর আস্থা',
    homeStatCustomersStatus: 'বিশ্বস্ত',
    homeStatUpdatesLabel: 'লাইভ আপডেট',
    homeStatUpdatesBadge: 'এখন',
    homeStatTicker1: 'অর্ডার কনফার্ম',
    homeStatTicker2: 'পেমেন্ট ভেরিফাই',
    homeStatTicker3: 'অ্যাক্সেস ডেলিভারি',
    homeStatTicker4: 'ইনভয়েস ও বিল প্রদান',
    homeServicesTitle: 'আমরা যেসব সার্ভিস প্রদান করি',
    homeServicesBody:
      'ফ্যামিলি শেয়ার্ড একাউন্ট থেকে শুরু করে রিসেলার ম্যানেজমেন্ট — সবকিছু এক প্ল্যাটফর্মে রাখতে DigitalAccess DA আপনার সঙ্গী।',
    homeServiceStreamingTitle: 'স্ট্রিমিং সার্ভিস সাবস্ক্রিপশন ম্যানেজমেন্ট',
    homeServiceStreamingDesc:
      'নেটফ্লিক্স, প্রাইম ভিডিও, ইউটিউব প্রিমিয়াম সহ আপনার সব স্ট্রিমিং একাউন্ট নিরাপদভাবে ম্যানেজ করি।',
    homeServiceAppsTitle: 'অ্যাপ সাবস্ক্রিপশন (ক্যাপকাট, চ্যাটজিপিটি ইত্যাদি)',
    homeServiceAppsDesc:
      'ক্যাপকাট, চ্যাটজিপিটি, প্রোডাকটিভিটি টুলসসহ বিভিন্ন অ্যাপের প্রিমিয়াম এক্সেস সহজেই পরিচালনা করুন।',
    homeServiceSecurityTitle: 'নিরাপদ ডাটা ও একাউন্ট কন্ট্রোল',
    homeServiceSecurityDesc:
      'প্রতিটি একাউন্টের ডাটা সিকিউরিটি, লগইন বিস্তারিত ও এক্সেস কন্ট্রোল এক প্ল্যাটফর্ম থেকেই দেখুন।',
    homeServiceAlertsTitle: 'মেয়াদ শেষ হওয়ার অ্যালার্ট',
    homeServiceAlertsDesc:
      'কোন সাবস্ক্রিপশনের মেয়াদ কখন শেষ হবে, আগে থেকেই নোটিফিকেশন পেয়ে যান—মিসড পেমেন্ট আর নয়।',
    homeFooterLine2:
      'বাংলাদেশের ডিজিটাল সাবস্ক্রিপশন ব্যবসায়ীদের জন্য তৈরি।',

    shopSectionTitle: 'আমরা যে ডিজিটাল সার্ভিস দিই',
    shopSectionSubtitle: 'সেরা দামে প্রিমিয়াম সাবস্ক্রিপশন।',
    viewAll: 'সব দেখুন',
    buyNow: 'এখনই কিনুন',
    actualPrice: 'আসল দাম',
    offerPrice: 'অফার মূল্য',
    perMonth: '/মাস',
    perYear: '/বছর',
    shopPageTitle: 'সব ডিজিটাল সার্ভিস',
    shopPageSubtitle: 'প্ল্যান বেছে নিন এবং তাৎক্ষণিক অ্যাক্সেস পান।',

    footerTerms: 'নিয়ম ও শর্তাবলী',
    footerPrivacy: 'গোপনীয়তা নীতি',
    footerDisclaimerLink: 'দায়মুক্তি বিবৃতি',
    footerDisclaimer: '{{name}} একটি স্বাধীন ডিজিটাল সার্ভিস প্রদানকারী এবং উল্লিখিত কোনো ব্র্যান্ডের সাথে অফিসিয়ালি যুক্ত নয়। সব ট্রেডমার্ক তাদের নিজ নিজ মালিকের সম্পত্তি।',
    allRightsReserved: 'সর্বস্বত্ব সংরক্ষিত।',
    footerTagline:
      'বাংলাদেশের ডিজিটাল সাবস্ক্রিপশন ব্যবসার জন্য তৈরি। স্থানীয় পেমেন্ট, মানবিক সহায়তা ও দ্রুত ডেলিভারি।',
    footerPaymentsTitle: 'গ্রহণযোগ্য পেমেন্ট',
    footerSocialTitle: 'আমাদের অনুসরণ করুন',
    footerContactTitle: 'যোগাযোগ',
    footerExploreTitle: 'পাতাসমূহ',
    footerLinkHome: 'হোম',
    footerLinkShop: 'শপ',
    footerLinkBlog: 'ব্লগ',
    footerLinkPostOrder: 'অর্ডার বিবরণ',
    footerCreateOrder: 'অর্ডার তৈরি করুন',
    footerTrackOrder: 'অর্ডার ট্র্যাক',
    footerCreateOrderHint: 'পেমেন্ট করেছেন? অর্ডারের তথ্য জমা দিন',
    footerInstagramLabel: 'ইনস্টাগ্রাম',
    footerMessengerLabel: 'মেসেঞ্জার',
    footerYoutubeLabel: 'ইউটিউব',
    footerTiktokLabel: 'টিকটক',
    footerTechnologyPartnerLabel: 'প্রযুক্তি অংশীদার:',

    contactTitle: 'যোগাযোগ করুন',
    contactSubtitle: 'সহায়তা বা প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করুন।',
    contactEmail: 'daccessbd@gmail.com',
    contactPhone: '+880 1521-585818',
    contactWhatsapp: '01521585818',
    contactAddress: 'ঢাকা, বাংলাদেশ',

    faqTitle: 'সচরাচর জিজ্ঞাসিত প্রশ্ন',
    faqSubtitle: 'আমাদের সেবা সম্পর্কে সাধারণ প্রশ্নসমূহ।',

    customerFeedbackTitle: 'আমাদের গ্রাহকরা কী বলেন?',

    cart: 'কার্ট',
    quantity: 'পরিমাণ',
    addToCart: 'কার্টে যোগ করুন',
    checkout: 'চেকআউট',
    yourCart: 'আপনার কার্ট',
    emptyCart: 'আপনার কার্ট খালি',
    emptyCartHint: 'শপ থেকে আইটেম যোগ করে এগিয়ে যান।',
    subtotal: 'সাবটোটাল',
    remove: 'সরান',
    proceedToCheckout: 'চেকআউটে যান',
    continueShopping: 'কেনাকাটা চালিয়ে যান',
    cartQuantity: 'সংখ্যা',
    placeOrder: 'অর্ডার নিশ্চিত করুন',
    shoppingCart: 'শপিং কার্ট',
    viewCart: 'কার্ট দেখুন',

    confirmOrderTitle: 'অর্ডার নিশ্চিত করুন',
    billingDetails: 'বিলিং বিবরণ',
    fullName: 'পুরো নাম',
    phone: 'ফোন',
    whatsappNumber: 'হোয়াটসঅ্যাপ নম্বর',
    email: 'ইমেইল',
    address: 'ঠিকানা',
    createAccount: 'অ্যাকাউন্ট তৈরি করুন',
    password: 'পাসওয়ার্ড',
    passwordRequired: 'পাসওয়ার্ড *',
    orderNotes: 'অর্ডার নোট',
    paymentInformation: 'পেমেন্ট তথ্য',
    selectPaymentMethod: 'পেমেন্ট পদ্ধতি নির্বাচন করুন:',
    paymentBkash: 'বিকাশ পার্সোনাল (সেন্ড মানি)',
    paymentNagad: 'নগদ পার্সোনাল (সেন্ড মানি)',
    paymentRocket: 'রকেট পার্সোনাল (সেন্ড মানি)',
    paymentBinance: 'বাইন্যান্স',
    transactionId: 'ট্রানজেকশন আইডি',
    confirmOrderButton: 'অর্ডার নিশ্চিত করুন',
    copyLabel: 'কপি',
    copiedLabel: 'কপি হয়েছে',
    orderSummary: 'অর্ডার সামারি',
    instructionsBkash: '১. bKash অ্যাপ থেকে Send Money অপশন বেছে নিন।\n২. উপরের নাম্বারে মোট টাকা Send Money করুন।\n৩. নিচে আপনার নাম্বার ও Transaction ID (TrxID) দিন।',
    instructionsNagad: '১. Nagad অ্যাপ থেকে Send Money অপশন বেছে নিন।\n২. উপরের নাম্বারে মোট টাকা Send Money করুন।\n৩. নিচে আপনার নাম্বার ও Transaction ID (TrxID) দিন।',
    instructionsRocket: '১. Rocket অ্যাপ থেকে Send Money অপশন বেছে নিন।\n২. উপরের নাম্বারে মোট টাকা Send Money করুন।\n৩. নিচে আপনার নাম্বার ও Transaction ID (TrxID) দিন।',
    instructionsBinance: '১. বাইন্যান্স অ্যাপ খুলে Pay → Send-এ যান।\n২. "Pay ID" অপশনটি বেছে নিন।\n৩. আমাদের বাইন্যান্স পে আইডি দিন:\n\n{{number}}\n\n৪. টাকার পরিমাণ লিখে পেমেন্ট কনফার্ম করুন।\n৫. বাইন্যান্স পে হিস্টোরি থেকে অর্ডার আইডি / ট্রানজেকশন আইডি কপি করে নিচে পেস্ট করুন।',
    payToNumber: 'এই নম্বরে সেন্ড মানি করুন',
    payToBinanceId: 'বাইন্যান্স পে আইডি',
    payAmountLabel: 'পরিশোধযোগ্য টাকা',
    payHowTo: 'কীভাবে পেমেন্ট করবেন',
    payPickMethodHint: 'অ্যাকাউন্ট নম্বর ও ধাপে ধাপে নির্দেশনা দেখতে একটি পেমেন্ট পদ্ধতি বেছে নিন।',
    payHelpHeading: 'পেমেন্টে সাহায্য লাগবে?',
    payHelpHint: 'হোয়াটসঅ্যাপে মেসেজ করুন অথবা কল করুন — আমরা দ্রুত উত্তর দিই।',
    payHelpWhatsapp: 'হোয়াটসঅ্যাপে চ্যাট করুন',
    payHelpMessage: 'হ্যালো, আমার অর্ডারের পেমেন্টে সাহায্য দরকার।',
    paymentContactHeading: 'পেমেন্ট ও যোগাযোগ বিবরণ',
    bkashPersonalLabel: 'বিকাশ পার্সোনাল (সেন্ড মানি)',
    nagadRocketLabel: 'নগদ / রকেট পার্সোনাল (সেন্ড মানি)',

    postOrderFormTitle: 'অর্ডারের পর',
    postOrderFormSubtitle:
      'পেমেন্ট ও সেবার বিবরণ লিখুন যাতে দ্রুত আপনার অর্ডার প্রক্রিয়া করা যায়।',
    postOrderSubmit: 'বিবরণ জমা দিন',
    postOrderFieldServiceName: 'আপনি যা কিনেছেন',
    postOrderFieldPrice: 'মূল্য',
    postOrderFieldPaymentMethod: 'পেমেন্ট পদ্ধতি',
  },
} as const

type Language = 'en' | 'bn'

const STORAGE_KEY = 'digitalaccess.language'
type TranslationKey = keyof typeof translations.en

type LanguageContextValue = {
  language: Language
  setLanguage: (lang: Language) => void
  /** Accepts known keys (autocomplete) or any string; unknown keys render as the key itself. */
  t: (key: TranslationKey | (string & {})) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('bn')

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null
      if (stored === 'en' || stored === 'bn') {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- read browser storage after mount so server and client markup match (no hydration mismatch)
        setLanguageState(stored)
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.lang = language === 'bn' ? 'bn' : 'en'
    root.classList.remove('lang-en', 'lang-bn')
    root.classList.add(language === 'bn' ? 'lang-bn' : 'lang-en')
  }, [language])

  function setLanguage(lang: Language) {
    setLanguageState(lang)
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore storage errors
    }
  }

  function t(key: TranslationKey | (string & {})): string {
    const table = (translations[language] ?? translations.en) as Record<string, string>
    return table[key] ?? (translations.en as Record<string, string>)[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}

export type { TranslationKey, Language }
