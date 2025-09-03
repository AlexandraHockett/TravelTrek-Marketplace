"use client";

import Link from "next/link";
import Image from "next/image";
import { Tour, TourCardProps } from "@/types";
import { MapPin, Clock, Users, Star, Heart } from "lucide-react";
import { useState } from "react";

export default function TourCard({
  tour,
  locale = "en",
  translations: t,
  compact = false,
  className = "",
  showQuickBook = false,
  onQuickBook,
}: TourCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formatCurrency = (amount: number, currency: string = "EUR") => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // Add wishlist logic here
  };

  const handleQuickBook = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickBook) {
      onQuickBook(tour);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Link href={`/${locale}/customer/tours/${tour.id}`}>
      <article
        className={`group bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={tour.image || "/images/placeholder-tour.jpg"}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Price Badge */}
          <div className="absolute top-3 left-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <span className="font-bold text-gray-900">
                {formatCurrency(tour.price, tour.currency)}
              </span>
              {tour.originalPrice && tour.originalPrice > tour.price && (
                <span className="text-xs text-gray-500 line-through ml-1">
                  {formatCurrency(tour.originalPrice, tour.currency)}
                </span>
              )}
            </div>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isWishlisted ? "text-red-500 fill-current" : "text-gray-600"
              }`}
            />
          </button>

          {/* Difficulty Badge */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
              {t.tours?.[tour.difficulty.toLowerCase()] || tour.difficulty}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{tour.location}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {tour.title}
          </h3>

          {/* Rating */}
          {tour.rating && (
            <div className="flex items-center mb-3">
              <div className="flex">{renderStars(tour.rating)}</div>
              <span className="ml-2 font-medium text-sm">{tour.rating}</span>
              <span className="text-gray-500 text-sm ml-1">
                ({tour.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Description */}
          {tour.shortDescription && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {tour.shortDescription}
            </p>
          )}

          {/* Tour Details */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{tour.duration}h</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{tour.maxParticipants}</span>
            </div>
          </div>

          {/* Tags/Amenities */}
          {tour.amenities && tour.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tour.amenities.slice(0, 2).map((amenity, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {t.tours?.[amenity.toLowerCase().replace(/\s+/g, "")] ||
                    amenity}
                </span>
              ))}
              {tour.amenities.length > 2 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  +{tour.amenities.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg group-hover:bg-blue-700 transition-colors font-medium text-center text-sm">
                {t.tours?.viewDetails || "View Details"}
              </div>
            </div>
            {showQuickBook && (
              <button
                onClick={handleQuickBook}
                className="px-4 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
              >
                {t.common?.bookNow || "Book Now"}
              </button>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
