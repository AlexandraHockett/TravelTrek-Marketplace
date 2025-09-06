// ===================================================================
// 📁 app/[locale]/tours/client.tsx
// Location: REPLACE app/[locale]/tours/client.tsx
// SIMPLIFIED: Use hardcoded strings to avoid translation API issues
// ===================================================================

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Users, Star, Filter, Search, Euro } from "lucide-react";
import type { Tour, Locale } from "@/types";

interface ToursClientProps {
  initialTours: Tour[];
  locale: Locale;
  searchParams: { [key: string]: string | string[] | undefined };
}

// Simple translations object
const translations = {
  pt: {
    filters: "Filtros",
    search: "Pesquisar",
    searchPlaceholder: "Pesquisar tours...",
    location: "Localização",
    allLocations: "Todas as localizações",
    difficulty: "Dificuldade",
    all: "Todas",
    easy: "Fácil",
    moderate: "Moderada",
    hard: "Difícil",
    maxPrice: "Preço máximo",
    toursFound: "tours encontrados",
    noToursFound: "Nenhum tour encontrado com os filtros aplicados.",
    clearFilters: "Limpar filtros",
    sale: "Promoção",
    maxParticipants: "Máx",
    perPerson: "pessoa",
  },
  en: {
    filters: "Filters",
    search: "Search",
    searchPlaceholder: "Search tours...",
    location: "Location",
    allLocations: "All locations",
    difficulty: "Difficulty",
    all: "All",
    easy: "Easy",
    moderate: "Moderate",
    hard: "Hard",
    maxPrice: "Max price",
    toursFound: "tours found",
    noToursFound: "No tours found with the applied filters.",
    clearFilters: "Clear filters",
    sale: "Sale",
    maxParticipants: "Max",
    perPerson: "person",
  },
  es: {
    filters: "Filtros",
    search: "Buscar",
    searchPlaceholder: "Buscar tours...",
    location: "Ubicación",
    allLocations: "Todas las ubicaciones",
    difficulty: "Dificultad",
    all: "Todas",
    easy: "Fácil",
    moderate: "Moderada",
    hard: "Difícil",
    maxPrice: "Precio máximo",
    toursFound: "tours encontrados",
    noToursFound: "No se encontraron tours con los filtros aplicados.",
    clearFilters: "Limpiar filtros",
    sale: "Oferta",
    maxParticipants: "Máx",
    perPerson: "persona",
  },
  fr: {
    filters: "Filtres",
    search: "Rechercher",
    searchPlaceholder: "Rechercher des tours...",
    location: "Emplacement",
    allLocations: "Tous les emplacements",
    difficulty: "Difficulté",
    all: "Toutes",
    easy: "Facile",
    moderate: "Modérée",
    hard: "Difficile",
    maxPrice: "Prix maximum",
    toursFound: "tours trouvés",
    noToursFound: "Aucun tour trouvé avec les filtres appliqués.",
    clearFilters: "Effacer les filtres",
    sale: "Promotion",
    maxParticipants: "Max",
    perPerson: "personne",
  },
  de: {
    filters: "Filter",
    search: "Suchen",
    searchPlaceholder: "Tours suchen...",
    location: "Standort",
    allLocations: "Alle Standorte",
    difficulty: "Schwierigkeit",
    all: "Alle",
    easy: "Einfach",
    moderate: "Moderat",
    hard: "Schwer",
    maxPrice: "Höchstpreis",
    toursFound: "Touren gefunden",
    noToursFound: "Keine Touren mit den angewendeten Filtern gefunden.",
    clearFilters: "Filter löschen",
    sale: "Angebot",
    maxParticipants: "Max",
    perPerson: "Person",
  },
};

export default function ToursClient({
  initialTours,
  locale,
  searchParams,
}: ToursClientProps) {
  const t = translations[locale] || translations.en;
  const [tours] = useState<Tour[]>(initialTours);
  const [searchTerm, setSearchTerm] = useState(
    (searchParams.search as string) || ""
  );
  const [selectedLocation, setSelectedLocation] = useState(
    (searchParams.location as string) || ""
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    (searchParams.difficulty as string) || ""
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.maxPrice ? Number(searchParams.maxPrice) : 100
  );

  // Filter tours based on search criteria
  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchesSearch =
        !searchTerm ||
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        !selectedLocation ||
        tour.location.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesDifficulty =
        !selectedDifficulty || tour.difficulty === selectedDifficulty;

      const matchesPrice = Number(tour.price) <= maxPrice;

      return (
        matchesSearch && matchesLocation && matchesDifficulty && matchesPrice
      );
    });
  }, [tours, searchTerm, selectedLocation, selectedDifficulty, maxPrice]);

  // Get unique locations for filter
  const uniqueLocations = useMemo(() => {
    const locations = tours.map((tour) => tour.location);
    return [...new Set(locations)].sort();
  }, [tours]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold">{t.filters}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              {t.search}
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              {t.location}
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t.allLocations}</option>
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.difficulty}
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t.all}</option>
              <option value="Easy">{t.easy}</option>
              <option value="Moderate">{t.moderate}</option>
              <option value="Hard">{t.hard}</option>
            </select>
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Euro className="w-4 h-4 inline mr-1" />
              {t.maxPrice}: €{maxPrice}
            </label>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          {filteredTours.length} {t.toursFound}
        </div>
      </div>

      {/* Tours Grid */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t.noToursFound}</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedLocation("");
              setSelectedDifficulty("");
              setMaxPrice(100);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t.clearFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} locale={locale} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

// Tour Card Component
function TourCard({ tour, locale, t }: { tour: Tour; locale: Locale; t: any }) {
  return (
    <Link
      href={`/${locale}/tours/${tour.id}`}
      className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {tour.originalPrice &&
          Number(tour.originalPrice) > Number(tour.price) && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              {t.sale}
            </div>
          )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Location */}
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {tour.title}
        </h3>

        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          {tour.location}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {tour.shortDescription || tour.description}
        </p>

        {/* Tour details */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {tour.duration}h
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {t.maxParticipants} {tour.maxParticipants}
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
            {tour.rating} ({tour.reviewCount})
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            {tour.originalPrice &&
              Number(tour.originalPrice) > Number(tour.price) && (
                <span className="text-gray-400 line-through text-sm mr-2">
                  €{tour.originalPrice}
                </span>
              )}
            <span className="text-xl font-bold text-gray-900">
              €{tour.price}
            </span>
            <span className="text-gray-500 text-sm ml-1">/{t.perPerson}</span>
          </div>

          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              tour.difficulty === "Easy"
                ? "bg-green-100 text-green-800"
                : tour.difficulty === "Moderate"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {tour.difficulty === "Easy"
              ? t.easy
              : tour.difficulty === "Moderate"
                ? t.moderate
                : t.hard}
          </span>
        </div>
      </div>
    </Link>
  );
}
