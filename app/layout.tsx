// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pro Trading Journal",
  description: "Your Account Is The Scoreboard",
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
          <meta
            name="viewport"
            content="width=device-width, initial-scale=0.9, maximum-scale=0.9, user-scalable=no"
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
