// File: app/[locale]/customer/tours/client.tsx
// Location: CREATE in app/[locale]/customer/tours/client.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Loader2,
  Grid,
  List,
} from "lucide-react";
import { Tour } from "@/types";
import { useTranslations } from "@/lib/i18n";
import TourCard from "@/components/customer/TourCard";

interface ToursClientProps {
  locale: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

type SortOption = "price-asc" | "price-desc" | "rating" | "newest";
type ViewMode = "grid" | "list";

export default function ToursClient({
  locale,
  searchParams,
}: ToursClientProps) {
  const t = useTranslations(locale);

  // State management
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(
    (searchParams.search as string) || ""
  );
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  // Available filter options (would come from API in real app)
  const categories = [
    "Cultural",
    "Adventure",
    "Food & Drink",
    "Nature",
    "Historical",
  ];
  const locations = ["Lisbon", "Porto", "Sintra", "Óbidos", "Coimbra"];

  // Fetch tours from API
  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (searchQuery) params.append("search", searchQuery);
      if (selectedLocation) params.append("location", selectedLocation);
      if (selectedCategories.length > 0) {
        params.append("categories", selectedCategories.join(","));
      }
      if (minRating > 0) params.append("minRating", minRating.toString());
      params.append("minPrice", priceRange[0].toString());
      params.append("maxPrice", priceRange[1].toString());
      params.append("sortBy", sortBy);

      const response = await fetch(`/api/tours?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTours(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tours:", error);
      setError(error instanceof Error ? error.message : t("errors.generic"));
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchTours();
  }, [
    searchQuery,
    selectedLocation,
    selectedCategories,
    minRating,
    priceRange,
    sortBy,
  ]);

  // Filter tours (client-side additional filtering if needed)
  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      if (
        searchQuery &&
        !tour.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [tours, searchQuery]);

  // Handle category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Handle quick book
  const handleQuickBook = (tour: Tour) => {
    // Navigate to tour detail page for booking
    window.location.href = `/${locale}/customer/tours/${tour.id}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("tours.title")}
          </h1>
          <p className="text-lg text-gray-600 mb-6">{t("tours.subtitle")}</p>

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t("tours.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              {t("tours.filters")}
            </button>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-3 ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                } transition-colors`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-3 ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                } transition-colors`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("tours.category")}
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Star className="w-4 h-4 inline mr-1" />
                    {t("tours.rating")}
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("tours.priceRange")}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>€{priceRange[0]}</span>
                      <span>€{priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedLocation("");
                    setSelectedCategories([]);
                    setMinRating(0);
                    setPriceRange([0, 1000]);
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {loading ? (
              <span>Loading tours...</span>
            ) : (
              <span>
                Showing {filteredTours.length} of {tours.length} tours
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600">
              {t("tours.sortBy")}:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading tours...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">{error}</p>
            <button
              onClick={fetchTours}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredTours.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("tours.noResults")}
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all available tours.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedLocation("");
                setSelectedCategories([]);
                setMinRating(0);
                setPriceRange([0, 1000]);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Tours Grid/List */}
        {!loading && !error && filteredTours.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }
          >
            {filteredTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                locale={locale}
                compact={viewMode === "list"}
                showQuickBook={true}
                onQuickBook={handleQuickBook}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && filteredTours.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              {t("tours.loadMore")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
