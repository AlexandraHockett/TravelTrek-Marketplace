// ===================================================================
// 📁 app/[locale]/tours/[id]/page.tsx
// Location: CRIAR em app/[locale]/tours/[id]/page.tsx
// Individual tour details page
// ===================================================================

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Tour, Locale } from "@/types";
import TourDetailClient from "../../customer/tours/[id]/client";

interface TourDetailPageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: TourDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const tour = await getTour(id);

  if (!tour) {
    return {
      title: "Tour not found | TravelTrek",
      description: "The requested tour could not be found.",
    };
  }

  return {
    title: `${tour.title} | TravelTrek`,
    description: tour.shortDescription || tour.description.substring(0, 160),
    openGraph: {
      title: tour.title,
      description: tour.shortDescription || tour.description.substring(0, 160),
      images: [tour.image],
      type: "website",
    },
    keywords: [
      tour.location,
      tour.difficulty,
      ...tour.tags,
      "tour",
      "travel",
      "experience",
    ].join(", "),
  };
}

// Fetch tour from API
async function getTour(id: string): Promise<Tour | null> {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/tours/${id}`,
      {
        cache: "no-store", // Always get fresh data
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Tour not found
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching tour:", error);
    return null;
  }
}

// Server Component
export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { locale, id } = await params;

  // Fetch tour data
  const tour = await getTour(id);

  // Show 404 if tour not found
  if (!tour) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<TourDetailLoading />}>
        <TourDetailClient tour={tour} locale={locale} />
      </Suspense>
    </div>
  );
}

// Loading component
function TourDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section skeleton */}
      <div className="relative h-96 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-8 left-8 right-8">
          <div className="h-8 bg-white bg-opacity-20 rounded mb-4"></div>
          <div className="h-6 bg-white bg-opacity-20 rounded w-2/3"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6 mb-6">
              <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6">
              <div className="h-12 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
