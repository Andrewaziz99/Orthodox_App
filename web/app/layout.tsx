// app/layout.tsx
// Root layout — renders <html> and <body> as a server component
// so that Next.js can manage <head> metadata properly.

import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import LanguageProvider from "../components/providers/LanguageProvider";
import HtmlDirectionSetter from "../components/HtmlDirectionSetter";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import TransitionScreen from "../components/layout/TransitionScreen";
import SmoothScrollProvider from "../components/providers/SmoothScrollProvider";
import { ToastProvider } from "../components/ui/Toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Load Cairo font — optimized to only the weights we actually use
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://orthodox-bible-school-vercel.app"),
  title: {
    template: "%s | أرثوذكسي للدراسات الكتابية",
    default: "أرثوذكسي للدراسات الكتابية للأطفال",
  },
  description:
    "مركز يقدم دراسة كتابية أرثوذكسية قبطية منهجية للأطفال والنشء من خلال مناهج متدرجة ومنصة رقمية متكاملة",
  keywords: ["مدرسة الكتاب", "دراسة كتابية", "أطفال", "كنيسة قبطية", "مناهج تعليمية"],
  icons: {
    icon: "/assets/favicon.ico",
    apple: "/assets/logo.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "أرثوذكسي",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "أرثوذكسي للدراسات الكتابية للأطفال",
    description: "رحلة متكاملة للدراسة الكتابية عبر مناهج متدرجة ومنصة رقمية حديثة",
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <body className="font-cairo antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-teal-600 focus:font-semibold"
        >
          تخطي إلى المحتوى الرئيسي
        </a>
        <LanguageProvider>
          <HtmlDirectionSetter />
          <ToastProvider />
          <TransitionScreen />
          <SmoothScrollProvider>
            <Header />
            <main id="main-content" className="flex-grow">
              {children}
            </main>
            <Footer />
          </SmoothScrollProvider>
        </LanguageProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered');
                  }, function(err) {
                    console.log('SW failed: ', err);
                  });
                });
              }
            `,
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
