//app\[locale]\customer\tours\[id]\client.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "@/lib/i18n";
import { BookingForm } from "@/components/customer";
import { Tour } from "@/types";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Check,
  X,
  Calendar,
  Shield,
  Award,
  Globe,
  Heart,
} from "lucide-react";

interface TourDetailClientProps {
  tour: Tour;
  locale: string;
}

export default function TourDetailClient({
  tour,
  locale,
}: TourDetailClientProps) {
  const t = useTranslations(locale);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const formatCurrency = (amount: number, currency: string = "EUR") => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Add wishlist logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <Image
          src={tour.image || "/images/placeholder-tour.jpg"}
          alt={tour.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Heart
            className={`w-6 h-6 transition-colors ${
              isWishlisted ? "text-red-500 fill-current" : "text-gray-600"
            }`}
          />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {tour.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-lg">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {tour.location}
                </div>
                {tour.rating && (
                  <div className="flex items-center">
                    <div className="flex">{renderStars(tour.rating)}</div>
                    <span className="ml-2 font-medium">{tour.rating}</span>
                    <span className="ml-1 text-gray-200">
                      ({tour.reviewCount || 0} {t("common.reviews", "reviews")})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-sm text-gray-600">
                    {t("tourDetails.duration", "Duration")}
                  </span>
                  <span className="font-medium">{tour.duration}h</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-sm text-gray-600">
                    {t("common.persons", "People")}
                  </span>
                  <span className="font-medium">{tour.maxParticipants}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Award className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-sm text-gray-600">
                    {t("tourDetails.difficulty", "Difficulty")}
                  </span>
                  <span className="font-medium">
                    {t(
                      `tours.${tour.difficulty.toLowerCase()}`,
                      tour.difficulty
                    )}
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-sm text-gray-600">
                    {t("tours.language", "Language")}
                  </span>
                  <span className="font-medium">{tour.language}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold mb-4">
                {t("tours.aboutExperience", "About this experience")}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {tour.description}
              </p>
            </div>

            {/* Included/Excluded */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Included */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    {t("tourDetails.included", "What's included")}
                  </h3>
                  <ul className="space-y-2">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Excluded */}
                {tour.excluded && tour.excluded.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <X className="w-5 h-5 text-red-600 mr-2" />
                      {t("tourDetails.excluded", "Not included")}
                    </h3>
                    <ul className="space-y-2">
                      {tour.excluded.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <X className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {t("tours.itinerary", "Itinerary")}
                </h2>
                <div className="space-y-6">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-blue-600 font-bold">
                          {item.time}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancellation Policy */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Shield className="w-6 h-6 text-blue-600 mr-2" />
                {t("tourDetails.cancellationPolicy", "Cancellation policy")}
              </h2>
              <p className="text-gray-700">{tour.cancellationPolicy}</p>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatCurrency(tour.price, tour.currency)}
                    </span>
                    <span className="text-gray-600 ml-2">
                      / {t("common.person", "person")}
                    </span>
                  </div>
                  {tour.originalPrice && tour.originalPrice > tour.price && (
                    <div className="flex items-center mt-1">
                      <span className="text-gray-500 line-through text-lg">
                        {formatCurrency(tour.originalPrice, tour.currency)}
                      </span>
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full ml-2">
                        {Math.round(
                          ((tour.originalPrice - tour.price) /
                            tour.originalPrice) *
                            100
                        )}
                        % OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Booking Form */}
                <BookingForm
                  tour={tour}
                  onSuccess={(booking) => {
                    console.log("Booking successful:", booking);
                  }}
                  onError={(error) => {
                    console.error("Booking error:", error);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
