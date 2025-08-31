// File: app/[locale]/customer/tours/[id]/client.tsx  
// Location: CREATE this NEW file in app/[locale]/customer/tours/[id]/

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Heart,
  Share2,
  Shield,
  Info,
  CheckCircle,
  XCircle,
  Camera,
  ArrowLeft,
  MessageCircle,
  Award,
  Globe
} from "lucide-react";

import { Tour, Translations } from "@/types";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import BookingForm from "@/components/customer/BookingForm";

interface TourDetailClientProps {
  tour: Tour;
  translations: Translations;
  locale: string;
}

export default function TourDetailClient({
  tour,
  translations: t,
  locale,
}: TourDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "reviews">("overview");

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API call
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: tour.title,
        text: tour.shortDescription || tour.description,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to clipboard if Web Share API is not available
      try {
        await navigator.clipboard.writeText(window.location.href);
        // TODO: Show toast notification
      } catch (clipboardError) {
        console.error("Failed to copy to clipboard:", clipboardError);
      }
    }
  };

  const images = tour.images || [tour.image];

  const tabs = [
    { key: "overview", label: t.tourDetails?.overview || "Visão Geral" },
    { key: "itinerary", label: t.tourDetails?.itinerary || "Itinerário" },
    { key: "reviews", label: t.tourDetails?.reviews || "Avaliações" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Link href={`/${locale}/customer/tours`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t.common?.back || "Voltar"}
            </Button>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tour Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-[4/3] group">
                <Image
                  src={images[selectedImageIndex]}
                  alt={tour.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  priority
                  onError={() => {
                    // TODO: Set fallback image
                  }}
                />
                
                {/* Image Navigation Dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === selectedImageIndex
                              ? "bg-white"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleWishlistToggle}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShare}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Photo Count */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4">
                    <Badge className="bg-black/50 text-white">
                      <Camera className="w-3 h-3 mr-1" />
                      {selectedImageIndex + 1}/{images.length}
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex space-x-3 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === selectedImageIndex
                            ? "border-blue-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${tour.title} - foto ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Tour Header */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${
                      tour.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                      tour.difficulty === "Moderate" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {t.tourDetails?.difficulty?.[tour.difficulty.toLowerCase()] || tour.difficulty}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      {tour.duration} {tour.duration === 1 ? t.common?.hour || "hora" : t.common?.hours || "horas"}
                    </Badge>
                    {tour.minimumAge && (
                      <Badge className="bg-purple-100 text-purple-800">
                        {tour.minimumAge}+ {t.tourDetails?.years || "anos"}
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{tour.title}</h1>
                  
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-medium">{tour.rating}</span>
                      <span className="ml-1">
                        ({tour.reviewCount} {t.tourDetails?.reviews || "avaliações"})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{tour.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{t.tours?.upTo || "até"} {tour.maxParticipants}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">{tour.description}</p>
                </div>
              </div>
            </Card>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* What's Included */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      {t.tourDetails?.included || "Incluído"}
                    </h3>
                    <ul className="space-y-2">
                      {tour.included.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {/* What's Excluded */}
                  {tour.excluded && tour.excluded.length > 0 && (
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <XCircle className="w-5 h-5 text-red-500 mr-2" />
                        {t.tourDetails?.excluded || "Não Incluído"}
                      </h3>
                      <ul className="space-y-2">
                        {tour.excluded.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <XCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {/* Important Information */}
                  <Card className="p-6 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Info className="w-5 h-5 text-blue-500 mr-2" />
                      {t.tourDetails?.importantInfo || "Informações Importantes"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <span className="text-gray-600 text-sm block">
                          {t.tourDetails?.maxParticipants || "Máx. participantes"}
                        </span>
                        <span className="font-medium">{tour.maxParticipants} {t.common?.persons || "pessoas"}</span>
                      </div>
                      {tour.minimumAge && (
                        <div>
                          <span className="text-gray-600 text-sm block">
                            {t.tourDetails?.minAge || "Idade mínima"}
                          </span>
                          <span className="font-medium">{tour.minimumAge} {t.tourDetails?.years || "anos"}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600 text-sm block">
                          {t.tourDetails?.cancellationPolicy || "Política de cancelamento"}
                        </span>
                        <span className="font-medium text-sm">{tour.cancellationPolicy}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "itinerary" && tour.itinerary && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    {t.tourDetails?.detailedItinerary || "Itinerário Detalhado"}
                  </h3>
                  <div className="space-y-6">
                    {tour.itinerary.map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 pb-6 border-b border-gray-200 last:border-b-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-blue-600">{item.time}</span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {activeTab === "reviews" && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    {t.tourDetails?.customerReviews || "Avaliações dos Clientes"}
                  </h3>
                  
                  {/* Rating Summary */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="text-4xl font-bold text-gray-900 mr-3">{tour.rating}</div>
                        <div>
                          <div className="flex items-center mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(tour.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} 
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-600">
                            {tour.reviewCount} {t.tourDetails?.reviews || "avaliações"}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        {t.tourDetails?.beFirstReview || "Deixe uma avaliação"}
                      </Button>
                    </div>
                  </div>

                  {/* No Reviews State */}
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">
                      {t.tourDetails?.noReviewsYet || "Ainda não há avaliações para esta experiência."}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {t.tourDetails?.beFirstReview || "Seja o primeiro a deixar uma avaliação!"}
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Booking Card */}
              <Card className="p-6">
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatCurrency(tour.price)}
                    </span>
                    <span className="text-gray-600">
                      / {t.bookingForm?.perPerson || "por pessoa"}
                    </span>
                  </div>
                  {tour.originalPrice && tour.originalPrice > tour.price && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-gray-500 line-through text-lg">
                        {formatCurrency(tour.originalPrice)}
                      </span>
                      <Badge className="bg-red-100 text-red-800">
                        -{Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)}%
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center space-x-4 mb-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-green-500 mr-1" />
                    <span>{t.bookingForm?.freeCancellation || "Cancelamento gratuito"}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span>{t.bookingForm?.instantConfirmation || "Confirmação instantânea"}</span>
                  </div>
                </div>

                {/* Booking Form */}
                <BookingForm
                  tour={tour}
                  onSuccess={(booking: any) => {
                    console.log("Booking successful:", booking);
                    // TODO: Navigate to booking confirmation page
                  }}
                  onError={(error: string) => {
                    console.error("Booking error:", error);
                    // TODO: Show error message
                  }}
                />
              </Card>

              {/* Host Info Card */}
              <Card className="p-6">
                <h4 className="font-medium text-gray-900 mb-4">
                  {t.tourDetails?.hostInfo || "Sobre o Anfitrião"}
                </h4>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Maria Santos</div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      {t.tourDetails?.verified || "Verificado"}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span>{t.tourDetails?.responseTime || "Tempo de resposta"}: < 1 hora</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    <span>Português, English, Español</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  {t.bookingDetails?.contactHost || "Contactar Anfitrião"}
                </Button>
              </Card>

              {/* Help Card */}
              <Card className="p-4">
                <div className="text-center">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {t.tourDetails?.needHelp || "Precisa de Ajuda?"}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {t.tourDetails?.contactSupport || "A nossa equipa está disponível 24/7 para apoio."}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    {t.tourDetails?.contactUs || "Contactar-nos"}
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