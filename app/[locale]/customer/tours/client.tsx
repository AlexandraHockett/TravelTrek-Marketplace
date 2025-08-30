// File: app/[locale]/customer/tours/client.tsx
// Location: SUBSTITUIR o ficheiro existente

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

// Categoria interface para tipagem
interface CategoryData {
  name: string;
  count: number;
  icon: string;
  key: string;
}

export default function CustomerToursClient({
  initialTours,
  translations: t,
  locale,
}: CustomerToursClientProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Statistics
  const totalTours = initialTours.length;
  const averageRating =
    totalTours > 0
      ? (
          initialTours.reduce((sum, tour) => sum + tour.rating, 0) / totalTours
        ).toFixed(1)
      : "0.0";
  const totalReviews = initialTours.reduce(
    (sum, tour) => sum + tour.reviewCount,
    0
  );
  const uniqueLocations = new Set(initialTours.map((tour) => tour.location))
    .size;

  // Calculate dynamic popular categories from tour tags/data
  const calculatePopularCategories = (): CategoryData[] => {
    const categoryMap = new Map<string, number>();

    // Count occurrences of each category based on tour tags
    initialTours.forEach((tour) => {
      if (tour.tags) {
        tour.tags.forEach((tag) => {
          const lowerTag = tag.toLowerCase();
          // Map common tags to category keys
          let categoryKey = "";

          if (
            lowerTag.includes("food") ||
            lowerTag.includes("wine") ||
            lowerTag.includes("gastronomy")
          ) {
            categoryKey = "food";
          } else if (
            lowerTag.includes("culture") ||
            lowerTag.includes("cultural")
          ) {
            categoryKey = "culture";
          } else if (
            lowerTag.includes("nature") ||
            lowerTag.includes("outdoor")
          ) {
            categoryKey = "nature";
          } else if (
            lowerTag.includes("adventure") ||
            lowerTag.includes("hiking")
          ) {
            categoryKey = "adventure";
          } else if (
            lowerTag.includes("history") ||
            lowerTag.includes("historical")
          ) {
            categoryKey = "history";
          } else if (lowerTag.includes("beach") || lowerTag.includes("coast")) {
            categoryKey = "beaches";
          } else if (
            lowerTag.includes("walk") ||
            lowerTag.includes("walking")
          ) {
            categoryKey = "walking";
          } else if (lowerTag.includes("family")) {
            categoryKey = "family";
          } else if (lowerTag.includes("art") || lowerTag.includes("museum")) {
            categoryKey = "art";
          } else if (
            lowerTag.includes("night") ||
            lowerTag.includes("evening")
          ) {
            categoryKey = "nightlife";
          }

          if (categoryKey) {
            categoryMap.set(
              categoryKey,
              (categoryMap.get(categoryKey) || 0) + 1
            );
          }
        });
      }
    });

    // Create categories with translations and icons
    const categories: CategoryData[] = [
      {
        key: "food",
        name: t.tours?.categories?.food || "Gastronomia",
        count: categoryMap.get("food") || 0,
        icon: "🍷",
      },
      {
        key: "culture",
        name: t.tours?.categories?.culture || "Cultura",
        count: categoryMap.get("culture") || 0,
        icon: "🏛️",
      },
      {
        key: "nature",
        name: t.tours?.categories?.nature || "Natureza",
        count: categoryMap.get("nature") || 0,
        icon: "🌿",
      },
      {
        key: "adventure",
        name: t.tours?.categories?.adventure || "Aventura",
        count: categoryMap.get("adventure") || 0,
        icon: "🚴",
      },
      {
        key: "history",
        name: t.tours?.categories?.history || "História",
        count: categoryMap.get("history") || 0,
        icon: "📜",
      },
      {
        key: "beaches",
        name: t.tours?.categories?.beaches || "Praias",
        count: categoryMap.get("beaches") || 0,
        icon: "🏖️",
      },
      {
        key: "walking",
        name: t.tours?.categories?.walking || "Caminhadas",
        count: categoryMap.get("walking") || 0,
        icon: "🚶",
      },
      {
        key: "family",
        name: t.tours?.categories?.family || "Família",
        count: categoryMap.get("family") || 0,
        icon: "👨‍👩‍👧‍👦",
      },
      {
        key: "art",
        name: t.tours?.categories?.art || "Arte",
        count: categoryMap.get("art") || 0,
        icon: "🎨",
      },
      {
        key: "nightlife",
        name: t.tours?.categories?.nightlife || "Vida Noturna",
        count: categoryMap.get("nightlife") || 0,
        icon: "🌙",
      },
    ];

    // Return only categories with tours, sorted by count
    return categories
      .filter((cat) => cat.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Show max 8 categories
  };

  const popularCategories = calculatePopularCategories();

  // Filter tours based on selected category
  const getFilteredTours = () => {
    if (!selectedCategory) return initialTours;

    return initialTours.filter((tour) => {
      if (!tour.tags) return false;

      return tour.tags.some((tag) => {
        const lowerTag = tag.toLowerCase();
        switch (selectedCategory) {
          case "food":
            return (
              lowerTag.includes("food") ||
              lowerTag.includes("wine") ||
              lowerTag.includes("gastronomy")
            );
          case "culture":
            return (
              lowerTag.includes("culture") || lowerTag.includes("cultural")
            );
          case "nature":
            return lowerTag.includes("nature") || lowerTag.includes("outdoor");
          case "adventure":
            return (
              lowerTag.includes("adventure") || lowerTag.includes("hiking")
            );
          case "history":
            return (
              lowerTag.includes("history") || lowerTag.includes("historical")
            );
          case "beaches":
            return lowerTag.includes("beach") || lowerTag.includes("coast");
          case "walking":
            return lowerTag.includes("walk") || lowerTag.includes("walking");
          case "family":
            return lowerTag.includes("family");
          case "art":
            return lowerTag.includes("art") || lowerTag.includes("museum");
          case "nightlife":
            return lowerTag.includes("night") || lowerTag.includes("evening");
          default:
            return false;
        }
      });
    });
  };

  const handleCategoryClick = (categoryKey: string) => {
    if (selectedCategory === categoryKey) {
      // If clicking the same category, deselect it
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryKey);
    }
  };

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

        {/* Popular Categories */}
        {popularCategories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                {t.tours?.popularCategories || "Categorias Populares"}
              </h2>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mt-2 sm:mt-0 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {t.tours?.clearFilters || "Limpar Filtro"}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {popularCategories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleCategoryClick(category.key)}
                  className={`bg-white border rounded-lg p-4 hover:shadow-md transition-all duration-200 text-center group ${
                    selectedCategory === category.key
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  aria-pressed={selectedCategory === category.key}
                >
                  <div
                    className={`text-2xl mb-2 transition-transform ${
                      selectedCategory === category.key
                        ? "scale-110"
                        : "group-hover:scale-110"
                    }`}
                  >
                    {category.icon}
                  </div>
                  <div
                    className={`font-medium text-sm mb-1 ${
                      selectedCategory === category.key
                        ? "text-blue-900"
                        : "text-gray-900"
                    }`}
                  >
                    {category.name}
                  </div>
                  <div
                    className={`text-xs ${
                      selectedCategory === category.key
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {category.count} {category.count === 1 ? "tour" : "tours"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tours Grid with Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <TourGrid
            tours={getFilteredTours()}
            locale={locale}
            translations={t}
            loading={loading}
            initialCategoryFilter={selectedCategory}
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
