// File: app/customer/page.tsx
// Location: Create this file in the app/customer/ directory

import React from "react";
import Link from "next/link";
import { Booking, Tour } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

// Mock data - replace with actual API calls later
const mockBookings: Booking[] = [
  {
    id: "1",
    tourId: "t1",
    tourTitle: "Porto Food Tour",
    tourImage: "/images/tours/porto-food.webp",
    customerId: "c1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    hostId: "h1",
    date: "2025-09-15",
    participants: 2,
    totalAmount: 89.98,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2025-08-20T10:00:00Z",
    updatedAt: "2025-08-20T10:00:00Z",
  },
];

const mockRecentTours: Tour[] = [
  {
    id: "t2",
    title: "Sintra Royal Palaces",
    description: "Discover the magical palaces of Sintra",
    shortDescription: "Royal palaces tour",
    image: "/images/tours/sintra-palace.webp",
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
    cancellationPolicy: "Free cancellation up to 24 hours",
    hostId: "h2",
    tags: ["Culture", "History", "Architecture"],
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
  },
];

interface DashboardStatsProps {
  totalBookings: number;
  upcomingTrips: number;
  completedTrips: number;
  totalSpent: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalBookings,
  upcomingTrips,
  completedTrips,
  totalSpent,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <Card className="text-center p-6">
      <div className="text-3xl font-bold text-blue-600 mb-2">
        {totalBookings}
      </div>
      <div className="text-sm text-gray-600">Total de Reservas</div>
    </Card>

    <Card className="text-center p-6">
      <div className="text-3xl font-bold text-green-600 mb-2">
        {upcomingTrips}
      </div>
      <div className="text-sm text-gray-600">Próximas Viagens</div>
    </Card>

    <Card className="text-center p-6">
      <div className="text-3xl font-bold text-purple-600 mb-2">
        {completedTrips}
      </div>
      <div className="text-sm text-gray-600">Viagens Concluídas</div>
    </Card>

    <Card className="text-center p-6">
      <div className="text-3xl font-bold text-orange-600 mb-2">
        {formatCurrency(totalSpent)}
      </div>
      <div className="text-sm text-gray-600">Total Gasto</div>
    </Card>
  </div>
);

interface RecentBookingsProps {
  bookings: Booking[];
}

const RecentBookings: React.FC<RecentBookingsProps> = ({ bookings }) => (
  <Card className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Reservas Recentes</h2>
      <Link href="/customer/bookings">
        <Button variant="default" size="sm">
          Ver Todas
        </Button>
      </Link>
    </div>

    {bookings.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <p>Ainda não tens reservas.</p>
        <Link href="/customer/tours" className="inline-block mt-4">
          <Button>Explorar Tours</Button>
        </Link>
      </div>
    ) : (
      <div className="space-y-4">
        {bookings.slice(0, 3).map((booking) => (
          <div
            key={booking.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <img
                src={booking.tourImage}
                alt={booking.tourTitle}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholders/tour-placeholder.webp";
                }}
              />
              <div>
                <h3 className="font-medium text-gray-900">
                  {booking.tourTitle}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(booking.date).toLocaleDateString("pt-PT")} •{" "}
                  {booking.participants} pessoa
                  {booking.participants > 1 ? "s" : ""}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(booking.totalAmount)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge
                variant={booking.status === "confirmed" ? "success" : "default"}
              >
                {booking.status === "confirmed" ? "Confirmada" : booking.status}
              </Badge>
              <Link href={`/customer/bookings/${booking.id}`}>
                <Button variant="default" size="sm">
                  Ver Detalhes
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

interface RecommendedToursProps {
  tours: Tour[];
}

const RecommendedTours: React.FC<RecommendedToursProps> = ({ tours }) => (
  <Card className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Tours Recomendados
      </h2>
      <Link href="/customer/tours">
        <Button variant="default" size="sm">
          Ver Todos
        </Button>
      </Link>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tours.slice(0, 2).map((tour) => (
        <div
          key={tour.id}
          className="group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
        >
          <Link href={`/customer/tours/${tour.id}`}>
            <div className="relative">
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholders/tour-placeholder.webp";
                }}
              />
              {tour.originalPrice && tour.originalPrice > tour.price && (
                <div className="absolute top-3 right-3">
                  <Badge variant="error" className="bg-red-500">
                    -
                    {Math.round(
                      ((tour.originalPrice - tour.price) / tour.originalPrice) *
                        100
                    )}
                    %
                  </Badge>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {tour.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {tour.shortDescription || tour.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-yellow-500">
                    <span className="text-sm">★</span>
                    <span className="text-sm ml-1">{tour.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({tour.reviewCount} avaliações)
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
  </Card>
);

export default function CustomerDashboardPage() {
  // Calculate stats from mock data
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
            Bem-vindo de volta! 👋
          </h1>
          <p className="text-gray-600">
            Aqui podes gerir as tuas reservas e descobrir novas experiências.
          </p>
        </div>

        {/* Stats */}
        <DashboardStats {...stats} />

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/customer/tours">
            <Button size="lg" className="flex items-center gap-2">
              <span>🔍</span>
              Explorar Tours
            </Button>
          </Link>
          <Link href="/customer/bookings">
            <Button
              variant="default"
              size="lg"
              className="flex items-center gap-2"
            >
              <span>📅</span>
              As Minhas Reservas
            </Button>
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <RecentBookings bookings={mockBookings} />
          </div>
          <div>
            <RecommendedTours tours={mockRecentTours} />
          </div>
        </div>
      </div>
    </div>
  );
}
