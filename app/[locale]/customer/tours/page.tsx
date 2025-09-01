// File: app/[locale]/customer/tours/page.tsx
// Location: CREATE/REPLACE in app/[locale]/customer/tours/page.tsx

import { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "@/lib/utils";
import ToursClient from "./client";

interface ToursPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate metadata based on locale
export async function generateMetadata({
  params,
}: ToursPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return {
    title: `${t.tours.title} | TravelTrek`,
    description: t.tours.subtitle,
  };
}

export default async function ToursPage({
  params,
  searchParams,
}: ToursPageProps) {
  const { locale } = await params;
  const searchParamsResolved = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<ToursPageSkeleton />}>
        <ToursClient locale={locale} searchParams={searchParamsResolved} />
      </Suspense>
    </div>
  );
}

// Loading skeleton component
function ToursPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded w-64"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tours Grid Skeleton */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
