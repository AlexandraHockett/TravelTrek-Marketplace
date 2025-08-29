import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TravelTrek - Discover Unique Experiences",
    template: "%s | TravelTrek",
  },
  description: "Connect with local hosts and discover authentic travel experiences.",
};

// Definindo o tipo de params manualmente
interface LayoutParams {
  locale: string;
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: LayoutParams; // Tipo explícito para params
}) {
  return (
    <html lang={params.locale} className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 antialiased font-sans">
        <Navbar />
        <main className="flex-1 relative">{children}</main>
        <Footer params={params} />
      </body>
    </html>
  );
}