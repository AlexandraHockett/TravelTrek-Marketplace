// File: components/customer/TourCard.tsx
// Location: Substituir o ficheiro existente

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  MapPin,
  Users,
  Star,
  Heart,
  Calendar,
  Euro,
} from "lucide-react";
import type { Tour, Translations } from "@/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface TourCardProps {
  tour: Tour;
  locale: string;
  translations?: Translations;
  showAddToWishlist?: boolean;
  compact?: boolean;
  className?: string;
}

const TourCard: React.FC<TourCardProps> = ({
  tour,
  locale,
  translations: t,
  showAddToWishlist = true,
  compact = false,
  className = "",
}) => {
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  // Helper functions
  const formatPrice = (price: number) => {
    return `€${price.toFixed(0)}`;
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    if (minutes === 0) {
      return `${wholeHours}${wholeHours === 1 ? t?.common?.hour || "h" : t?.common?.hours || "h"}`;
    }
    return `${wholeHours}h${minutes}m`;
  };

  const getDifficultyColor = (difficulty: Tour["difficulty"]) => {
    switch (difficulty) {
      case "Easy":
        return "success"; // Changed from "bg-green-100 text-green-800 border-green-200"
      case "Moderate":
        return "warning"; // Changed from "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Challenging":
        return "error"; // Changed from "bg-red-100 text-red-800 border-red-200"
      default:
        return "default"; // Changed from "bg-gray-100 text-gray-800 border-gray-200"
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // Aqui seria chamada a API para adicionar/remover da wishlist
  };

  // Render stars
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0 clip-path-half" />
          </div>
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}

        <span className="text-sm text-gray-600 ml-1">
          {rating} ({tour.reviewCount})
        </span>
      </div>
    );
  };

  const cardClasses = `
    group relative bg-white rounded-xl shadow-sm border border-gray-200 
    hover:shadow-lg hover:border-gray-300 transition-all duration-300 
    overflow-hidden ${compact ? "h-auto" : "h-full"} ${className}
  `;

  return (
    <Link href={`/${locale}/customer/tours/${tour.id}`} className={cardClasses}>
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Price Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
            <div className="flex items-center gap-1">
              {tour.originalPrice && tour.originalPrice > tour.price && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(tour.originalPrice)}
                </span>
              )}
              <span className="font-semibold text-gray-900">
                {formatPrice(tour.price)}
              </span>
            </div>
            <div className="text-xs text-gray-600">
              {t?.tours?.perPerson || "por pessoa"}
            </div>
          </div>
        </div>

        {/* Wishlist Button */}
        {showAddToWishlist && (
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
            aria-label={
              isWishlisted
                ? t?.tours?.removeFromWishlist || "Remover da wishlist"
                : t?.tours?.addToWishlist || "Adicionar à wishlist"
            }
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 hover:text-red-500"
              } transition-colors`}
            />
          </button>
        )}

        {/* Difficulty Badge */}
        <div className="absolute bottom-3 right-3">
          <Badge
            variant={getDifficultyColor(tour.difficulty)}
            className="text-xs"
          >
            {t?.tours?.difficulty?.[tour.difficulty.toLowerCase()] ||
              tour.difficulty}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{tour.location}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {tour.title}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
          {tour.shortDescription || tour.description}
        </p>

        {/* Tour Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(tour.duration)}</span>
            </div>

            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>
                {t?.tours?.upTo || "até"} {tour.maxParticipants}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between">
            {renderStars(tour.rating)}
          </div>
        </div>

        {/* Tags */}
        {tour.tags && tour.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tour.tags.slice(0, 2).map((tag, index) => (
              <Badge
                key={index}
                variant="default" // Changed from "secondary"
                className="text-xs px-2 py-1"
              >
                {tag}
              </Badge>
            ))}
            {tour.tags.length > 2 && (
              <Badge variant="info" className="text-xs px-2 py-1">
                {" "}
                {/* Changed from "outline" */}+{tour.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons - Hidden on mobile, shown on hover on desktop */}
        <div className="mt-auto">
          <div className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t?.tours?.viewDetails || "Ver Detalhes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Hover Overlay for additional info */}
      <div className="absolute inset-0 bg-blue-600/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 md:hidden">
        <div className="text-center text-white">
          <h4 className="font-semibold mb-2">{tour.title}</h4>
          <p className="text-sm opacity-90 mb-4 line-clamp-3">
            {tour.shortDescription || tour.description}
          </p>
          <Button variant="secondary" size="sm">
            {t?.tours?.viewDetails || "Ver Detalhes"}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
