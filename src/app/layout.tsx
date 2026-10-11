import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { getSiteUrl, isIndexingAllowed, siteConfig } from "@/config/site";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { OnboardingProvider } from "@/components/forms/OnboardingProvider";
import { ToastProvider } from "@/components/ui/Toaster";
import "./globals.css";

// Self-hosted so builds never depend on reaching Google Fonts (Hostinger's
// build environment blocks it). Variable font covering weights 200–800.
const manrope = localFont({
  src: [{ path: "./fonts/manrope-latin.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

const siteUrl = getSiteUrl();
const indexable = isIndexingAllowed();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.brandName} | Leads, calls, and campaign support for B2B buyers`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.brandName,
  keywords: [
    "lead generation",
    "inbound calls",
    "pay per call",
    "insurance leads",
    "final expense leads",
    "Medicare leads",
    "home services leads",
    "student loan leads",
    "HVAC leads",
    "roofing leads",
    "debt settlement leads",
    "tort leads",
    "SSDI leads",
    "MVA leads",
    "customer acquisition partner",
    "Westlink Solution",
  ],
  category: "business",
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
  openGraph: {
    type: "website",
    siteName: siteConfig.brandName,
    locale: "en_US",
    url: siteUrl,
    title: `${siteConfig.brandName} | Customer acquisition for insurance, home services, financial, and legal teams`,
    description: siteConfig.description,
  },
  formatDetection: { telephone: true, email: true, address: true },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.brandName,
    description: siteConfig.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        <ToastProvider>
          <OnboardingProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          </OnboardingProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
