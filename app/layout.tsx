// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
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
        elements: {
          card: "bg-[#0f0f23]/95 backdrop-blur-3xl border border-[#6366f1]/50 shadow-2xl rounded-3xl",
          modalBackdrop: "bg-black/90 backdrop-blur-xl",
          headerTitle:
            "text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent",
          formFieldInput:
            "bg-[#1a1a2e]/80 border border-white/20 focus:border-[#8b5cf6] text-[#e0e7ff] rounded-2xl py-5 text-xl",
          formButtonPrimary:
            "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-black font-bold text-xl py-6 rounded-2xl shadow-2xl",
          socialButtonsBlockButton:
            "bg-gradient-to-r from-[#4285f4] to-[#34a853] hover:from-[#3367d6] hover:to-[#2d8e4d] text-white font-bold shadow-lg",
          footerActionLink: "text-cyan-400 hover:text-cyan-300 font-bold",
        },
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "blockButton",
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
        </body>
      </html>
    </ClerkProvider>
  );
}
