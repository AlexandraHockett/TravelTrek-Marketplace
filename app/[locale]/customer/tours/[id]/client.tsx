// File: app/[locale]/customer/tours/[id]/client.tsx
// Location: CREATE in app/[locale]/customer/tours/[id]/client.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Wifi,
  Coffee,
  Car,
  ArrowLeft,
  Heart,
  Share2,
} from "lucide-react";
import { Tour, Booking } from "@/types";
import { useTranslations } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";
import BookingForm from "@/components/customer/BookingForm";

interface TourDetailClientProps {
  locale: string;
  tourId: string;
}

export default function TourDetailClient({
  locale,
  tourId,
}: TourDetailClientProps) {
  const t = useTranslations(locale);
  const router = useRouter();

  // State management
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch tour data from API
  const fetchTour = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/tours/${tourId}`);

      if (!response.ok) {
        if (response.status === 404) {
          router.push(`/${locale}/customer/tours`);
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const tourData = await response.json();
      setTour(tourData);
    } catch (error) {
      console.error("Error fetching tour:", error);
      setError(error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  // Load tour data on mount
  useEffect(() => {
    fetchTour();
  }, [tourId]);

  // Handle booking success
  const handleBookingSuccess = (booking: Booking) => {
    // Navigate to booking confirmation or bookings list
    router.push(`/${locale}/customer/bookings/${booking.id}`);
  };

  // Handle booking error
  const handleBookingError = (error: string) => {
    console.error("Booking error:", error);
    // Error is already shown in the BookingForm component
  };

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // TODO: Call API to save/remove favorite
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tour?.title,
          text: tour?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share failed:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Get amenity icon
  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, JSX.Element> = {
      wifi: <Wifi className="w-4 h-4" />,
      breakfast: <Coffee className="w-4 h-4" />,
      transport: <Car className="w-4 h-4" />,
    };
    return iconMap[amenity.toLowerCase()] || null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading skeleton is shown by Suspense boundary */}
      </div>
    );
  }

  // Error state
  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || t("errors.notFound")}
          </h2>
          <button
            onClick={() => router.push(`/${locale}/customer/tours`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Navigation and Actions */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center px-4 py-2 bg-white/90 rounded-lg hover:bg-white transition-colors backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors backdrop-blur-sm"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleFavoriteToggle}
              className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors backdrop-blur-sm"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
              />
            </button>
          </div>
        </div>

        {/* Title and Location */}
        <div className="absolute bottom-8 left-6 right-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-shadow">
            {tour.title}
          </h1>
          <div className="flex items-center text-lg opacity-90">
            <MapPin className="w-5 h-5 mr-2" />
            {tour.location}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tour Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              {tour.duration && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {tour.duration}
                </div>
              )}
              {tour.maxParticipants && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Max {tour.maxParticipants}{" "}
                  {tour.maxParticipants === 1
                    ? t("common.person")
                    : t("common.persons")}
                </div>
              )}
              {tour.rating && tour.reviewsCount && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                  {tour.rating} ({tour.reviewsCount} {t("tours.reviewsCount")})
                </div>
              )}
            </div>

            {/* Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("tourDetails.overview")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {tour.description}
              </p>
            </div>

            {/* What to Expect */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("tourDetails.whatToExpected")}
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  Experience authentic Portuguese culture with local insights
                  and hidden gems that only locals know about. This carefully
                  crafted tour combines history, culture, and gastronomy for an
                  unforgettable experience.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
                  <li>
                    Professional local guide with deep knowledge of the area
                  </li>
                  <li>Small group size for personalized attention</li>
                  <li>Authentic local experiences off the beaten path</li>
                  <li>Photo opportunities at the most scenic spots</li>
                </ul>
              </div>
            </div>

            {/* What's Included */}
            {tour.amenities && tour.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("tourDetails.included")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tour.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      {getAmenityIcon(amenity)}
                      <span className="ml-3 text-gray-700">
                        {t(`tours.${amenity}`) || amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meeting Point */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("tourDetails.meetingPoint")}
              </h2>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-gray-700">
                    Main entrance of {tour.location} Tourism Office
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your guide will be waiting with a TravelTrek sign. Please
                    arrive 15 minutes before the scheduled start time.
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            {tour.rating && tour.reviewsCount && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("tourDetails.reviews")} ({tour.reviewsCount})
                </h2>

                {/* Overall Rating */}
                <div className="flex items-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mr-4">
                    {tour.rating}
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(tour.rating!)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Based on {tour.reviewsCount} reviews
                    </p>
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        2 days ago
                      </span>
                    </div>
                    <p className="text-gray-700">
                      "Amazing experience! Our guide was incredibly
                      knowledgeable and passionate about sharing the local
                      culture."
                    </p>
                    <p className="text-sm text-gray-600 mt-1">- Sarah M.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingForm
                tour={tour}
                locale={locale}
                onSuccess={handleBookingSuccess}
                onError={handleBookingError}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for text shadow */}
      <style jsx>{`
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
