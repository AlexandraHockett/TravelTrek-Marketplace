// File: app/[locale]/customer/tours/page.tsx
// Location: SUBSTITUIR o ficheiro existente em app/[locale]/customer/tours/page.tsx

import { Metadata } from "next";
import { getTranslations } from "@/lib/utils";
import { Tour } from "@/types";
import CustomerToursClient from "./client";

// ✅ CORRIGIDO: Interface padrão para páginas conforme organização
interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return {
    title: `${t.tours?.title || "Tours"} | TravelTrek`,
    description: t.tours?.subtitle || "Discover amazing tours in Portugal",
  };
}

// Server Component principal
export default async function CustomerToursPage({
  params,
  searchParams,
}: PageProps) {
  // ✅ CORRIGIDO: Await params conforme Next.js 15
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  // Carregar traduções no servidor
  const t = await getTranslations(locale);

  // Fetch tours from API (using searchParams for filters)
  const toursResponse = await fetch(
    `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/tours?${new URLSearchParams(
      Object.fromEntries(
        Object.entries(resolvedSearchParams).map(([key, value]) => [
          key,
          Array.isArray(value) ? value[0] : value || "",
        ])
      )
    )}`,
    {
      cache: "no-store", // Fresh data for each request
      headers: {
        Accept: "application/json",
      },
    }
  );

  let tours: Tour[] = [];

  if (toursResponse.ok) {
    const data = await toursResponse.json();
    tours = data.success ? data.data : [];
  } else {
    console.error("Failed to fetch tours:", toursResponse.statusText);
    // Fallback to empty array or mock data in development
    tours = [];
  }

  // ✅ CORRIGIDO: Passar apenas as props aceites pela interface CustomerToursClientProps
  return (
    <CustomerToursClient
      initialTours={tours}
      translations={t}
      locale={locale}
    />
  );
}
