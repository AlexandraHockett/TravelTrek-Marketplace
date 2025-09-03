// ===================================================================
// 📁 app/[locale]/layout.tsx
// Location: REPLACE existing app/[locale]/layout.tsx
// ===================================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import SessionProvider from "@/components/auth/SessionProvider";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TravelTrek - Discover Unique Experiences | Marketplace Showcase",
    template: "%s | TravelTrek",
  },
  description:
    "Connect with local hosts and discover authentic travel experiences. Built with Next.js 15 + React 19 with full authentication and internationalization.",
  keywords: ["travel", "tours", "experiences", "local hosts", "marketplace"],
  authors: [{ name: "TravelTrek Team" }],
  openGraph: {
    type: "website",
    siteName: "TravelTrek",
    title: "TravelTrek - Discover Unique Experiences",
    description:
      "Connect with local hosts and discover authentic travel experiences.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TravelTrek - Discover Unique Experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelTrek - Discover Unique Experiences",
    description:
      "Connect with local hosts and discover authentic travel experiences.",
  },
};

interface LayoutParams {
  locale: string;
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<LayoutParams>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 antialiased font-sans">
        <SessionProvider>
          <Navbar />
          <main className="flex-1 relative">{children}</main>
          <Footer params={{ locale }} />
        </SessionProvider>
      </body>
    </html>
  );
}
