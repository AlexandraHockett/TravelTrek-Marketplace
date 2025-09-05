// File: components/customer/TourCard.tsx
// Location: SUBSTITUIR o ficheiro existente

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Tour, Translations } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Star, MapPin, Clock, Users, Heart } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface TourCardProps {
  tour: Tour;
  locale: string;
  translations: Translations;
  compact?: boolean;
  className?: string;
  showQuickBook?: boolean;
  onQuickBook?: (tour: Tour) => void;
  showWishlist?: boolean;
  isWishlisted?: boolean;
  onWishlistToggle?: (tourId: string) => void;
}

const TourCard: React.FC<TourCardProps> = ({
  tour,
  locale,
  translations: t,
  compact = false,
  className,
  showQuickBook = false,
  onQuickBook,
  showWishlist = false,
  isWishlisted = false,
  onWishlistToggle,
}) => {
  // ✅ FIXED: Access translations properly with fallbacks
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return t.tours?.difficulty?.easy || "Fácil";
      case "moderate":
        return t.tours?.difficulty?.moderate || "Moderado";
      case "challenging":
        return t.tours?.difficulty?.challenging || "Desafiante";
      default:
        return difficulty;
    }
  };

  const getCategoryLabel = (category: string) => {
    const categoryKey = category.toLowerCase().replace(/\s+/g, "");
    return (
      t.tours?.categories?.[categoryKey as keyof typeof t.tours.categories] ||
      category
    );
  };

  // ✅ FIXED: Safe rating formatting with type checking
  const formatRating = (rating: number | string | null | undefined) => {
    if (rating === null || rating === undefined) return "0.0";

    // Convert to number if it's a string
    const numericRating =
      typeof rating === "string" ? parseFloat(rating) : rating;

    // Check if it's a valid number
    if (isNaN(numericRating)) return "0.0";

    return numericRating.toFixed(1);
  };

  const formatReviewCount = (count: number | string | null | undefined) => {
    // Convert to number if it's a string
    const numericCount =
      typeof count === "string" ? parseInt(count) : count || 0;

    if (numericCount === 0) return t.tours?.noReviews || "Sem avaliações";
    if (numericCount === 1) return `1 ${t.tours?.review || "avaliação"}`;
    return `${numericCount} ${t.tours?.reviews || "avaliações"}`;
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle?.(tour.id);
  };

  const handleQuickBook = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickBook?.(tour);
  };

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-300 overflow-hidden border-0 bg-white",
        compact ? "max-w-sm" : "h-full",
        className
      )}
    >
      <Link href={`/${locale}/customer/tours/${tour.id}`}>
        <div className="relative">
          {/* Image Container */}
          <div
            className={cn(
              "relative overflow-hidden bg-gray-200",
              compact ? "h-48" : "h-56"
            )}
          >
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes={compact ? "300px" : "400px"}
            />

            {/* Wishlist Button */}
            {showWishlist && (
              <button
                onClick={handleWishlistClick}
                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
              >
                <Heart
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isWishlisted ? "text-red-500 fill-current" : "text-gray-600"
                  )}
                />
              </button>
            )}

            {/* Discount Badge */}
            {tour.originalPrice && tour.originalPrice > tour.price && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                {Math.round(
                  ((tour.originalPrice - tour.price) / tour.originalPrice) * 100
                )}
                % OFF
              </div>
            )}

            {/* Difficulty Badge */}
            <div className="absolute bottom-3 left-3">
              <Badge
                variant="default"
                className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs"
              >
                {getDifficultyLabel(tour.difficulty)}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className={cn(compact ? "p-3" : "p-5")}>
            {/* Location */}
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{tour.location}</span>
            </div>

            {/* Title */}
            <h3
              className={cn(
                "font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors",
                compact ? "text-base" : "text-lg"
              )}
            >
              {tour.title}
            </h3>

            {/* Description */}
            {!compact && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {tour.shortDescription || tour.description}
              </p>
            )}

            {/* Tour Details */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  {tour.duration}{" "}
                  {tour.duration === 1
                    ? t.common?.hour || "hora"
                    : t.common?.hours || "horas"}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>
                  {t.tours?.maxParticipants || "Máx"} {tour.maxParticipants}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900 ml-1">
                  {formatRating(tour.rating)}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                ({formatReviewCount(tour.reviewCount)})
              </span>
            </div>

            {/* Price and Book Button */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {tour.originalPrice && tour.originalPrice > tour.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(tour.originalPrice, tour.currency)}
                  </span>
                )}
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(tour.price, tour.currency)}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">
                    / {t.common?.person || "pessoa"}
                  </span>
                </div>
              </div>

              {/* Quick Book Button */}
              {showQuickBook && (
                <Button
                  onClick={handleQuickBook}
                  variant="primary"
                  size="sm"
                  className="px-4"
                >
                  {t.common?.bookNow || "Reservar"}
                </Button>
              )}
            </div>

            {/* Amenities/Tags (if space allows) */}
            {!compact && tour.tags && tour.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {tour.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="default"
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700"
                  >
                    {getCategoryLabel(tag)}
                  </Badge>
                ))}
                {tour.tags.length > 3 && (
                  <Badge
                    variant="default"
                    className="text-xs px-2 py-1 text-gray-500 bg-gray-50"
                  >
                    +{tour.tags.length - 3} {t.tours?.more || "mais"}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default TourCard;
