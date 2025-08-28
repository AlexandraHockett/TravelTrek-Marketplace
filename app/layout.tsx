import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TravelTrek - Descobre Experiências Únicas",
    template: "%s | TravelTrek",
  },
  description:
    "Conecta-te com anfitriões locais e descobre experiências de viagem autênticas e inesquecíveis.",
  keywords: [
    "viagens",
    "turismo",
    "experiências",
    "tours",
    "anfitriões locais",
    "aventuras",
    "portugal",
    "travel",
    "experiences",
  ],
  authors: [{ name: "TravelTrek Team" }],
  creator: "TravelTrek",
  publisher: "TravelTrek",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://traveltrek.pt",
    title: "TravelTrek - Descobre Experiências Únicas",
    description:
      "Conecta-te com anfitriões locais e descobre experiências de viagem autênticas e inesquecíveis.",
    siteName: "TravelTrek",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TravelTrek - Experiências de Viagem Autênticas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelTrek - Descobre Experiências Únicas",
    description:
      "Conecta-te com anfitriões locais e descobre experiências de viagem autênticas e inesquecíveis.",
    creator: "@traveltrek",
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
  verification: {
    // Add verification meta tags when available
    // google: "your-google-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 antialiased font-sans">
        <Navbar />
        <main className="flex-1 relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
