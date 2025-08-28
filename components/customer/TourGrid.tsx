// File: components/customer/TourGrid.tsx
// Location: Create this file in components/customer/TourGrid.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Tour } from "@/types";
import TourCard from "./TourCard";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";

interface TourGridProps {
  tours: Tour[];
  loading?: boolean;
  className?: string;
}

interface FilterOptions {
  priceRange: [number, number];
  difficulty: string;
  duration: string;
  rating: number;
  location: string;
  sortBy: "price" | "rating" | "duration" | "newest";
}

const TourGrid: React.FC<TourGridProps> = ({
  tours,
  loading = false,
  className,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 1000],
    difficulty: "all",
    duration: "all",
    rating: 0,
    location: "all",
    sortBy: "newest",
  });

  // Get unique filter values from tours
  const filterOptions = useMemo(() => {
    const locations = [...new Set(tours.map((tour) => tour.location))];
    const maxPrice = Math.max(...tours.map((tour) => tour.price));

    return {
      locations,
      maxPrice: Math.ceil(maxPrice / 50) * 50, // Round to nearest 50
    };
  }, [tours]);

  // Filter and sort tours
  const filteredTours = useMemo(() => {
    let filtered = tours.filter((tour) => {
      // Price range filter
      if (
        tour.price < filters.priceRange[0] ||
        tour.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Difficulty filter
      if (
        filters.difficulty !== "all" &&
        tour.difficulty !== filters.difficulty
      ) {
        return false;
      }

      // Duration filter
      if (filters.duration !== "all") {
        const duration = parseInt(filters.duration);
        if (filters.duration === "short" && tour.duration > 4) return false;
        if (
          filters.duration === "medium" &&
          (tour.duration <= 4 || tour.duration >= 8)
        )
          return false;
        if (filters.duration === "long" && tour.duration < 8) return false;
      }

      // Rating filter
      if (tour.rating < filters.rating) {
        return false;
      }

      // Location filter
      if (filters.location !== "all" && tour.location !== filters.location) {
        return false;
      }

      return true;
    });

    // Sort tours
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        case "duration":
          return a.duration - b.duration;
        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return filtered;
  }, [tours, filters]);

  const resetFilters = () => {
    setFilters({
      priceRange: [0, filterOptions.maxPrice],
      difficulty: "all",
      duration: "all",
      rating: 0,
      location: "all",
      sortBy: "newest",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Filters Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredTours.length} Tour{filteredTours.length !== 1 ? "s" : ""}
          </h2>
          <p className="text-gray-600">Descobre experiências incríveis</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            }
          >
            Filtros
          </Button>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
            }
            className="text-sm min-w-0"
          >
            <option value="newest">Mais Recentes</option>
            <option value="price">Preço (Menor)</option>
            <option value="rating">Melhor Avaliação</option>
            <option value="duration">Duração</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-6 rounded-lg space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Filtrar Tours</h3>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Limpar Filtros
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço (€{filters.priceRange[0]} - €{filters.priceRange[1]})
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max={filterOptions.maxPrice}
                  step="10"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: [
                        prev.priceRange[0],
                        parseInt(e.target.value),
                      ],
                    }))
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dificuldade
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    difficulty: e.target.value,
                  }))
                }
                className="w-full text-sm"
              >
                <option value="all">Todas</option>
                <option value="Easy">Fácil</option>
                <option value="Moderate">Moderada</option>
                <option value="Challenging">Desafiante</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração
              </label>
              <select
                value={filters.duration}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, duration: e.target.value }))
                }
                className="w-full text-sm"
              >
                <option value="all">Qualquer</option>
                <option value="short">Até 4h</option>
                <option value="medium">4-8h</option>
                <option value="long">8h+</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avaliação Mínima
              </label>
              <select
                value={filters.rating}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    rating: parseFloat(e.target.value),
                  }))
                }
                className="w-full text-sm"
              >
                <option value="0">Qualquer</option>
                <option value="3">3+ Estrelas</option>
                <option value="4">4+ Estrelas</option>
                <option value="4.5">4.5+ Estrelas</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização
              </label>
              <select
                value={filters.location}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, location: e.target.value }))
                }
                className="w-full text-sm"
              >
                <option value="all">Todas</option>
                {filterOptions.locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tours Grid */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sem resultados
          </h3>
          <p className="text-gray-600 mb-4">
            Não encontrámos tours com estes critérios. Tenta ajustar os filtros.
          </p>
          <Button variant="outline" onClick={resetFilters}>
            Limpar Filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TourGrid;
