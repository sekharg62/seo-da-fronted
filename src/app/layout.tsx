import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/siteConfig";
import { getSiteUrl } from "@/lib/siteUrl";
import { GoogleAnalytics } from "@next/third-parties/google";
import { DM_Sans, Anek_Bangla } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { CartDrawer } from "@/components/CartDrawer";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const anekBangla = Anek_Bangla({
  variable: "--font-anek-bangla",
  subsets: ["bengali", "latin"],
  display: "swap",
});

const SITE_URL = getSiteUrl();
const SITE_NAME = siteConfig.websiteName;
const SITE_DESCRIPTION =
  "Buy ChatGPT Plus, Gemini Pro, Netflix, YouTube Premium, CapCut Pro, Amazon Prime, VPN and more premium subscriptions in Bangladesh. Pay with bKash, Nagad or Rocket — fast delivery and full-period support.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} — Premium Digital Subscriptions in Bangladesh`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "digital subscription Bangladesh",
    "ChatGPT Plus Bangladesh",
    "Gemini Pro Bangladesh",
    "Netflix subscription BD",
    "YouTube Premium Bangladesh",
    "CapCut Pro",
    "VPN subscription BD",
    "bKash subscription",
    SITE_NAME,
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // No canonical here: it would be inherited by every page that lacks its own. Each page sets its own.
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Premium Digital Subscriptions in Bangladesh`,
    description: SITE_DESCRIPTION,
    locale: "bn_BD",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Premium Digital Subscriptions in Bangladesh`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

/** Organization + WebSite structured data (brand knowledge panel / sitelinks). */
function siteJsonLd(): string {
  const { contact, social } = siteConfig;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/Blue.png`,
        email: contact.email,
        telephone: contact.phoneTel,
        address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: contact.phoneTel,
            email: contact.email,
            contactType: "customer support",
            areaServed: "BD",
            availableLanguage: ["Bengali", "English"],
          },
        ],
        sameAs: Object.values(social ?? {}).filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: ["bn-BD", "en"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  }).replace(/</g, "\\u003c");
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-R6M0BVZVQJ";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    (function () {
      var root = document.documentElement;
      var theme = localStorage.getItem("digitalaccess.theme");
      if (theme === "light") root.classList.remove("dark");
      else root.classList.add("dark");
      /* Blue = app light mode, White = app dark mode (same as ThemeContext) */
      var fav = document.getElementById("app-favicon");
      if (fav) {
        fav.href = theme === "light" ? "/Blue.png" : "/White.png";
      }
      var lang = localStorage.getItem("digitalaccess.language");
      root.classList.remove("lang-en", "lang-bn");
      if (lang === "en") {
        root.classList.add("lang-en");
        root.setAttribute("lang", "en");
      } else {
        root.classList.add("lang-bn");
        root.setAttribute("lang", "bn");
      }
    })();
  `;

  return (
    <html
      lang="bn"
      className={`${dmSans.variable} ${anekBangla.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" type="image/png" id="app-favicon" href="/Blue.png" />
        <link rel="apple-touch-icon" href="/Blue.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: siteJsonLd() }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
                var f = d.getElementsByTagName(s)[0],
                  j = d.createElement(s),
                  dl = l != "dataLayer" ? "&l=" + l : "";
                j.async = true;
                j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
                f.parentNode.insertBefore(j, f);
              })(window, document, "script", "dataLayer", "GTM-PKR2ZVHN");
            `,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PKR2ZVHN"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <ThemeProvider>
          <LanguageProvider>
            <CartProvider>
              <Navbar />
              {/* Main content wrapper with top padding to account for fixed navbar */}
              <main id="main-content" tabIndex={-1} className="flex-1 outline-none max-md:pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
                {children}
              </main>
              <FloatingContactWidget />
              <Footer />
              <MobileBottomNav />
              <CartDrawer />
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
