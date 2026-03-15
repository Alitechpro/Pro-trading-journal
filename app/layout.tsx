// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://protradingjournal.com"), // ← Updated to your new domain!
  title: {
    default: "Pro Trading Journal – Professional Trading Log & Analytics",
    template: "%s | Pro Trading Journal",
  },
  description:
    "Pro Trading Journal: The professional tool to track trades, set compounding goals, analyze performance, manage risk, and journal trading psychology. Freemium plan available – upgrade to Pro for unlimited trades, AI insights, broker imports & more.",
  keywords: [
    "pro trading journal",
    "professional trading journal",
    "trading journal app",
    "stock trading tracker",
    "forex journal",
    "crypto trading log",
    "trading psychology journal",
    "compound interest trading",
    "risk management tool",
    "best trading journal 2026",
    "Bitcoin trading journal",
    "forex trading journal",
    "crypto trading journal",
    "trading performance analytics",
  ],
  authors: [{ name: "Alitechpro", url: "https://github.com/Alitechpro" }],
  openGraph: {
    title: "Pro Trading Journal – Compound Your Way to Freedom",
    description:
      "Your Account Is The Scoreboard. Track trades professionally, set goals, and master compounding. Upgrade to Pro for advanced analytics and AI-powered insights.",
    url: "https://protradingjournal.com",
    siteName: "Pro Trading Journal",
    images: [
      {
        url: "/og-image.jpg", // Ensure this 1200x630 image exists in /public/
        width: 1200,
        height: 630,
        alt: "Pro Trading Journal – Professional Trading Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pro Trading Journal",
    description:
      "Compound is the 8th wonder. Track, analyze, and scale your trading professionally.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  // Optional but recommended: Canonical to avoid duplicate content
  alternates: {
    canonical: "https://protradingjournal.com",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#8b5cf6",
          colorBackground: "#0f0f23",
          colorInputBackground: "#1a1a2e",
          colorInputText: "#e0e7ff",
          colorText: "#ffffff",
          borderRadius: "16px",
        },
      }}
    >
      <html lang="en">
        <head>
          {/* Basic structured data for better rich results */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Pro Trading Journal",
                applicationCategory: "FinanceApplication",
                operatingSystem: "Web",
                offers: [
                  {
                    "@type": "Offer",
                    price: "0", // Free tier
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                    
                  },
                  {
                    "@type": "Offer",
                    name: "Pro Plan",
                    price: "29",
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                  },
                ],
                description:
                  "Professional trading journal for tracking trades, goals, performance analysis, and compounding mastery. Freemium with Pro subscription upgrades.",
                url: "https://protradingjournal.com",
                author: {
                  "@type": "Person",
                  name: "Alitechpro",
                },
              }),
            }}
          />
        </head>
        <body className="bg-black text-white antialiased overflow-x-hidden">
          {children}
          <SpeedInsights />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
