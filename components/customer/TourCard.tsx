// File: components/customer/TourCard.tsx
// Location: Create this file in the components/customer/ directory

import React from "react";
import Link from "next/link";
import { Tour } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

interface TourCardProps {
  tour: Tour;
  variant?: "default" | "compact" | "featured";
  showBookButton?: boolean;
  className?: string;
}

const TourCard: React.FC<TourCardProps> = ({
  tour,
  variant = "default",
  showBookButton = true,
  className = "",
}) => {
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

  const discountPercentage =
    tour.originalPrice && tour.originalPrice > tour.price
      ? Math.round(
          ((tour.originalPrice - tour.price) / tour.originalPrice) * 100
        )
      : 0;

  // Compact variant for dashboard/sidebar usage
  if (variant === "compact") {
    return (
      <Card
        className={`overflow-hidden hover:shadow-md transition-all duration-200 ${className}`}
      >
        <Link href={`/customer/tours/${tour.id}`}>
          <div className="flex space-x-4 p-4">
            <div className="relative flex-shrink-0">
              <img
                src={tour.image}
                alt={tour.title}
                className="w-20 h-20 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholders/tour-placeholder.webp";
                }}
              />
              {discountPercentage > 0 && (
                <div className="absolute -top-2 -right-2">
                  <Badge
                    variant="error"
                    size="sm"
                    className="bg-red-500 text-xs"
                  >
                    -{discountPercentage}%
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                {tour.title}
              </h3>
              <p className="text-xs text-gray-600 mb-2 flex items-center">
                <span className="mr-1">📍</span>
                {tour.location}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span>{tour.rating}</span>
                </div>

                <div className="text-right">
                  {tour.originalPrice && (
                    <p className="text-xs text-gray-500 line-through">
                      {formatCurrency(tour.originalPrice)}
                    </p>
                  )}
                  <p className="font-semibold text-sm text-gray-900">
                    {formatCurrency(tour.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  // Featured variant for hero sections
  if (variant === "featured") {
    return (
      <Card
        className={`overflow-hidden hover:shadow-2xl transition-all duration-300 group ${className}`}
      >
        <Link href={`/customer/tours/${tour.id}`}>
          <div className="relative">
            <img
              src={tour.image}
              alt={tour.title}
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/placeholders/tour-placeholder.webp";
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Badges overlay */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={getDifficultyColor(tour.difficulty) as any}
                  className="bg-white/90 text-gray-800"
                >
                  {getDifficultyLabel(tour.difficulty)}
                </Badge>
                <Badge variant="default" className="bg-white/90 text-gray-800">
                  {tour.duration}h
                </Badge>
              </div>

              {discountPercentage > 0 && (
                <Badge variant="error" className="bg-red-500 animate-pulse">
                  -{discountPercentage}% OFF
                </Badge>
              )}
            </div>

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2 line-clamp-2">
                {tour.title}
              </h3>
              <p className="text-white/90 mb-3 flex items-center">
                <span className="mr-1">📍</span>
                {tour.location}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="font-medium">{tour.rating}</span>
                    <span className="ml-1 opacity-75">
                      ({tour.reviewCount})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  {tour.originalPrice && (
                    <p className="text-white/70 line-through text-sm">
                      {formatCurrency(tour.originalPrice)}
                    </p>
                  )}
                  <p className="text-2xl font-bold">
                    {formatCurrency(tour.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  // Default variant - standard tour card
  return (
    <Card
      className={`overflow-hidden hover:shadow-xl transition-all duration-300 group ${className}`}
    >
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
          {discountPercentage > 0 && (
            <div className="absolute top-3 right-3">
              <Badge variant="error" className="bg-red-500 animate-pulse">
                -{discountPercentage}%
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
              <Badge key={tag} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
            {tour.tags.length > 3 && (
              <Badge variant="default" size="sm" className="text-gray-400">
                +{tour.tags.length - 3}
              </Badge>
            )}
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

            {showBookButton && (
              <div onClick={(e) => e.stopPropagation()}>
                <Link href={`/customer/tours/${tour.id}`}>
                  <Button className="group-hover:bg-blue-600 transition-colors">
                    Ver Detalhes
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              {tour.minimumAge ? `+${tour.minimumAge} anos` : "Todas as idades"}
            </span>
            <span>Cancelamento gratuito</span>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default TourCard;
