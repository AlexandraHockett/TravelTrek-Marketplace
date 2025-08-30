// File: app/[locale]/customer/tours/[id]/page.tsx
// Location: Replace your existing app/[locale]/customer/tours/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { notFound, useParams, usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  MapPin,
  Users,
  Clock,
  Star,
  Calendar,
  Shield,
  Heart,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getTranslations } from "@/lib/utils";
import { Tour } from "@/types";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import BookingForm from "@/components/customer/BookingForm";

interface ExtendedTour extends Tour {
  longDescription?: string;
  highlights?: string[];
  languages?: string[];
  hostName?: string;
  hostAvatar?: string;
  hostResponseTime?: string;
  meetingPoint?: string;
  isBookmarked?: boolean;
  availableDates?: string[];
  category?: string;
}

interface BookingFormData {
  tourId: string;
  date: string;
  participants: number;
  specialRequests: string;
  totalAmount: number;
}

export default function TourDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  const [tour, setTour] = useState<ExtendedTour | null>(null);
  const [loading, setLoading] = useState(true);
  const [t, setTranslations] = useState<any>({});

  const locale = (params?.locale as string) || "pt";
  const id = params?.id as string;

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load translations
        const translations = await getTranslations(locale);
        setTranslations(translations);

        // Load tour data
        if (id) {
          const response = await fetch(`/api/tours/${id}`);
          if (response.ok) {
            const tourData = await response.json();
            setTour(tourData);
          } else {
            setTour(null);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setTour(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [locale, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="h-96 bg-gray-200 rounded mb-6"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return notFound();
  }

  const discount = tour.originalPrice
    ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
    : 0;

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "challenging":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCancellationPolicyColor = (policy: string): string => {
    switch (policy.toLowerCase()) {
      case "flexible":
        return "text-green-600";
      case "moderate":
        return "text-yellow-600";
      case "strict":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/images/placeholder.webp";
  };

  const handleBookingComplete = (bookingData: BookingFormData) => {
    // Handle successful booking
    window.location.href = `/${locale}/customer/bookings/${bookingData.tourId}`;
  };

  const toggleBookmark = () => {
    console.log("Toggle bookmark");
    // Implement bookmark toggle logic
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tour.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert("Link copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link
            href={`/${locale}/customer/tours`}
            className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.tourDetails?.backToTours || "Back to Tours"}</span>
          </Link>
          <span>→</span>
          <span className="text-gray-900">{tour.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative group mb-6">
              <div className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden">
                <img
                  src={tour.images?.[0] || tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              {tour.images && tour.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {tour.images.slice(1, 5).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`${tour.title} - Image ${index + 2}`}
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
                        onError={handleImageError}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title and Basic Info */}
            <Card className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge
                  variant="default"
                  className={getDifficultyColor(tour.difficulty)}
                >
                  {t.tours?.difficulty?.[tour.difficulty.toLowerCase()] ||
                    tour.difficulty}
                </Badge>
                <Badge variant="default">
                  {tour.duration} {t.tourDetails?.hours || "hours"}
                </Badge>
                <Badge variant="default">
                  {t.tourDetails?.upTo || "Up to"} {tour.maxParticipants}{" "}
                  {t.tourDetails?.people || "people"}
                </Badge>
                {tour.minimumAge && (
                  <Badge variant="default">
                    +{tour.minimumAge} {t.tourDetails?.years || "years"}
                  </Badge>
                )}
                {tour.category && (
                  <Badge variant="info" className="bg-blue-50 text-blue-700">
                    {t.tours?.categories?.[tour.category] || tour.category}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {tour.title}
              </h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                  <span className="font-semibold">{tour.rating}</span>
                  <span className="text-gray-600 ml-2">
                    ({tour.reviewCount} {t.tourDetails?.reviews || "reviews"})
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {tour.location}
                </div>
                {tour.languages && tour.languages.length > 0 && (
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {tour.languages.join(", ")}
                  </div>
                )}
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {tour.description}
              </p>

              {tour.longDescription && (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600">{tour.longDescription}</p>
                </div>
              )}
            </Card>

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    {t.tourDetails?.highlights || "Highlights"}
                  </h3>
                  <ul className="space-y-2">
                    {tour.highlights.map((highlight: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}

            {/* What's Included/Excluded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    {t.tourDetails?.whatsIncluded || "What's Included"}
                  </h3>
                  <ul className="space-y-2">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              {tour.excluded && tour.excluded.length > 0 && (
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      {t.tourDetails?.whatsExcluded || "What's Excluded"}
                    </h3>
                    <ul className="space-y-2">
                      {tour.excluded.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <XCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              )}
            </div>

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    {t.tourDetails?.itinerary || "Itinerary"}
                  </h3>
                  <div className="space-y-4">
                    {tour.itinerary.map((item, index) => (
                      <div key={index} className="flex space-x-4">
                        <div className="flex-shrink-0 w-16 text-sm font-medium text-blue-600">
                          {item.time}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Host Information */}
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t.tourDetails?.aboutHost || "About Your Host"}
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {(tour.hostName || "Host").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {tour.hostName || "Host"}
                    </h4>
                    {tour.hostResponseTime && (
                      <p className="text-sm text-gray-600">
                        {t.tourDetails?.responseTime || "Response time"}:{" "}
                        {tour.hostResponseTime}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Important Information */}
            <Card className="bg-yellow-50 border-yellow-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-yellow-800">
                  <Info className="w-5 h-5 mr-2" />
                  {t.tourDetails?.importantInfo || "Important Information"}
                </h3>
                <div className="space-y-3 text-sm text-yellow-800">
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      {t.tourDetails?.meetingInstructions ||
                        "Please arrive at the meeting point 15 minutes before the tour starts"}
                    </span>
                  </div>
                  {tour.meetingPoint && (
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>
                          {t.tourDetails?.meetingPoint || "Meeting Point"}:
                        </strong>{" "}
                        {tour.meetingPoint}
                      </span>
                    </div>
                  )}
                  <div className="flex items-start">
                    <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span
                      className={getCancellationPolicyColor(
                        tour.cancellationPolicy
                      )}
                    >
                      <strong>
                        {t.tourDetails?.cancellationPolicy ||
                          "Cancellation Policy"}
                        :
                      </strong>{" "}
                      {t.tourDetails?.cancellationPolicies?.[
                        tour.cancellationPolicy.toLowerCase()
                      ] || tour.cancellationPolicy}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="shadow-lg">
                <div className="p-6">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900">
                        €{tour.price.toFixed(2)}
                      </span>
                      {tour.originalPrice && (
                        <>
                          <span className="text-lg text-gray-500 line-through">
                            €{tour.originalPrice.toFixed(2)}
                          </span>
                          <Badge variant="error" className="text-xs">
                            -{discount}%
                          </Badge>
                        </>
                      )}
                    </div>
                    <span className="text-gray-600">
                      {t.tours?.perPerson || "per person"}
                    </span>
                  </div>

                  {/* Booking Form */}
                  <BookingForm
                    tour={tour}
                    onBookingComplete={handleBookingComplete}
                  />

                  {/* Quick Actions */}
                  <div className="flex space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={toggleBookmark}
                    >
                      <Heart
                        className={`w-4 h-4 mr-2 ${tour.isBookmarked ? "fill-current text-red-500" : ""}`}
                      />
                      {tour.isBookmarked
                        ? t.tours?.removeFromWishlist || "Remove"
                        : t.tours?.addToWishlist || "Save"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      {t.tourDetails?.share || "Share"}
                    </Button>
                  </div>

                  {/* Trust indicators */}
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-green-500" />
                      {t.tourDetails?.securePayment || "Secure payment"}
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {t.tourDetails?.instantConfirmation ||
                        "Instant confirmation"}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-green-500" />
                      {t.tourDetails?.flexibleCancellation ||
                        "Flexible cancellation"}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contact Host Card */}
              <Card className="mt-4">
                <div className="p-4">
                  <h4 className="font-semibold mb-2">
                    {t.tourDetails?.needHelp || "Need Help?"}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {t.tourDetails?.contactHostMessage ||
                      "Contact the host for any questions about this experience"}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    {t.tourDetails?.contactHost || "Contact Host"}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
