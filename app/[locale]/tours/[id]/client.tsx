// ===================================================================
// 📁 app/[locale]/tours/[id]/client.tsx
// Location: CRIAR em app/[locale]/tours/[id]/client.tsx
// Interactive tour details component
// ===================================================================

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  Euro,
  Check,
  X,
  Heart,
  Share2,
  MessageCircle,
  Shield,
  Award,
} from "lucide-react";
import type { Tour, Locale } from "@/types";

interface TourDetailClientProps {
  tour: Tour;
  locale: Locale;
}

// Simple translations for this component
const translations = {
  pt: {
    backToTours: "Voltar aos Tours",
    duration: "Duração",
    hours: "horas",
    maxParticipants: "Máximo",
    participants: "participantes",
    minimumAge: "Idade mínima",
    years: "anos",
    difficulty: "Dificuldade",
    easy: "Fácil",
    moderate: "Moderada",
    hard: "Difícil",
    bookNow: "Reservar Agora",
    pricePerPerson: "por pessoa",
    included: "Incluído",
    excluded: "Não incluído",
    description: "Descrição",
    itinerary: "Itinerário",
    cancellationPolicy: "Política de Cancelamento",
    hostInfo: "Informações do Anfitrião",
    reviews: "Avaliações",
    saveToWishlist: "Guardar",
    share: "Partilhar",
    contactHost: "Contactar Anfitrião",
    verifiedHost: "Anfitrião Verificado",
    responseTime: "Tempo de Resposta",
    language: "Idioma do Tour",
  },
  en: {
    backToTours: "Back to Tours",
    duration: "Duration",
    hours: "hours",
    maxParticipants: "Maximum",
    participants: "participants",
    minimumAge: "Minimum age",
    years: "years",
    difficulty: "Difficulty",
    easy: "Easy",
    moderate: "Moderate",
    hard: "Hard",
    bookNow: "Book Now",
    pricePerPerson: "per person",
    included: "Included",
    excluded: "Not included",
    description: "Description",
    itinerary: "Itinerary",
    cancellationPolicy: "Cancellation Policy",
    hostInfo: "Host Information",
    reviews: "Reviews",
    saveToWishlist: "Save",
    share: "Share",
    contactHost: "Contact Host",
    verifiedHost: "Verified Host",
    responseTime: "Response Time",
    language: "Tour Language",
  },
  es: {
    backToTours: "Volver a Tours",
    duration: "Duración",
    hours: "horas",
    maxParticipants: "Máximo",
    participants: "participantes",
    minimumAge: "Edad mínima",
    years: "años",
    difficulty: "Dificultad",
    easy: "Fácil",
    moderate: "Moderada",
    hard: "Difícil",
    bookNow: "Reservar Ahora",
    pricePerPerson: "por persona",
    included: "Incluido",
    excluded: "No incluido",
    description: "Descripción",
    itinerary: "Itinerario",
    cancellationPolicy: "Política de Cancelación",
    hostInfo: "Información del Anfitrión",
    reviews: "Reseñas",
    saveToWishlist: "Guardar",
    share: "Compartir",
    contactHost: "Contactar Anfitrión",
    verifiedHost: "Anfitrión Verificado",
    responseTime: "Tiempo de Respuesta",
    language: "Idioma del Tour",
  },
  fr: {
    backToTours: "Retour aux Tours",
    duration: "Durée",
    hours: "heures",
    maxParticipants: "Maximum",
    participants: "participants",
    minimumAge: "Âge minimum",
    years: "ans",
    difficulty: "Difficulté",
    easy: "Facile",
    moderate: "Modérée",
    hard: "Difficile",
    bookNow: "Réserver Maintenant",
    pricePerPerson: "par personne",
    included: "Inclus",
    excluded: "Non inclus",
    description: "Description",
    itinerary: "Itinéraire",
    cancellationPolicy: "Politique d'Annulation",
    hostInfo: "Informations sur l'Hôte",
    reviews: "Avis",
    saveToWishlist: "Sauvegarder",
    share: "Partager",
    contactHost: "Contacter l'Hôte",
    verifiedHost: "Hôte Vérifié",
    responseTime: "Temps de Réponse",
    language: "Langue du Tour",
  },
  de: {
    backToTours: "Zurück zu Tours",
    duration: "Dauer",
    hours: "Stunden",
    maxParticipants: "Maximum",
    participants: "Teilnehmer",
    minimumAge: "Mindestalter",
    years: "Jahre",
    difficulty: "Schwierigkeit",
    easy: "Einfach",
    moderate: "Moderat",
    hard: "Schwer",
    bookNow: "Jetzt Buchen",
    pricePerPerson: "pro Person",
    included: "Inbegriffen",
    excluded: "Nicht inbegriffen",
    description: "Beschreibung",
    itinerary: "Reiseverlauf",
    cancellationPolicy: "Stornierungsrichtlinie",
    hostInfo: "Host-Informationen",
    reviews: "Bewertungen",
    saveToWishlist: "Speichern",
    share: "Teilen",
    contactHost: "Host Kontaktieren",
    verifiedHost: "Verifizierter Host",
    responseTime: "Antwortzeit",
    language: "Tour-Sprache",
  },
};

export default function TourDetailClient({
  tour,
  locale,
}: TourDetailClientProps) {
  const t = translations[locale] || translations.en;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const difficultyText =
    tour.difficulty === "Easy"
      ? t.easy
      : tour.difficulty === "Moderate"
        ? t.moderate
        : t.hard;

  const difficultyColor =
    tour.difficulty === "Easy"
      ? "bg-green-100 text-green-800"
      : tour.difficulty === "Moderate"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={tour.images?.[selectedImageIndex] || tour.image}
          alt={tour.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Back button */}
        <Link
          href={`/${locale}/tours`}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToTours}
        </Link>

        {/* Action buttons */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`p-3 rounded-lg transition-all ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white bg-opacity-90 hover:bg-opacity-100"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>
          <button className="p-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-2">{tour.title}</h1>
            <div className="flex items-center gap-4 text-lg">
              <div className="flex items-center gap-1">
                <MapPin className="w-5 h-5" />
                {tour.location}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                {tour.rating} ({tour.reviewCount} {t.reviews.toLowerCase()})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image thumbnails */}
      {tour.images && tour.images.length > 1 && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-3 overflow-x-auto">
              {tour.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${tour.title} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tour Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg border p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-gray-500">{t.duration}</div>
                  <div className="font-semibold">
                    {tour.duration} {t.hours}
                  </div>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-gray-500">
                    {t.maxParticipants}
                  </div>
                  <div className="font-semibold">
                    {tour.maxParticipants} {t.participants}
                  </div>
                </div>
                {tour.minimumAge && (
                  <div className="text-center">
                    <Shield className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm text-gray-500">{t.minimumAge}</div>
                    <div className="font-semibold">
                      {tour.minimumAge} {t.years}
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <Award className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-gray-500">{t.difficulty}</div>
                  <div
                    className={`inline-block px-2 py-1 rounded text-sm font-medium ${difficultyColor}`}
                  >
                    {difficultyText}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-2xl font-semibold mb-4">{t.description}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {tour.description}
              </p>
            </div>

            {/* Included/Excluded */}
            <div className="bg-white rounded-lg border p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Included */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-700">
                    {t.included}
                  </h3>
                  <ul className="space-y-2">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Excluded */}
                {tour.excluded && tour.excluded.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-700">
                      {t.excluded}
                    </h3>
                    <ul className="space-y-2">
                      {tour.excluded.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
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
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-2xl font-semibold mb-4">{t.itinerary}</h2>
                <div className="space-y-4">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-16 text-sm font-medium text-blue-600">
                        {item.time}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancellation Policy */}
            {tour.cancellationPolicy && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  {t.cancellationPolicy}
                </h2>
                <p className="text-gray-700">{tour.cancellationPolicy}</p>
              </div>
            )}
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Booking Card */}
              <div className="bg-white rounded-lg border p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    €{tour.price}
                    <span className="text-lg font-normal text-gray-500 ml-2">
                      {t.pricePerPerson}
                    </span>
                  </div>
                  {tour.originalPrice &&
                    Number(tour.originalPrice) > Number(tour.price) && (
                      <div className="text-lg text-gray-400 line-through">
                        €{tour.originalPrice}
                      </div>
                    )}
                </div>

                <Link
                  href={`/${locale}/auth/login?callbackUrl=/${locale}/tours/${tour.id}/book`}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                >
                  {t.bookNow}
                </Link>

                <button className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  {t.contactHost}
                </button>
              </div>

              {/* Tags */}
              {tour.tags && tour.tags.length > 0 && (
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex flex-wrap gap-2">
                    {tour.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
