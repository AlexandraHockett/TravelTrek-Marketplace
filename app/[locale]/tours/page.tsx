// ===================================================================
// 📁 app/[locale]/tours/page.tsx
// Location: CRIAR em app/[locale]/tours/page.tsx (não customer/tours)
// PÚBLICO: Página pública de browsing de tours
// ===================================================================

import { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "@/lib/utils";
import ToursClient from "./client";
import type { Tour, Locale } from "@/types";

interface ToursPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return {
    title: `${t.tours?.title || "Tours"} | TravelTrek`,
    description: t.tours?.subtitle || "Discover amazing tours and experiences",
    openGraph: {
      title: `${t.tours?.title || "Tours"} | TravelTrek`,
      description:
        t.tours?.subtitle || "Discover amazing tours and experiences",
    },
  };
}

// Fetch tours from API
async function getTours(searchParams: {
  [key: string]: string | string[] | undefined;
}): Promise<Tour[]> {
  try {
    const params = new URLSearchParams();

    // Add search parameters for filtering
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && typeof value === "string") {
        params.append(key, value);
      } else if (Array.isArray(value) && value[0]) {
        params.append(key, value[0]);
      }
    });

    const response = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/tours?${params.toString()}`,
      {
        cache: "no-store", // Always get fresh data
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch tours:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
}

// Server Component
export default async function ToursPage({
  params,
  searchParams,
}: ToursPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  // Load translations and tours in parallel
  const [t, tours] = await Promise.all([
    getTranslations(locale),
    getTours(resolvedSearchParams),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t.customerTours?.title || "Experiências Únicas"}
            </h1>
            <p className="text-xl text-gray-600">
              {t.customerTours?.subtitle ||
                "Descobre aventuras extraordinárias"}
            </p>
            <p className="text-gray-500 mt-2">
              {t.customerTours?.description ||
                "Explora experiências autênticas criadas por anfitriões locais apaixonados."}
            </p>
          </div>
        </div>
      </div>

      {/* Tours Client Component */}
      <Suspense fallback={<ToursLoading />}>
        <ToursClient
          initialTours={tours}
          locale={locale}
          searchParams={resolvedSearchParams}
        />
      </Suspense>
    </div>
  );
}

// Loading component
function ToursLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
