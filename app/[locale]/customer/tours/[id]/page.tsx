// File: app/[locale]/customer/tours/[id]/page.tsx
// Location: CREATE in app/[locale]/customer/tours/[id]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTranslations } from "@/lib/utils";
import TourDetailClient from "./client";

interface TourDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

// Generate metadata based on tour
export async function generateMetadata({
  params,
}: TourDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations(locale);

  // Fetch tour data for metadata (in real app)
  // For now, using generic metadata
  return {
    title: `${t.tourDetails.overview} | TravelTrek`,
    description: t.tours.subtitle,
  };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { locale, id } = await params;

  // Validate tour ID
  if (!id) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<TourDetailSkeleton />}>
        <TourDetailClient locale={locale} tourId={id} />
      </Suspense>
    </div>
  );
}

// Loading skeleton for tour detail
function TourDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Skeleton */}
      <div className="relative h-96 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-8 left-8 space-y-2">
          <div className="h-8 bg-white/20 rounded w-64"></div>
          <div className="h-4 bg-white/20 rounded w-48"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>

          {/* Booking form skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 animate-pulse sticky top-8">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
