// File: app/[locale]/customer/page.tsx
// Location: REPLACE the existing app/[locale]/customer/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import { getTranslations, formatPrice } from "@/lib/utils"; // ✅ Import formatPrice instead
import type { Tour, Booking } from "@/types";

// ✅ STANDARD: Standard Promise interface
interface PageProps {
  params: Promise<{ locale: string }>;
}

// Mock data for recent tours (unchanged)
const createMockRecentTours = (locale: string): Tour[] => [
  {
    id: "t2",
    language: locale,
    title: "Sintra Royal Palaces",
    description: "Discover the magical palaces of Sintra",
    shortDescription: "Royal palaces tour",
    image: "/images/tours/sintra-palace.webp",
    images: ["/images/tours/sintra-palace.webp"],
    price: 65,
    originalPrice: 80,
    currency: "EUR",
    duration: 480,
    location: "Sintra, Portugal",
    rating: 4.8,
    reviewCount: 156,
    maxParticipants: 12,
    minimumAge: 8,
    difficulty: "Easy" as const,
    included: ["Transport", "Guide", "Palace tickets"],
    excluded: ["Lunch", "Personal expenses"],
    cancellationPolicy: "Free cancellation up to 24 hours",
    hostId: "h2",
    tags: ["Culture", "History", "Architecture"],
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
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
    ],
  },
  {
    id: "t3",
    language: locale,
    title: "Douro Valley River Cruise",
    description: "Sail through breathtaking Douro Valley",
    shortDescription: "River cruise experience",
    image: "/images/tours/douro-cruise.webp",
    images: ["/images/tours/douro-cruise.webp"],
    price: 95,
    originalPrice: 120,
    currency: "EUR",
    duration: 480,
    location: "Porto, Portugal",
    rating: 4.9,
    reviewCount: 203,
    maxParticipants: 20,
    minimumAge: 12,
    difficulty: "Easy" as const,
    included: ["River cruise", "Wine tasting", "Traditional lunch"],
    excluded: ["Hotel pickup", "Personal expenses"],
    cancellationPolicy: "Free cancellation up to 48 hours",
    hostId: "h3",
    tags: ["Nature", "Wine", "Cruise"],
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
    itinerary: [
      {
        time: "10:00",
        title: "Porto Departure",
        description: "Board the cruise at Ribeira",
      },
      {
        time: "12:00",
        title: "Wine Estate Visit",
        description: "Tour and tasting at local quintas",
      },
    ],
  },
];

// Mock bookings data (fully corrected structure)
const mockBookings: Booking[] = [
  {
    // ✅ FIXED: Complete booking data matching new interface

    // Core identifiers
    id: "b1",
    tourId: "t1",
    userId: "u1",

    // Tour details
    tourTitle: "Porto Historic Walking Tour",
    tourDescription:
      "Explore Porto's historic center with a knowledgeable local guide",
    tourImage: "/images/tours/porto-food.webp",
    location: "Porto, Portugal",
    duration: 180, // ✅ Now properly typed as number (minutes)

    // Customer information
    customerId: "u1",
    customerName: "Maria Silva",
    customerEmail: "maria.silva@email.com",
    customerPhone: "+351 912 345 678",

    // Host information
    hostId: "h1",
    hostName: "João Santos",
    hostEmail: "joao.santos@email.com",
    hostPhone: "+351 913 456 789",
    hostAvatar: "/images/hosts/joao.jpg",
    hostVerified: true,
    hostResponseTime: "Responde em 2 horas",

    // Booking details
    date: "2025-09-15",
    time: "14:30",
    participants: 2,
    specialRequests: "Vegetarian dietary requirements",
    meetingPoint: "Praça da Liberdade, junto à estátua",
    cancellationPolicy: "Cancelamento gratuito até 48h antes",

    // Pricing
    basePrice: 45.0,
    serviceFees: 20.0,
    totalAmount: 90.0, // ✅ Fixed: basePrice * participants + serviceFees
    totalPrice: 90.0,
    currency: "EUR",

    // Status
    status: "completed",
    paymentStatus: "paid",

    // Timestamps
    createdAt: "2025-08-20T15:30:00Z",
    updatedAt: "2025-08-20T15:30:00Z",
  },
];

// Generate metadata based on locale
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return {
    title: t.pages?.customerDashboard?.title || "Customer Dashboard",
    description:
      t.pages?.customerDashboard?.description ||
      "Manage your bookings and discover experiences",
  };
}

// Server Component
export default async function CustomerDashboardPage({ params }: PageProps) {
  const { locale } = await params;

  // Load translations on server
  const t = await getTranslations(locale);

  // Mock data with corrected language property
  const recentTours = createMockRecentTours(locale);

  // Calculate stats from corrected mock data
  const stats = {
    totalBookings: mockBookings.length,
    upcomingTrips: mockBookings.filter((b) => new Date(b.date) > new Date())
      .length,
    completedTrips: mockBookings.filter((b) => b.status === "completed").length,
    totalSpent: mockBookings.reduce((sum, b) => sum + b.totalAmount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.customer?.dashboard?.welcome || "Bem-vindo de volta!"} 👋
          </h1>
          <p className="text-gray-600">
            {t.customer?.dashboard?.subtitle ||
              "Aqui podes gerir as tuas reservas e descobrir novas experiências."}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">
                {t.customer?.dashboard?.stats?.totalBookings ||
                  "Total de Reservas"}
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalBookings}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-50">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">
                {t.customer?.dashboard?.stats?.upcomingTrips ||
                  "Próximas Viagens"}
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {stats.upcomingTrips}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-50">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">
                {t.customer?.dashboard?.stats?.completedTrips ||
                  "Viagens Concluídas"}
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {stats.completedTrips}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-50">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">
                {t.customer?.dashboard?.stats?.totalSpent || "Total Gasto"}
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {/* ✅ FIXED: Use formatPrice with proper currency and locale */}
                {formatPrice(stats.totalSpent, "EUR", locale)}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Tours Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Reservas Recentes
                </h2>
                <Link
                  href={`/${locale}/customer/bookings`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ver todas →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {mockBookings.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center space-x-4 py-3"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={booking.tourImage}
                      alt={booking.tourTitle}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {booking.tourTitle}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.date).toLocaleDateString()} •{" "}
                      {booking.participants} pessoa
                      {booking.participants > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {/* ✅ FIXED: Use formatPrice with proper parameters */}
                    {formatPrice(
                      booking.totalAmount,
                      booking.currency || "EUR",
                      locale
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Tours */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Tours Recomendados
              </h2>
            </div>
            <div className="p-6">
              {recentTours.slice(0, 3).map((tour) => (
                <div key={tour.id} className="flex items-center space-x-4 py-3">
                  <div className="flex-shrink-0">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {tour.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {tour.location} • ⭐ {tour.rating} ({tour.reviewCount})
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {/* ✅ FIXED: Use formatPrice with proper parameters */}
                    {formatPrice(tour.price, tour.currency, locale)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
