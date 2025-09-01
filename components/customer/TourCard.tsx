// File: components/customer/TourCard.tsx
// Location: REPLACE the existing components/customer/TourCard.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  MapPin,
  Clock,
  Users,
  Heart,
  Wifi,
  Coffee,
  Car,
} from "lucide-react";
import { Tour } from "@/types";
import { useTranslations, getLocalizedHref } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";

interface TourCardProps {
  tour: Tour;
  locale: string;
  compact?: boolean;
  showQuickBook?: boolean;
  className?: string;
  onQuickBook?: (tour: Tour) => void;
}

export default function TourCard({
  tour,
  locale,
  compact = false,
  showQuickBook = false,
  className = "",
  onQuickBook,
}: TourCardProps) {
  const t = useTranslations(locale);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Generate localized tour detail URL
  const tourUrl = getLocalizedHref(`/customer/tours/${tour.id}`, locale);

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: Call API to save/remove favorite
  };

  // Handle quick book
  const handleQuickBook = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickBook) {
      onQuickBook(tour);
    }
  };

  // Get amenity icons
  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, JSX.Element> = {
      wifi: <Wifi className="w-3 h-3" />,
      breakfast: <Coffee className="w-3 h-3" />,
      transport: <Car className="w-3 h-3" />,
    };
    return iconMap[amenity.toLowerCase()] || null;
  };

  // Compact version for lists/grids
  if (compact) {
    return (
      <Link href={tourUrl} className={`block group ${className}`}>
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
          {/* Image */}
          <div className="relative h-48 w-full overflow-hidden">
            {!imageError ? (
              <Image
                src={tour.image}
                alt={tour.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
            )}

            {/* Favorite button */}
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
              />
            </button>

            {/* Price badge */}
            <div className="absolute bottom-3 left-3 bg-white/90 rounded-lg px-2 py-1">
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(tour.price, tour.currency)}
              </span>
              <span className="text-xs text-gray-600 ml-1">
                / {t("common.person")}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
              {tour.title}
            </h3>

            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{tour.location}</span>
            </div>

            {tour.rating && tour.reviewsCount && (
              <div className="flex items-center text-sm mb-3">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="font-medium">{tour.rating}</span>
                <span className="text-gray-600 ml-1">
                  ({tour.reviewsCount} {t("tours.reviewsCount")})
                </span>
              </div>
            )}

            {showQuickBook && (
              <button
                onClick={handleQuickBook}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {t("common.bookNow")}
              </button>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Full card version
  return (
    <Link href={tourUrl} className={`block group ${className}`}>
      <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Image Section */}
        <div className="relative h-64 w-full overflow-hidden">
          {!imageError ? (
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Favorite button */}
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-all backdrop-blur-sm"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </button>

          {/* Price and category */}
          <div className="absolute bottom-4 left-4">
            <div className="flex items-end space-x-2">
              <div className="bg-white/95 rounded-lg px-3 py-2 backdrop-blur-sm">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(tour.price, tour.currency)}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">
                    / {t("common.person")}
                  </span>
                </div>
              </div>
              {tour.category && (
                <div className="bg-blue-600/90 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                  {tour.category}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Title and location */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {tour.title}
            </h3>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{tour.location}</span>
            </div>
          </div>

          {/* Rating and reviews */}
          {tour.rating && tour.reviewsCount && (
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(tour.rating!)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 font-medium">{tour.rating}</span>
              <span className="text-gray-600 ml-1">
                ({tour.reviewsCount} {t("tours.reviewsCount")})
              </span>
            </div>
          )}

          {/* Description */}
          {tour.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {tour.description}
            </p>
          )}

          {/* Tour details */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            {tour.duration && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{tour.duration}</span>
              </div>
            )}
            {tour.maxParticipants && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>
                  {t("tours.maxParticipants", { max: tour.maxParticipants })}
                </span>
              </div>
            )}
          </div>

          {/* Amenities */}
          {tour.amenities && tour.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tour.amenities.slice(0, 3).map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs"
                >
                  {getAmenityIcon(amenity)}
                  <span className="ml-1">{t(`tours.${amenity}`)}</span>
                </div>
              ))}
              {tour.amenities.length > 3 && (
                <div className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
                  +{tour.amenities.length - 3} more
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg group-hover:bg-blue-700 transition-colors font-medium text-center">
                {t("tours.viewDetails")}
              </div>
            </div>
            {showQuickBook && (
              <button
                onClick={handleQuickBook}
                className="px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                {t("common.bookNow")}
              </button>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
