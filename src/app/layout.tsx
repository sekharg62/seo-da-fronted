import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://digitalaccess-bd.com"),
  title: {
    template: "%s | DigitalAccess BD",
    default: "DigitalAccess BD - Premium Digital Services",
  },
  description: "Providing modern, premium digital services and fast access for our clients. Making modern tech accessible to everyone.",
  keywords: ["Digital Services", "Web Development", "SEO", "Digital Marketing", "DigitalAccess BD"],
  authors: [{ name: "DigitalAccess BD" }],
  openGraph: {
    title: "DigitalAccess BD",
    description: "Providing modern, premium digital services and fast access for our clients.",
    url: "https://digitalaccess-bd.com",
    siteName: "DigitalAccess BD",
    images: [
      {
        url: "/og-image.png", // Placeholder image path
        width: 1200,
        height: 630,
        alt: "DigitalAccess BD Cover Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

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
      lang="en"
      className={`${dmSans.variable} ${anekBangla.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" type="image/png" id="app-favicon" href="/Blue.png" />
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
              <main className="flex-1 max-md:pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
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
