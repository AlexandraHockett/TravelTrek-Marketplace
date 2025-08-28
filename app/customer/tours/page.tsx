// File: app/customer/tours/page.tsx
// Location: Update this file in app/customer/tours/page.tsx
import React from "react";
import { Tour } from "@/types";
import TourGrid from "@/components/customer/TourGrid";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

async function getTours(): Promise<Tour[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/tours`, {
      cache: "no-store",
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!res.ok) {
      throw new Error("Failed to fetch tours");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
}

export default async function ToursPage() {
  const tours = await getTours();

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Descobre Experiências <span className="text-primary">Únicas</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conecta-te com anfitriões locais e vive aventuras autênticas que te
            vão marcar para sempre
          </p>
        </div>

        {/* Tours Grid */}
        <TourGrid tours={tours} />
      </div>
    </ErrorBoundary>
  );
}
