// File: app/[locale]/customer/tours/client.tsx
// Location: SUBSTITUIR o ficheiro existente

"use client";

import React, { useState, useMemo, useCallback } from "react";
import TourCard from "@/components/customer/TourCard";
import Button from "@/components/ui/Button";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Grid,
  List,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tour, Translations } from "@/types";

interface CustomerToursClientProps {
  initialTours: Tour[];
  translations: Translations; // ✅ FIXED: Now expects translations object
  locale: string;
}

interface FilterOptions {
  searchQuery: string;
  priceRange: [number, number];
  difficulty: string;
  duration: string;
  rating: number;
  location: string;
  category: string;
  sortBy: "price" | "rating" | "duration" | "newest" | "popular";
}

const CustomerToursClient: React.FC<CustomerToursClientProps> = ({
  initialTours,
  translations: t, // ✅ FIXED: Now receives translations object directly
  locale,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // Get unique filter values from tours
  const filterOptions = useMemo(() => {
    const locations = [...new Set(initialTours.map((tour) => tour.location))];
    const maxPrice = Math.max(...initialTours.map((tour) => tour.price));
    const difficulties = [
      ...new Set(initialTours.map((tour) => tour.difficulty)),
    ];
    const categories = [
      ...new Set(initialTours.flatMap((tour) => tour.tags || [])),
    ];

    return {
      locations,
      difficulties,
      categories,
      maxPrice: Math.ceil(maxPrice / 50) * 50,
    };
  }, [initialTours]);

  // Filter and sort tours
  const filteredTours = useMemo(() => {
    let filtered = [...initialTours];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tour) =>
          tour.title.toLowerCase().includes(query) ||
          tour.location.toLowerCase().includes(query) ||
          tour.description.toLowerCase().includes(query) ||
          tour.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply location filter
    if (filters.location !== "all") {
      filtered = filtered.filter((tour) => tour.location === filters.location);
    }

    // Apply difficulty filter
    if (filters.difficulty !== "all") {
      filtered = filtered.filter(
        (tour) => tour.difficulty.toLowerCase() === filters.difficulty
      );
    }

    // Apply price filter
    filtered = filtered.filter(
      (tour) =>
        tour.price >= filters.priceRange[0] &&
        tour.price <= filters.priceRange[1]
    );

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter((tour) => tour.rating >= filters.rating);
    }

    // Apply category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((tour) =>
        tour.tags?.some((tag) =>
          tag.toLowerCase().includes(filters.category.toLowerCase())
        )
      );
    }

    // Apply duration filter
    if (filters.duration !== "all") {
      const durationValue = parseInt(filters.duration);
      if (durationValue > 0) {
        filtered = filtered.filter((tour) => {
          if (durationValue === 1) return tour.duration <= 2;
          if (durationValue === 2)
            return tour.duration >= 3 && tour.duration <= 5;
          if (durationValue === 3)
            return tour.duration >= 6 && tour.duration <= 8;
          if (durationValue === 4) return tour.duration > 8;
          return true;
        });
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
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
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return filtered;
  }, [initialTours, filters]);

  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      priceRange: [0, 1000],
      difficulty: "all",
      duration: "all",
      rating: 0,
      location: "all",
      category: "all",
      sortBy: "newest",
    });
  };

  const updateFilter = useCallback(
    <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t.tours?.title || "Descobre Experiências Únicas"}
              </h1>
              <p className="mt-2 text-gray-600">
                {t.tours?.subtitle ||
                  "Conecta-te com anfitriões locais autênticos"}
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    t.tours?.searchPlaceholder || "Pesquisar tours..."
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.searchQuery}
                  onChange={(e) => updateFilter("searchQuery", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "primary" : "default"}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {t.tours?.filters || "Filtros"}
              </Button>

              {/* Results count */}
              <span className="text-sm text-gray-600">
                {t.tours?.showingResults
                  ?.replace("{count}", filteredTours.length.toString())
                  ?.replace("{total}", initialTours.length.toString()) ||
                  `A mostrar ${filteredTours.length} de ${initialTours.length} tours`}
              </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <Button
                  onClick={() => setViewMode("grid")}
                  variant={viewMode === "grid" ? "primary" : "default"}
                  size="sm"
                  className="rounded-none border-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setViewMode("list")}
                  variant={viewMode === "list" ? "primary" : "default"}
                  size="sm"
                  className="rounded-none border-none border-l"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Sort dropdown */}
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.sortBy}
                onChange={(e) =>
                  updateFilter(
                    "sortBy",
                    e.target.value as FilterOptions["sortBy"]
                  )
                }
              >
                <option value="newest">
                  {t.tours?.sort?.newest || "Mais Recentes"}
                </option>
                <option value="popular">
                  {t.tours?.sort?.popular || "Mais Populares"}
                </option>
                <option value="price">
                  {t.tours?.sort?.priceAsc || "Preço: Baixo para Alto"}
                </option>
                <option value="rating">
                  {t.tours?.sort?.rating || "Melhor Classificados"}
                </option>
                <option value="duration">
                  {t.tours?.sort?.duration || "Duração"}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t.tours?.filters || "Filtros"}
                  </h3>
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {t.tours?.clearFilters || "Limpar"}
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      {t.tours?.location || "Localização"}
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={filters.location}
                      onChange={(e) => updateFilter("location", e.target.value)}
                    >
                      <option value="all">
                        {t.tours?.allLocations || "Todas as Localizações"}
                      </option>
                      {filterOptions.locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      {t.tours?.priceRange || "Faixa de Preço"}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max={filterOptions.maxPrice}
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          updateFilter("priceRange", [
                            filters.priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>€0</span>
                        <span>€{filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      {t.tours?.difficulty?.label || "Dificuldade"}
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={filters.difficulty}
                      onChange={(e) =>
                        updateFilter("difficulty", e.target.value)
                      }
                    >
                      <option value="all">
                        {t.tours?.allDifficulties || "Todas as Dificuldades"}
                      </option>
                      <option value="easy">
                        {t.tours?.difficulty?.easy || "Fácil"}
                      </option>
                      <option value="moderate">
                        {t.tours?.difficulty?.moderate || "Moderado"}
                      </option>
                      <option value="challenging">
                        {t.tours?.difficulty?.challenging || "Desafiante"}
                      </option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      {t.tours?.category || "Categoria"}
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={filters.category}
                      onChange={(e) => updateFilter("category", e.target.value)}
                    >
                      <option value="all">{t.common?.all || "Todas"}</option>
                      {filterOptions.categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      {t.tours?.rating || "Classificação Mínima"}
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={filters.rating}
                      onChange={(e) =>
                        updateFilter("rating", parseFloat(e.target.value))
                      }
                    >
                      <option value={0}>
                        {t.tours?.anyRating || "Qualquer Classificação"}
                      </option>
                      <option value={4}>
                        4+ {t.tours?.stars || "Estrelas"}
                      </option>
                      <option value={4.5}>
                        4.5+ {t.tours?.stars || "Estrelas"}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tours Grid/List */}
          <div className="flex-1">
            {filteredTours.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t.tours?.noToursFound || "Nenhum tour encontrado"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t.tours?.noToursFoundDesc ||
                    "Tente ajustar os critérios de pesquisa."}
                </p>
                <Button onClick={clearFilters}>
                  {t.tours?.clearFilters || "Limpar Filtros"}
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                )}
              >
                {filteredTours.map((tour) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    locale={locale}
                    translations={t} // ✅ FIXED: Pass translations object
                    compact={viewMode === "list"}
                    showQuickBook={false}
                    showWishlist={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerToursClient;
