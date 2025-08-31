// File: app/[locale]/customer/tours/[id]/page.tsx
// Location: SUBSTITUIR o ficheiro existente

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "@/lib/utils";
import type { Tour } from "@/types";
import { TourImage } from "@/components/shared";

// Tipagem para os params
interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

// Função para resolver params
async function resolveParams(params: PageProps["params"]) {
  return await Promise.resolve(params);
}

// Mock data - substituir por API real posteriormente
const createMockTours = (locale: string): Tour[] => [
  {
    id: "t1",
    language: locale, // ✅ ADICIONADO: Propriedade language obrigatória
    title: "Porto Food & Wine Tour",
    description:
      "Embark on a culinary journey through Porto's historic streets and discover the authentic flavors of Portuguese cuisine. This guided tour takes you to family-run restaurants, traditional markets, and local wine bars where you'll sample the best of what Porto has to offer.",
    shortDescription: "Authentic Portuguese cuisine tour with wine tastings",
    image: "/images/tours/porto-food.webp",
    images: [
      "/images/tours/porto-food.webp",
      "/images/tours/porto-food-2.webp",
      "/images/tours/porto-food-3.webp",
    ],
    price: 45,
    originalPrice: 60,
    currency: "EUR",
    duration: 4,
    location: "Porto, Portugal",
    rating: 4.9,
    reviewCount: 128,
    maxParticipants: 12,
    minimumAge: 18,
    difficulty: "Easy" as const,
    included: [
      "Professional local guide",
      "Food tastings at 5 different venues",
      "Port wine and green wine samples",
      "Traditional Portuguese dessert",
    ],
    excluded: [
      "Hotel pickup and drop-off",
      "Additional drinks beyond tastings",
      "Gratuities",
    ],
    cancellationPolicy: "Free cancellation up to 24 hours before the tour",
    hostId: "h1",
    tags: ["Food", "Wine", "Culture", "Walking"],
    createdAt: "2025-08-15T10:00:00Z",
    updatedAt: "2025-08-20T14:30:00Z",
    // ✅ ADICIONADO: Propriedades em falta na interface Tour
    itinerary: [
      {
        time: "10:00",
        title: "Meeting Point",
        description: "Meet at Mercado do Bolhão entrance",
      },
      {
        time: "10:30",
        title: "Traditional Market",
        description: "Explore local produce and specialties",
      },
      {
        time: "11:30",
        title: "Wine Tasting",
        description: "Sample Port wines at traditional cellar",
      },
      {
        time: "13:00",
        title: "Local Restaurant",
        description: "Authentic Portuguese lunch experience",
      },
    ],
  },
  {
    id: "t2",
    language: locale, // ✅ ADICIONADO: Propriedade language obrigatória
    title: "Sintra Royal Palaces",
    description:
      "Visit the majestic palaces of Sintra, UNESCO World Heritage site, with specialist guide. Explore the colorful Pena Palace and mysterious Quinta da Regaleira with its underground tunnels and mystical gardens.",
    shortDescription: "Royal palaces and mystical gardens tour",
    image: "/images/tours/sintra-palace.webp",
    images: [
      "/images/tours/sintra-palace.webp",
      "/images/tours/sintra-palace-2.webp",
      "/images/tours/quinta-regaleira.webp",
    ],
    price: 65,
    originalPrice: 80,
    currency: "EUR",
    duration: 8,
    location: "Sintra, Portugal",
    rating: 4.8,
    reviewCount: 156,
    maxParticipants: 12,
    minimumAge: 8,
    difficulty: "Moderate" as const,
    included: [
      "Professional guide",
      "Transportation from Sintra station",
      "Palace entrance tickets",
      "Traditional Portuguese snack",
    ],
    excluded: ["Train ticket to Sintra", "Lunch", "Personal expenses"],
    cancellationPolicy: "Free cancellation up to 48 hours before the tour",
    hostId: "h2",
    tags: ["Culture", "History", "Architecture", "UNESCO"],
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
    // ✅ ADICIONADO: Propriedades em falta na interface Tour
    itinerary: [
      {
        time: "09:00",
        title: "Sintra Station",
        description: "Meet at Sintra train station",
      },
      {
        time: "09:30",
        title: "Pena Palace",
        description: "Explore the colorful romantic palace",
      },
      {
        time: "12:00",
        title: "Sintra Village",
        description: "Traditional lunch break and exploration",
      },
      {
        time: "14:00",
        title: "Quinta da Regaleira",
        description: "Discover mystical gardens and underground tunnels",
      },
    ],
  },
  {
    id: "t3",
    language: locale, // ✅ ADICIONADO: Propriedade language obrigatória
    title: "Douro Valley River Cruise",
    description:
      "Sail through the breathtaking Douro Valley, a UNESCO World Heritage landscape of terraced vineyards. Enjoy wine tastings at renowned quintas while admiring the spectacular river views and century-old traditions.",
    shortDescription: "Scenic river cruise with wine tastings",
    image: "/images/tours/douro-cruise.webp",
    images: [
      "/images/tours/douro-cruise.webp",
      "/images/tours/douro-valley.webp",
      "/images/tours/douro-vineyards.webp",
    ],
    price: 89,
    originalPrice: 110,
    currency: "EUR",
    duration: 10,
    location: "Douro Valley, Portugal",
    rating: 4.9,
    reviewCount: 203,
    maxParticipants: 18,
    minimumAge: 12,
    difficulty: "Easy" as const,
    included: [
      "River cruise boat",
      "Professional wine guide",
      "Wine tastings at 2 quintas",
      "Traditional lunch with regional specialties",
      "Transportation from Porto",
    ],
    excluded: ["Additional wine purchases", "Personal expenses", "Gratuities"],
    cancellationPolicy: "Free cancellation up to 72 hours before the tour",
    hostId: "h3",
    tags: ["Wine", "Nature", "Cruise", "UNESCO", "Food"],
    createdAt: "2025-07-20T00:00:00Z",
    updatedAt: "2025-08-10T00:00:00Z",
    // ✅ ADICIONADO: Propriedades em falta na interface Tour
    itinerary: [
      {
        time: "08:30",
        title: "Porto Departure",
        description: "Pickup from central Porto locations",
      },
      {
        time: "10:00",
        title: "Régua Embarkation",
        description: "Board the cruise boat at Peso da Régua",
      },
      {
        time: "10:30",
        title: "River Cruise",
        description: "Scenic cruise through terraced vineyards",
      },
      {
        time: "12:30",
        title: "Quinta Wine Tasting",
        description: "First wine tasting with regional cheeses",
      },
      {
        time: "14:00",
        title: "Traditional Lunch",
        description: "Regional lunch at riverside quinta",
      },
      {
        time: "16:00",
        title: "Second Quinta",
        description: "Visit another wine estate for tastings",
      },
      {
        time: "17:30",
        title: "Return to Porto",
        description: "Comfortable return journey",
      },
    ],
  },
];

// Metadata dinâmica baseada no locale e tour ID
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await resolveParams(params);
  const { locale, id } = resolvedParams;
  const t = await getTranslations(locale);

  // Buscar tour específico
  const tours = createMockTours(locale);
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    return {
      title: t.errors?.notFound || "Tour Not Found",
      description: "Tour not available",
    };
  }

  return {
    title: `${tour.title} | TravelTrek`,
    description: tour.shortDescription || tour.description,
  };
}

// Server Component principal
export default async function TourDetailPage({ params }: PageProps) {
  const resolvedParams = await resolveParams(params);
  const { locale, id } = resolvedParams;

  // Carrega as traduções no servidor
  const t = await getTranslations(locale);

  // Buscar tour específico
  const tours = createMockTours(locale);
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tour Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {tour.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★</span>
                <span className="font-medium">{tour.rating}</span>
                <span>
                  ({tour.reviewCount} {t.common?.reviews || "reviews"})
                </span>
              </div>
              <div>📍 {tour.location}</div>
              <div>
                ⏱️ {tour.duration}{" "}
                {tour.duration === 1 ? t.common?.hour : t.common?.hours}
              </div>
              <div>
                👥 {t.tourDetails?.maxParticipants || "Max"}{" "}
                {tour.maxParticipants}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tour.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Tour Image */}
          <div className="mb-8">
            <TourImage
              src={tour.image}
              alt={tour.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
              priority={true}
            />
          </div>

          {/* Tour Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">
                  {t.tourDetails?.overview || "Overview"}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {tour.description}
                </p>
              </div>

              {/* Itinerary */}
              {tour.itinerary && tour.itinerary.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-4">
                    {t.tourDetails?.itinerary || "Itinerary"}
                  </h2>
                  <div className="space-y-4">
                    {tour.itinerary.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-16 text-sm font-medium text-blue-600">
                          {item.time}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What's Included */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-green-600">
                    ✓ {t.tourDetails?.included || "Included"}
                  </h3>
                  <ul className="space-y-2">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {tour.excluded && tour.excluded.length > 0 && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-red-600">
                      ✗ {t.tourDetails?.excluded || "Not Included"}
                    </h3>
                    <ul className="space-y-2">
                      {tour.excluded.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">✗</span>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Important Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  {t.tourDetails?.importantInfo || "Important Information"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <div className="mb-3">
                      <span className="font-medium text-gray-900">
                        {t.tourDetails?.difficulty?.label || "Difficulty"}:
                      </span>
                      <span className="ml-2 text-gray-700">
                        {tour.difficulty === "Easy"
                          ? t.tourDetails?.difficulty?.easy || "Easy"
                          : tour.difficulty === "Moderate"
                            ? t.tourDetails?.difficulty?.moderate || "Moderate"
                            : t.tourDetails?.difficulty?.challenging ||
                              "Challenging"}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="font-medium text-gray-900">
                        {t.tourDetails?.minAge || "Minimum age"}:
                      </span>
                      <span className="ml-2 text-gray-700">
                        {tour.minimumAge} {t.tourDetails?.years || "years"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        {t.tourDetails?.groupSize || "Group size"}:
                      </span>
                      <span className="ml-2 text-gray-700">
                        {t.tourDetails?.maxParticipants || "Up to"}{" "}
                        {tour.maxParticipants} {t.common?.persons}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-3">
                      <span className="font-medium text-gray-900">
                        {t.tourDetails?.duration || "Duration"}:
                      </span>
                      <span className="ml-2 text-gray-700">
                        {tour.duration}{" "}
                        {tour.duration === 1 ? t.common?.hour : t.common?.hours}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        {t.tourDetails?.cancellationPolicy || "Cancellation"}:
                      </span>
                      <span className="ml-2 text-gray-700">
                        {tour.cancellationPolicy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {tour.originalPrice &&
                        tour.originalPrice > tour.price && (
                          <span className="text-lg text-gray-500 line-through">
                            €{tour.originalPrice}
                          </span>
                        )}
                      <span className="text-3xl font-bold text-gray-900">
                        €{tour.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {t.bookingForm?.perPerson || "per person"}
                    </p>
                  </div>

                  {/* Booking Form Placeholder */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.bookingForm?.experienceDate || "Experience date"}
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.bookingForm?.participants || "Participants"}
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        {[...Array(tour.maxParticipants)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}{" "}
                            {i === 0 ? t.common?.person : t.common?.persons}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      {t.tourDetails?.bookNow || "Book Now"}
                    </button>

                    <p className="text-xs text-center text-gray-500">
                      {t.bookingForm?.noChargeYet || "You won't be charged yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
