// File: app/customer/tours/page.tsx
// Location: Create this file in the app/customer/tours/ directory
"use client";

import React from "react";
import Link from "next/link";
import { Tour } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

// Mock data - replace with actual API calls later
const mockTours: Tour[] = [
  {
    id: "t1",
    title: "Porto Food & Wine Tour",
    description:
      "Experience authentic Portuguese cuisine and local wines in the heart of Porto.",
    shortDescription: "Authentic Portuguese cuisine tour",
    image: "/images/tours/porto-food.webp",
    price: 45,
    originalPrice: 60,
    currency: "EUR",
    duration: 4,
    location: "Porto, Portugal",
    rating: 4.9,
    reviewCount: 128,
    maxParticipants: 12,
    minimumAge: 18,
    difficulty: "Easy" as const,
    included: ["Food tastings", "Local guide", "Wine samples"],
    cancellationPolicy: "Free cancellation up to 24 hours",
    hostId: "h1",
    tags: ["Food", "Wine", "Culture"],
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "t2",
    title: "Sintra Royal Palaces",
    description:
      "Discover the magical palaces of Sintra including Pena Palace and Quinta da Regaleira.",
    shortDescription: "Royal palaces and gardens tour",
    image: "/images/tours/sintra-palace.webp",
    price: 65,
    originalPrice: 80,
    currency: "EUR",
    duration: 8,
    location: "Sintra, Portugal",
    rating: 4.8,
    reviewCount: 156,
    maxParticipants: 16,
    minimumAge: 8,
    difficulty: "Moderate" as const,
    included: ["Transport", "Guide", "Palace tickets"],
    cancellationPolicy: "Free cancellation up to 48 hours",
    hostId: "h2",
    tags: ["Culture", "History", "Architecture"],
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "t3",
    title: "Douro Valley River Cruise",
    description:
      "Sail through the stunning Douro Valley with wine tastings and scenic views.",
    shortDescription: "River cruise with wine tastings",
    image: "/images/tours/douro-cruise.webp",
    price: 89,
    currency: "EUR",
    duration: 10,
    location: "Douro Valley, Portugal",
    rating: 4.7,
    reviewCount: 89,
    maxParticipants: 25,
    minimumAge: 12,
    difficulty: "Easy" as const,
    included: [
      "River cruise",
      "Wine tastings",
      "Traditional lunch",
      "Transport",
    ],
    cancellationPolicy: "Free cancellation up to 72 hours",
    hostId: "h3",
    tags: ["Nature", "Wine", "Cruise", "Scenic"],
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "t4",
    title: "Lisbon Tuk-Tuk City Tour",
    description:
      "Explore Lisbons historic neighborhoods and viewpoints in an eco-friendly tuk-tuk.",
    shortDescription: "City tour by tuk-tuk",
    image: "/images/tours/lisbon-tuktuk.webp",
    price: 35,
    currency: "EUR",
    duration: 3,
    location: "Lisboa, Portugal",
    rating: 4.6,
    reviewCount: 203,
    maxParticipants: 6,
    minimumAge: 5,
    difficulty: "Easy" as const,
    included: ["Tuk-tuk tour", "Local guide", "Photo stops"],
    cancellationPolicy: "Free cancellation up to 24 hours",
    hostId: "h4",
    tags: ["City Tour", "Sightseeing", "Eco-friendly"],
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "t5",
    title: "Aveiro Canals & Salt Pans",
    description:
      "Discover the Venice of Portugal with traditional moliceiro boat rides and salt harvesting.",
    shortDescription: "Canals tour and salt pans visit",
    image: "/images/tours/aveiro-canals.webp",
    price: 42,
    currency: "EUR",
    duration: 5,
    location: "Aveiro, Portugal",
    rating: 4.5,
    reviewCount: 94,
    maxParticipants: 14,
    minimumAge: 6,
    difficulty: "Easy" as const,
    included: [
      "Moliceiro boat ride",
      "Salt pans visit",
      "Local guide",
      "Traditional sweets",
    ],
    cancellationPolicy: "Free cancellation up to 24 hours",
    hostId: "h5",
    tags: ["Culture", "Nature", "Boat Tour", "Traditional"],
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "t6",
    title: "Óbidos Medieval Experience",
    description:
      "Step back in time in the medieval walled town of Óbidos with local crafts and ginjinha tasting.",
    shortDescription: "Medieval town exploration",
    image: "/images/tours/obidos-medieval.webp",
    price: 38,
    currency: "EUR",
    duration: 4,
    location: "Óbidos, Portugal",
    rating: 4.4,
    reviewCount: 67,
    maxParticipants: 10,
    minimumAge: 8,
    difficulty: "Easy" as const,
    included: ["Guided walking tour", "Ginjinha tasting", "Local crafts demo"],
    cancellationPolicy: "Free cancellation up to 24 hours",
    hostId: "h6",
    tags: ["History", "Culture", "Medieval", "Traditional"],
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
  },
];

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: string;
  onPriceRangeChange: (range: string) => void;
  difficultyFilter: string;
  onDifficultyChange: (difficulty: string) => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  difficultyFilter,
  onDifficultyChange,
}) => {
  const categories = [
    "Todos",
    "Food",
    "Culture",
    "Nature",
    "Wine",
    "History",
    "City Tour",
  ];
  const priceRanges = ["Todos", "0-40€", "41-60€", "61-80€", "80€+"];
  const difficulties = ["Todos", "Easy", "Moderate", "Challenging"];

  return (
    <Card className="p-6 mb-8">
      <div className="space-y-4">
        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Pesquisar tours por localização ou título..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent default-none"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent default-none"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço
            </label>
            <select
              value={priceRange}
              onChange={(e) => onPriceRangeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent default-none"
            >
              {priceRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dificuldade
            </label>
            <select
              value={difficultyFilter}
              onChange={(e) => onDifficultyChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent default-none"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === "Easy"
                    ? "Fácil"
                    : difficulty === "Moderate"
                      ? "Moderada"
                      : difficulty === "Challenging"
                        ? "Desafiante"
                        : difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface TourCardProps {
  tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "success";
      case "Moderate":
        return "warning";
      case "Challenging":
        return "error";
      default:
        return "default";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "Fácil";
      case "Moderate":
        return "Moderada";
      case "Challenging":
        return "Desafiante";
      default:
        return difficulty;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <Link href={`/customer/tours/${tour.id}`}>
        <div className="relative">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/placeholders/tour-placeholder.webp";
            }}
          />

          {/* Discount Badge */}
          {tour.originalPrice && tour.originalPrice > tour.price && (
            <div className="absolute top-3 right-3">
              <Badge variant="error" className="bg-red-500">
                -
                {Math.round(
                  ((tour.originalPrice - tour.price) / tour.originalPrice) * 100
                )}
                %
              </Badge>
            </div>
          )}

          {/* Duration Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="default" className="bg-white/90 text-gray-800">
              {tour.duration}h
            </Badge>
          </div>
        </div>

        <div className="p-6">
          {/* Title & Location */}
          <div className="mb-3">
            <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
              {tour.title}
            </h3>
            <p className="text-sm text-gray-600 flex items-center">
              <span className="mr-1">📍</span>
              {tour.location}
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {tour.shortDescription || tour.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tour.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {/* Rating */}
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="text-sm font-medium">{tour.rating}</span>
                <span className="text-sm text-gray-500 ml-1">
                  ({tour.reviewCount})
                </span>
              </div>

              {/* Difficulty */}
              <Badge
                variant={getDifficultyColor(tour.difficulty) as any}
                size="sm"
              >
                {getDifficultyLabel(tour.difficulty)}
              </Badge>
            </div>

            {/* Participants */}
            <div className="text-sm text-gray-500">
              <span className="mr-1">👥</span>
              Até {tour.maxParticipants}
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div>
              {tour.originalPrice && (
                <p className="text-sm text-gray-500 line-through">
                  {formatCurrency(tour.originalPrice)}
                </p>
              )}
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(tour.price)}
                <span className="text-sm font-normal text-gray-600 ml-1">
                  /pessoa
                </span>
              </p>
            </div>

            <Button className="group-hover:bg-blue-600 transition-colors">
              Ver Detalhes
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default function CustomerToursPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Todos");
  const [priceRange, setPriceRange] = React.useState("Todos");
  const [difficultyFilter, setDifficultyFilter] = React.useState("Todos");

  // Filter logic
  const filteredTours = mockTours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "Todos" ||
      tour.tags.some(
        (tag) => tag.toLowerCase() === selectedCategory.toLowerCase()
      );

    const matchesPrice =
      priceRange === "Todos" ||
      (priceRange === "0-40€" && tour.price <= 40) ||
      (priceRange === "41-60€" && tour.price > 40 && tour.price <= 60) ||
      (priceRange === "61-80€" && tour.price > 60 && tour.price <= 80) ||
      (priceRange === "80€+" && tour.price > 80);

    const matchesDifficulty =
      difficultyFilter === "Todos" || tour.difficulty === difficultyFilter;

    return (
      matchesSearch && matchesCategory && matchesPrice && matchesDifficulty
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Descobrir Tours 🌟
          </h1>
          <p className="text-gray-600">
            Encontra experiências únicas em Portugal. {filteredTours.length}{" "}
            {filteredTours.length === 1
              ? "experiência encontrada"
              : "experiências encontradas"}
            .
          </p>
        </div>

        {/* Search and Filters */}
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          difficultyFilter={difficultyFilter}
          onDifficultyChange={setDifficultyFilter}
        />

        {/* Results */}
        {filteredTours.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum tour encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tenta ajustar os filtros para encontrar mais opções.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Todos");
                setPriceRange("Todos");
                setDifficultyFilter("Todos");
              }}
              variant="default"
            >
              Limpar Filtros
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
