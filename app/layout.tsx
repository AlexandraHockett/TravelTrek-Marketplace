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
  ],
  authors: [{ name: "TravelTrek Team" }],
  creator: "TravelTrek",
  publisher: "TravelTrek",
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://traveltrek.pt",
    title: "TravelTrek - Descobre Experiências Únicas",
    description:
      "Conecta-te com anfitriões locais e descobre experiências de viagem autênticas e inesquecíveis.",
    siteName: "TravelTrek",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body className="min-h-screen flex flex-col bg-surface antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
