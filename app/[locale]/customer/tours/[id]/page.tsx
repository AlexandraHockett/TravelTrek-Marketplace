// File: app/[locale]/customer/tours/[id]/page.tsx
// Location: CREATE in app/[locale]/customer/tours/[id]/page.tsx

import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "@/lib/utils";
import TourDetailClient from "./client";
import { Tour, Locale } from "@/types";

interface TourDetailPageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: TourDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const tour = await getTour(id);
  const t = await getTranslations(locale);

  if (!tour) {
    return {
      title: `${t.common?.error || "Error"} | TravelTrek`,
      description: t.api?.errors?.tourNotFound || "Tour not found",
    };
  }

  return {
    title: `${tour.title} | TravelTrek`,
    description: tour.shortDescription || tour.description.substring(0, 160),
    openGraph: {
      title: tour.title,
      description: tour.shortDescription || tour.description.substring(0, 160),
      images: [tour.image],
    },
  };
}

// Fixed getTour function with proper error handling
async function getTour(id: string): Promise<Tour | null> {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/tours/${id}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return null; // Tour not found
      }
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    // ✅ FIXED: API returns { success: true, data: tour }
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching tour:", error);
    return null;
  }
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { locale, id } = await params;
  const tour = await getTour(id);

  // Handle tour not found
  if (!tour) {
    notFound(); // This will show the 404 page
  }

  return (
    <Suspense fallback={<TourDetailSkeleton />}>
      <TourDetailClient tour={tour} locale={locale} />
    </Suspense>
  );
}

// Loading skeleton component
function TourDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero skeleton */}
      <div className="relative h-96 md:h-[500px] bg-gray-200 animate-pulse"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content skeleton */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
              <div className="grid grid-cols-4 gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
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
            <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse sticky top-8">
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
