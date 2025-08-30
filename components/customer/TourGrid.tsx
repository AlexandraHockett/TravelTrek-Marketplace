// File: components/customer/TourGrid.tsx
// Location: SUBSTITUIR o ficheiro existente

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Tour, Translations } from "@/types";
import TourCard from "./TourCard";
import Button from "@/components/ui/Button";
import { Search, Filter, X, SlidersHorizontal, Grid, List } from "lucide-react";

interface TourGridProps {
  tours: Tour[];
  locale: string;
  translations: Translations;
  loading?: boolean;
  className?: string;
  initialCategoryFilter?: string | null; // New prop for category filtering
}

interface FilterOptions {
  searchQuery: string;
  priceRange: [number, number];
  difficulty: string;
  duration: string;
  rating: number;
  location: string;
  category: string; // New category filter
  sortBy: "price" | "rating" | "duration" | "newest" | "popular";
}

const TourGrid: React.FC<TourGridProps> = ({
  tours,
  locale,
  translations: t,
  loading = false,
  className,
  initialCategoryFilter = null,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    priceRange: [0, 1000],
    difficulty: "all",
    duration: "all",
    rating: 0,
    location: "all",
    category: "all",
    sortBy: "newest",
  });

  // Update category filter when initialCategoryFilter changes
  useEffect(() => {
    if (initialCategoryFilter && initialCategoryFilter !== filters.category) {
      setFilters((prev) => ({
        ...prev,
        category: initialCategoryFilter,
      }));
    } else if (!initialCategoryFilter && filters.category !== "all") {
      setFilters((prev) => ({
        ...prev,
        category: "all",
      }));
    }
  }, [initialCategoryFilter]);

  // Get unique filter values from tours
  const filterOptions = useMemo(() => {
    const locations = [...new Set(tours.map((tour) => tour.location))];
    const maxPrice = Math.max(...tours.map((tour) => tour.price));
    const difficulties = [...new Set(tours.map((tour) => tour.difficulty))];

    return {
      locations,
      difficulties,
      maxPrice: Math.ceil(maxPrice / 50) * 50, // Round to nearest 50
    };
  }, [tours]);

  // Helper function to check if tour matches category
  const tourMatchesCategory = (tour: Tour, categoryKey: string): boolean => {
    if (categoryKey === "all") return true;
    if (!tour.tags) return false;

    return tour.tags.some((tag) => {
      const lowerTag = tag.toLowerCase();
      switch (categoryKey) {
        case "food":
          return (
            lowerTag.includes("food") ||
            lowerTag.includes("wine") ||
            lowerTag.includes("gastronomy")
          );
        case "culture":
          return lowerTag.includes("culture") || lowerTag.includes("cultural");
        case "nature":
          return lowerTag.includes("nature") || lowerTag.includes("outdoor");
        case "adventure":
          return lowerTag.includes("adventure") || lowerTag.includes("hiking");
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
  };

  // Filter and sort tours
  const filteredTours = useMemo(() => {
    let filtered = tours.filter((tour) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText =
          `${tour.title} ${tour.description} ${tour.location} ${tour.tags?.join(" ") || ""}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }

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

      // Location filter
      if (filters.location !== "all" && tour.location !== filters.location) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && tour.rating < filters.rating) {
        return false;
      }

      // Category filter (both from internal filter and external)
      const categoryToCheck = initialCategoryFilter || filters.category;
      if (
        categoryToCheck !== "all" &&
        !tourMatchesCategory(tour, categoryToCheck)
      ) {
        return false;
      }

      return true;
    });

    // Sort filtered tours
    return filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        case "duration":
          return a.duration - b.duration;
        case "popular":
          return b.reviewCount - a.reviewCount;
        case "newest":
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });
  }, [tours, filters, initialCategoryFilter]);

  // Count active filters (excluding category if it's from external)
  const activeFiltersCount = useMemo(() => {
    let count = 0;

    if (filters.searchQuery) count++;
    if (filters.priceRange[1] < filterOptions.maxPrice) count++;
    if (filters.difficulty !== "all") count++;
    if (filters.location !== "all") count++;
    if (filters.rating > 0) count++;
    // Only count category filter if it's not from external source
    if (!initialCategoryFilter && filters.category !== "all") count++;

    return count;
  }, [filters, filterOptions.maxPrice, initialCategoryFilter]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      priceRange: [0, filterOptions.maxPrice],
      difficulty: "all",
      duration: "all",
      rating: 0,
      location: "all",
      category: "all",
      sortBy: "newest",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">
          {t.common?.loading || "A carregar..."}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header with search and view controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t.tours?.searchPlaceholder || "Pesquisar tours..."}
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters({ ...filters, searchQuery: e.target.value })
            }
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters({ ...filters, searchQuery: "" })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Results count */}
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {filteredTours.length === 1
              ? `1 ${t.tours?.result || "resultado"}`
              : `${filteredTours.length} ${t.tours?.results || "resultados"}`}
          </span>

          {/* View mode toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label="Vista em grelha"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label="Vista em lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Filter toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t.tours?.filters || "Filtros"}
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 ml-1">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Active category filter indicator */}
      {initialCategoryFilter && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">
            {t.tours?.filteredBy || "Filtrado por:"}
          </span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            {t.tours?.categories?.[initialCategoryFilter] ||
              initialCategoryFilter}
          </span>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.tours?.priceRange || "Preço"}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={filterOptions.maxPrice}
                  step={10}
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priceRange: [
                        filters.priceRange[0],
                        parseInt(e.target.value),
                      ],
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>€0</span>
                  <span>€{filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.tours?.location || "Localização"}
              </label>
              <select
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">
                  {t.tours?.allLocations || "Todas as localizações"}
                </option>
                {filterOptions.locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.tours?.difficulty?.label || "Dificuldade"}
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) =>
                  setFilters({ ...filters, difficulty: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">
                  {t.tours?.allDifficulties || "Todas as dificuldades"}
                </option>
                {filterOptions.difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {t.tours?.difficulty?.[difficulty.toLowerCase()] ||
                      difficulty}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.tours?.sortBy || "Ordenar por"}
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortBy: e.target.value as FilterOptions["sortBy"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">
                  {t.tours?.sort?.newest || "Mais recentes"}
                </option>
                <option value="popular">
                  {t.tours?.sort?.popular || "Mais populares"}
                </option>
                <option value="price">
                  {t.tours?.sort?.priceAsc || "Preço crescente"}
                </option>
                <option value="rating">
                  {t.tours?.sort?.rating || "Melhor avaliados"}
                </option>
                <option value="duration">
                  {t.tours?.sort?.duration || "Duração"}
                </option>
              </select>
            </div>
          </div>

          {/* Clear filters */}
          {activeFiltersCount > 0 && (
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={resetFilters}>
                {t.tours?.clearFilters || "Limpar Filtros"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t.tours?.noResults || "Nenhum resultado encontrado"}
          </h3>
          <p className="text-gray-600 mb-4">
            {t.tours?.noResultsDescription || "Tenta ajustar os filtros."}
          </p>
          <Button variant="outline" onClick={resetFilters}>
            {t.tours?.clearFilters || "Limpar Filtros"}
          </Button>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {filteredTours.map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              locale={locale}
              translations={t}
              compact={viewMode === "list"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TourGrid;
