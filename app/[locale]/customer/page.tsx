// File: app/[locale]/customer/page.tsx
// Location: REPLACE the mock bookings section with this corrected version

import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
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
    description: "Sail through breathtaking Douro Valley landscapes",
    shortDescription: "Scenic river cruise with wine tastings",
    image: "/images/tours/douro-cruise.webp",
    images: ["/images/tours/douro-cruise.webp"],
    price: 85,
    originalPrice: 95,
    currency: "EUR",
    duration: 360,
    location: "Porto, Portugal",
    rating: 4.9,
    reviewCount: 89,
    maxParticipants: 20,
    minimumAge: 18,
    difficulty: "Easy" as const,
    included: ["Boat cruise", "Wine tasting", "Snacks"],
    excluded: ["Hotel pickup", "Lunch"],
    cancellationPolicy: "Free cancellation up to 48 hours",
    hostId: "h3",
    tags: ["Nature", "Wine", "Relaxation"],
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
    itinerary: [
      {
        time: "14:00",
        title: "Porto Dock",
        description: "Board the river cruise boat",
      },
      {
        time: "15:30",
        title: "Wine Tasting",
        description: "Sample local Douro wines",
      },
    ],
  },
];

// ✅ CORRECTED: Complete mock bookings data with ALL required properties
const mockBookings: Booking[] = [
  {
    // Core booking info
    id: "bk1",
    userId: "user1", // ✅ ADDED
    tourId: "tour1",
    tourTitle: "Porto Walking Tour",
    tourDescription: "Discover the historic charm of Porto with local insights", // ✅ ADDED
    tourImage: "/images/tours/porto-walking.jpg", // ✅ ADDED
    location: "Porto, Portugal", // ✅ ADDED

    // Customer info
    customerId: "customer1",
    customerName: "Maria Silva", // ✅ ADDED
    customerEmail: "maria.silva@email.com", // ✅ ADDED

    // Host info
    hostId: "host1",
    hostName: "João Santos", // ✅ ADDED
    hostEmail: "joao.santos@email.com", // ✅ ADDED
    hostPhone: "+351 912 345 678", // ✅ ADDED
    hostAvatar: "/images/hosts/joao.jpg", // ✅ ADDED
    hostVerified: true, // ✅ ADDED
    hostResponseTime: "Responde em 2 horas", // ✅ ADDED

    // Booking details
    date: "2025-09-15",
    time: "14:00",
    participants: 2,
    specialRequests: "Preferimos um ritmo mais lento", // ✅ ADDED
    meetingPoint: "Praça da Liberdade, junto à estátua", // ✅ ADDED
    cancellationPolicy: "Cancelamento gratuito até 24h antes", // ✅ ADDED

    // Pricing
    basePrice: 37.5,
    serviceFees: 0.0,
    totalAmount: 75.0,
    totalPrice: 75.0, // ✅ ADDED
    currency: "EUR", // ✅ ADDED

    // Status
    status: "confirmed",
    paymentStatus: "paid",

    // Timestamps
    createdAt: "2025-08-15T10:00:00Z",
    updatedAt: "2025-08-15T10:00:00Z",
  },
  {
    // Core booking info
    id: "bk2",
    userId: "user1", // ✅ ADDED
    tourId: "tour2",
    tourTitle: "Lisbon Food Experience",
    tourDescription: "Authentic Portuguese flavors and hidden food spots", // ✅ ADDED
    tourImage: "/images/tours/lisbon-food.jpg", // ✅ ADDED
    location: "Lisboa, Portugal", // ✅ ADDED

    // Customer info
    customerId: "customer1",
    customerName: "Maria Silva", // ✅ ADDED
    customerEmail: "maria.silva@email.com", // ✅ ADDED

    // Host info
    hostId: "host2",
    hostName: "Ana Costa", // ✅ ADDED
    hostEmail: "ana.costa@email.com", // ✅ ADDED
    hostPhone: "+351 913 456 789", // ✅ ADDED
    hostAvatar: "/images/hosts/ana.jpg", // ✅ ADDED
    hostVerified: true, // ✅ ADDED
    hostResponseTime: "Responde em 1 hora", // ✅ ADDED

    // Booking details
    date: "2025-09-25",
    time: "18:30",
    participants: 4,
    specialRequests: "Uma pessoa é vegetariana", // ✅ ADDED
    meetingPoint: "Rossio Square, junto à fonte central", // ✅ ADDED
    cancellationPolicy: "Cancelamento gratuito até 48h antes", // ✅ ADDED

    // Pricing
    basePrice: 45.0,
    serviceFees: 20.0,
    totalAmount: 200.0,
    totalPrice: 200.0, // ✅ ADDED
    currency: "EUR", // ✅ ADDED

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
            {t.customerDashboard?.welcome || "Bem-vindo de volta!"} 👋
          </h1>
          <p className="text-gray-600">
            {t.customerDashboard?.subtitle ||
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total de Reservas
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
                Próximas Viagens
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
                Viagens Concluídas
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
              <h3 className="text-sm font-medium text-gray-500">Total Gasto</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalSpent, locale)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Acções Rápidas
            </h2>
            <div className="space-y-3">
              <Link
                href={`/${locale}/customer/tours`}
                className="flex items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div className="p-2 rounded-lg bg-blue-600">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Explorar Tours
                  </p>
                  <p className="text-xs text-gray-500">
                    Descobre novas experiências
                  </p>
                </div>
              </Link>

              <Link
                href={`/${locale}/customer/bookings`}
                className="flex items-center p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
              >
                <div className="p-2 rounded-lg bg-green-600">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Ver Reservas
                  </p>
                  <p className="text-xs text-gray-500">Gere as tuas reservas</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tours Recomendados
            </h2>
            <div className="space-y-3">
              {recentTours.slice(0, 2).map((tour) => (
                <Link
                  key={tour.id}
                  href={`/${locale}/customer/tours/${tour.id}`}
                  className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {tour.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="flex items-center">
                          ⭐ {tour.rating}
                        </span>
                        <span className="mx-1">•</span>
                        <span>{formatCurrency(tour.price, locale)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
