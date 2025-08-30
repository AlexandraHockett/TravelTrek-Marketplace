// File: app/[locale]/layout.tsx
// Location: REPLACE your existing app/[locale]/layout.tsx with this updated version

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import DevelopmentBanner from "@/components/shared/DevelopmentBanner"; // 🆕 NEW IMPORT
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TravelTrek - Discover Unique Experiences | Development Showcase", // Updated title
    template: "%s | TravelTrek",
  },
  description:
    "Connect with local hosts and discover authentic travel experiences. Technical demonstration of Next.js 15 + React 19 with full internationalization.",
};

interface LayoutParams {
  locale: string;
}

// Make the layout async
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<LayoutParams>;
}) {
  // Await the params promise
  const { locale } = await params;

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 antialiased font-sans">
        {/* 🆕 ADD DEVELOPMENT BANNER HERE */}
        <DevelopmentBanner locale={locale} />

        <Navbar />
        <main className="flex-1 relative">{children}</main>
        {/* Pass resolved locale to Footer */}
        <Footer params={{ locale }} />
      </body>
    </html>
  );
}
