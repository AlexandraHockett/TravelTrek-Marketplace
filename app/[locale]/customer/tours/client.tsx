// File: app/[locale]/customer/tours/client.tsx
// Location: Criar novo ficheiro

"use client";

import React, { useState } from "react";
import type { Tour, Translations } from "@/types";
import TourGrid from "@/components/customer/TourGrid";
import { MapPin, Star, Calendar, Users } from "lucide-react";

interface CustomerToursClientProps {
  initialTours: Tour[];
  translations: Translations;
  locale: string;
}

export default function CustomerToursClient({
  initialTours,
  translations: t,
  locale,
}: CustomerToursClientProps) {
  const [loading, setLoading] = useState(false);

  // Statistics
  const totalTours = initialTours.length;
  const averageRating = (
    initialTours.reduce((sum, tour) => sum + tour.rating, 0) / totalTours
  ).toFixed(1);
  const totalReviews = initialTours.reduce(
    (sum, tour) => sum + tour.reviewCount,
    0
  );
  const uniqueLocations = new Set(initialTours.map((tour) => tour.location))
    .size;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.pages?.customerTours?.title || "Tours e Experiências"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.pages?.customerTours?.subtitle ||
              "Descubra experiências únicas em Portugal com anfitriões locais verificados"}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalTours}</div>
            <div className="text-sm text-gray-600">
              {t.tours?.availableTours || "Tours Disponíveis"}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {averageRating}
            </div>
            <div className="text-sm text-gray-600">
              {t.tours?.averageRating || "Avaliação Média"}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalReviews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              {t.tours?.totalReviews || "Avaliações"}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {uniqueLocations}
            </div>
            <div className="text-sm text-gray-600">
              {t.tours?.destinations || "Destinos"}
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t.tours?.popularCategories || "Categorias Populares"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              {
                name: t.tours?.categories?.food || "Gastronomia",
                count: 12,
                icon: "🍷",
              },
              {
                name: t.tours?.categories?.culture || "Cultura",
                count: 8,
                icon: "🏛️",
              },
              {
                name: t.tours?.categories?.nature || "Natureza",
                count: 6,
                icon: "🌿",
              },
              {
                name: t.tours?.categories?.adventure || "Aventura",
                count: 4,
                icon: "🚴",
              },
              {
                name: t.tours?.categories?.history || "História",
                count: 10,
                icon: "📜",
              },
              {
                name: t.tours?.categories?.beaches || "Praias",
                count: 5,
                icon: "🏖️",
              },
            ].map((category) => (
              <button
                key={category.name}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 text-center group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <div className="font-medium text-gray-900 text-sm">
                  {category.name}
                </div>
                <div className="text-xs text-gray-500">
                  {category.count} tours
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tours Grid with Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <TourGrid
            tours={initialTours}
            locale={locale}
            translations={t}
            loading={loading}
          />
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              {t.tours?.hostCta?.title || "Tens um negócio de turismo?"}
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {t.tours?.hostCta?.description ||
                "Junta-te à nossa plataforma e alcança milhares de viajantes interessados nas tuas experiências únicas."}
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {t.tours?.hostCta?.button || "Tornar-me Anfitrião"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
