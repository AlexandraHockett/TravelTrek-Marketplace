// File: app/[locale]/customer/page.tsx
// Location: SUBSTITUIR o ficheiro existente

import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "@/lib/utils";
import type { Tour, Booking } from "@/types";
import { TourImage } from "@/components/shared";

// Tipagem para os params
interface PageProps {
  params: Promise<{ locale: string }>;
}

// Função para resolver params
async function resolveParams(params: PageProps["params"]) {
  return await Promise.resolve(params);
}

// Mock data para recent tours - CORRIGIDO com propriedade language
const createMockRecentTours = (locale: string): Tour[] => [
  {
    id: "t2",
    language: locale, // ✅ ADICIONADO: Propriedade language obrigatória
    title: "Sintra Royal Palaces",
    description: "Discover the magical palaces of Sintra",
    shortDescription: "Royal palaces tour",
    image: "/images/tours/sintra-palace.webp",
    images: ["/images/tours/sintra-palace.webp"],
    price: 65,
    originalPrice: 80,
    currency: "EUR",
    duration: 8,
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
    ],
  },
  {
    id: "t3",
    language: locale, // ✅ ADICIONADO: Propriedade language obrigatória
    title: "Douro Valley River Cruise",
    description: "Sail through breathtaking Douro Valley landscapes",
    shortDescription: "Scenic river cruise with wine tastings",
    image: "/images/tours/douro-cruise.webp",
    images: ["/images/tours/douro-cruise.webp"],
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
    included: ["River cruise", "Wine tastings", "Lunch", "Transportation"],
    excluded: ["Additional purchases", "Gratuities"],
    cancellationPolicy: "Free cancellation up to 72 hours before the tour",
    hostId: "h3",
    tags: ["Wine", "Nature", "Cruise", "UNESCO"],
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
    ],
  },
  {
    id: "t4",
    language: locale, // ✅ ADICIONADO: Propriedade language obrigatória
    title: "Lisbon Tuk-Tuk City Tour",
    description: "Explore Lisbon's seven hills in an eco-friendly tuk-tuk",
    shortDescription: "Historic city tour by tuk-tuk",
    image: "/images/tours/lisbon-tuktuk.webp",
    images: ["/images/tours/lisbon-tuktuk.webp"],
    price: 35,
    currency: "EUR",
    duration: 3,
    location: "Lisbon, Portugal",
    rating: 4.7,
    reviewCount: 89,
    maxParticipants: 6,
    minimumAge: 5,
    difficulty: "Easy" as const,
    included: ["Tuk-tuk", "Guide", "Photo stops", "Pastéis de nata tasting"],
    excluded: ["Hotel pickup", "Monument tickets", "Additional food"],
    cancellationPolicy: "Free cancellation up to 2 hours before the tour",
    hostId: "h4",
    tags: ["City Tour", "History", "Culture", "Eco-friendly"],
    createdAt: "2025-07-10T00:00:00Z",
    updatedAt: "2025-08-05T00:00:00Z",
    // ✅ ADICIONADO: Propriedades em falta na interface Tour
    itinerary: [
      {
        time: "14:00",
        title: "Meeting Point",
        description: "Meet at Rossio Square",
      },
      {
        time: "14:15",
        title: "Alfama District",
        description: "Explore the oldest neighborhood",
      },
    ],
  },
];

// Mock data para bookings - CORRIGIDO com todas as propriedades necessárias
const mockBookings: Booking[] = [
  {
    id: "1",
    tourId: "t1",
    tourTitle: "Porto Food Tour",
    tourImage: "/images/tours/porto-food.webp",
    tourDescription: "Authentic Portuguese cuisine tour",
    customerId: "c1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    hostId: "h1",
    hostName: "Maria Santos", // ✅ ADICIONADO
    hostAvatar: "/images/avatars/host-maria.webp", // ✅ ADICIONADO
    hostEmail: "maria@host.com", // ✅ ADICIONADO
    hostPhone: "+351 912 345 678", // ✅ ADICIONADO
    hostVerified: true, // ✅ ADICIONADO
    hostResponseTime: "< 1 hora", // ✅ ADICIONADO
    date: "2025-09-15",
    time: "10:00", // ✅ ADICIONADO
    participants: 2,
    basePrice: 44.99, // ✅ ADICIONADO
    totalAmount: 89.98,
    serviceFees: 0, // ✅ ADICIONADO
    status: "confirmed" as const,
    paymentStatus: "paid" as const,
    specialRequests: "Vegetarian options please", // ✅ ADICIONADO
    meetingPoint: "Mercado do Bolhão, Porto", // ✅ ADICIONADO
    cancellationPolicy: "Free cancellation up to 24 hours", // ✅ ADICIONADO
    createdAt: "2025-08-20T10:00:00Z",
    updatedAt: "2025-08-20T10:00:00Z",
  },
];

// Função para formatar moeda
function formatCurrency(amount: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

// Componente para estatísticas do dashboard
interface DashboardStatsProps {
  totalBookings: number;
  upcomingTrips: number;
  completedTrips: number;
  totalSpent: number;
  t: any;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalBookings,
  upcomingTrips,
  completedTrips,
  totalSpent,
  t,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="bg-white rounded-lg p-6 text-center shadow-sm">
      <div className="text-3xl font-bold text-blue-600 mb-2">
        {totalBookings}
      </div>
      <div className="text-sm text-gray-600">
        {t.customerBookings?.stats?.totalBookings || "Total de Reservas"}
      </div>
    </div>

    <div className="bg-white rounded-lg p-6 text-center shadow-sm">
      <div className="text-3xl font-bold text-green-600 mb-2">
        {upcomingTrips}
      </div>
      <div className="text-sm text-gray-600">
        {t.customerBookings?.stats?.upcoming || "Próximas Viagens"}
      </div>
    </div>

    <div className="bg-white rounded-lg p-6 text-center shadow-sm">
      <div className="text-3xl font-bold text-purple-600 mb-2">
        {completedTrips}
      </div>
      <div className="text-sm text-gray-600">
        {t.customerBookings?.completed || "Experiências Concluídas"}
      </div>
    </div>

    <div className="bg-white rounded-lg p-6 text-center shadow-sm">
      <div className="text-3xl font-bold text-orange-600 mb-2">
        {formatCurrency(totalSpent)}
      </div>
      <div className="text-sm text-gray-600">
        {t.customerBookings?.stats?.totalSpent || "Total Gasto"}
      </div>
    </div>
  </div>
);

// Componente para tours recomendados
interface RecommendedToursProps {
  tours: Tour[];
  locale: string;
  t: any;
}

const RecommendedTours: React.FC<RecommendedToursProps> = ({
  tours,
  locale,
  t,
}) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">
        {t.customerDashboard?.recommendedTours || "Tours Recomendados"}
      </h2>
      <Link
        href={`/${locale}/customer/tours`}
        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        {t.common?.viewAll || "Ver todos"} →
      </Link>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <div key={tour.id} className="group">
          <Link href={`/${locale}/customer/tours/${tour.id}`}>
            <div className="relative mb-4">
              <TourImage
                src={tour.image}
                alt={tour.title}
                className="w-full h-48 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
              />
              {tour.originalPrice && tour.originalPrice > tour.price && (
                <div className="absolute top-3 right-3">
                  <span className="bg-red-500 text-white px-2 py-1 text-xs rounded-full">
                    -
                    {Math.round(
                      ((tour.originalPrice - tour.price) / tour.originalPrice) *
                        100
                    )}
                    %
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {tour.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {tour.shortDescription || tour.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-yellow-500">
                    <span className="text-sm">★</span>
                    <span className="text-sm ml-1">{tour.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({tour.reviewCount} {t.common?.reviews || "avaliações"})
                  </span>
                </div>

                <div className="text-right">
                  {tour.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      {formatCurrency(tour.originalPrice)}
                    </p>
                  )}
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(tour.price)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  </div>
);

// Metadata dinâmica baseada no locale
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await resolveParams(params);
  const { locale } = resolvedParams;
  const t = await getTranslations(locale);

  return {
    title: t.pages?.customerDashboard?.title || "Customer Dashboard",
    description:
      t.pages?.customerDashboard?.description ||
      "Manage your bookings and discover experiences",
  };
}

// Server Component principal
export default async function CustomerDashboardPage({ params }: PageProps) {
  const resolvedParams = await resolveParams(params);
  const { locale } = resolvedParams;

  // Carrega as traduções no servidor
  const t = await getTranslations(locale);

  // Mock data com propriedade language corrigida
  const recentTours = createMockRecentTours(locale);

  // Calcular estatísticas do mock data
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

        {/* Dashboard Stats */}
        <DashboardStats {...stats} t={t} />

        {/* Recent Bookings */}
        <div className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {t.customerDashboard?.recentBookings || "Reservas Recentes"}
              </h2>
              <Link
                href={`/${locale}/customer/bookings`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {t.common?.viewAll || "Ver todas"} →
              </Link>
            </div>

            {mockBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  {t.customerDashboard?.noBookings ||
                    "Ainda não tens reservas."}
                </p>
                <Link
                  href={`/${locale}/customer/tours`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t.customerDashboard?.exploreButton || "Explorar Tours"} →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {mockBookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <TourImage
                      src={booking.tourImage}
                      alt={booking.tourTitle}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {booking.tourTitle}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.date).toLocaleDateString("pt-PT")} •{" "}
                        {booking.participants}{" "}
                        {booking.participants === 1
                          ? t.common?.person
                          : t.common?.persons}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {t.status?.[booking.status] || booking.status}
                      </span>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatCurrency(booking.totalAmount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recommended Tours */}
        <RecommendedTours tours={recentTours} locale={locale} t={t} />
      </div>
    </div>
  );
}
