// File: app/customer/bookings/page.tsx
// Location: Create this file in the app/customer/bookings/ directory
"use client";
import React from "react";
import Link from "next/link";
import { Booking } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

// Mock data - replace with actual API calls later
const mockBookings: Booking[] = [
  {
    id: "b1",
    tourId: "t1",
    tourTitle: "Porto Food & Wine Tour",
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
    specialRequests: "Vegetarian options for one participant please",
    createdAt: "2025-08-20T10:00:00Z",
    updatedAt: "2025-08-20T10:00:00Z",
  },
  {
    id: "b2",
    tourId: "t2",
    tourTitle: "Sintra Royal Palaces",
    tourImage: "/images/tours/sintra-palace.webp",
    customerId: "c1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    hostId: "h2",
    date: "2025-09-22",
    participants: 3,
    totalAmount: 195.0,
    status: "pending",
    paymentStatus: "pending",
    createdAt: "2025-08-22T14:30:00Z",
    updatedAt: "2025-08-22T14:30:00Z",
  },
  {
    id: "b3",
    tourId: "t3",
    tourTitle: "Douro Valley River Cruise",
    tourImage: "/images/tours/douro-cruise.webp",
    customerId: "c1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    hostId: "h3",
    date: "2025-08-10",
    participants: 2,
    totalAmount: 178.0,
    status: "completed",
    paymentStatus: "paid",
    createdAt: "2025-07-25T09:15:00Z",
    updatedAt: "2025-08-11T16:00:00Z",
  },
  {
    id: "b4",
    tourId: "t4",
    tourTitle: "Lisbon Tuk-Tuk City Tour",
    tourImage: "/images/tours/lisbon-tuktuk.webp",
    customerId: "c1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    hostId: "h4",
    date: "2025-08-05",
    participants: 1,
    totalAmount: 35.0,
    status: "cancelled",
    paymentStatus: "refunded",
    createdAt: "2025-07-20T11:45:00Z",
    updatedAt: "2025-08-04T08:00:00Z",
  },
];

interface BookingFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const BookingFilters: React.FC<BookingFiltersProps> = ({
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
}) => {
  const statusOptions = [
    { value: "all", label: "Todas" },
    { value: "pending", label: "Pendentes" },
    { value: "confirmed", label: "Confirmadas" },
    { value: "completed", label: "Concluídas" },
    { value: "cancelled", label: "Canceladas" },
  ];

  const sortOptions = [
    { value: "date-desc", label: "Data mais recente" },
    { value: "date-asc", label: "Data mais antiga" },
    { value: "created-desc", label: "Reserva mais recente" },
    { value: "amount-desc", label: "Valor mais alto" },
    { value: "amount-asc", label: "Valor mais baixo" },
  ];

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado da Reserva
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent default-none"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordenar por
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent default-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
};

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const getStatusBadge = (status: string, paymentStatus: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Pendente</Badge>;
      case "confirmed":
        return <Badge variant="success">Confirmada</Badge>;
      case "completed":
        return <Badge variant="default">Concluída</Badge>;
      case "cancelled":
        return <Badge variant="error">Cancelada</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "pending":
        return (
          <Badge variant="warning" className="bg-orange-100 text-orange-800">
            Pagamento Pendente
          </Badge>
        );
      case "paid":
        return (
          <Badge variant="success" className="bg-green-100 text-green-800">
            Pago
          </Badge>
        );
      case "refunded":
        return (
          <Badge variant="default" className="bg-gray-100 text-gray-800">
            Reembolsado
          </Badge>
        );
      default:
        return <Badge variant="default">{paymentStatus}</Badge>;
    }
  };

  const getStatusActions = (booking: Booking) => {
    const actions: React.ReactElement[] = [];

    // View Details (always available)
    actions.push(
      <Link key="view" href={`/customer/bookings/${booking.id}`}>
        <Button variant="default" size="sm">
          Ver Detalhes
        </Button>
      </Link>
    );

    // Payment action for pending payments
    if (booking.paymentStatus === "pending" && booking.status !== "cancelled") {
      actions.push(
        <Button key="pay" size="sm" className="bg-green-600 hover:bg-green-700">
          Pagar Agora
        </Button>
      );
    }

    // Cancel action for confirmed bookings
    if (booking.status === "confirmed" && new Date(booking.date) > new Date()) {
      actions.push(
        <Button
          key="cancel"
          variant="danger"
          size="sm"
          className="bg-red-600 hover:bg-red-700"
        >
          Cancelar
        </Button>
      );
    }

    // Rebook action for cancelled or completed bookings
    if (booking.status === "cancelled" || booking.status === "completed") {
      actions.push(
        <Link key="rebook" href={`/customer/tours/${booking.tourId}`}>
          <Button variant="default" size="sm">
            Reservar Novamente
          </Button>
        </Link>
      );
    }

    // Review action for completed bookings
    if (booking.status === "completed") {
      actions.push(
        <Button key="review" variant="default" size="sm">
          Deixar Avaliação
        </Button>
      );
    }

    return actions;
  };

  const isUpcoming = new Date(booking.date) > new Date();
  const isPast = new Date(booking.date) <= new Date();

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tour Image & Basic Info */}
        <div className="lg:w-48 flex-shrink-0">
          <img
            src={booking.tourImage}
            alt={booking.tourTitle}
            className="w-full h-32 lg:h-32 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/placeholders/tour-placeholder.webp";
            }}
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {booking.tourTitle}
              </h3>
              <div className="flex flex-wrap gap-2">
                {getStatusBadge(booking.status, booking.paymentStatus)}
                {getPaymentStatusBadge(booking.paymentStatus)}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <span className="mr-1">📅</span>
                <span
                  className={
                    isUpcoming
                      ? "font-medium text-blue-600"
                      : isPast
                        ? "text-gray-500"
                        : ""
                  }
                >
                  {new Date(booking.date).toLocaleDateString("pt-PT", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {isUpcoming && (
                  <Badge
                    variant="default"
                    size="sm"
                    className="ml-2 text-blue-600 border-blue-200"
                  >
                    Próximo
                  </Badge>
                )}
              </div>

              <div className="flex items-center">
                <span className="mr-1">👥</span>
                {booking.participants} pessoa
                {booking.participants > 1 ? "s" : ""}
              </div>

              <div className="flex items-center font-medium text-gray-900">
                <span className="mr-1">💰</span>
                {formatCurrency(booking.totalAmount)}
              </div>
            </div>

            {booking.specialRequests && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Pedidos especiais:</strong> {booking.specialRequests}
                </p>
              </div>
            )}
          </div>

          {/* Booking Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Reserva #{booking.id} • Criada em{" "}
              {new Date(booking.createdAt).toLocaleDateString("pt-PT")}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {getStatusActions(booking)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface BookingStatsProps {
  bookings: Booking[];
}

const BookingStats: React.FC<BookingStatsProps> = ({ bookings }) => {
  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(
      (b) => new Date(b.date) > new Date() && b.status !== "cancelled"
    ).length,
    completed: bookings.filter((b) => b.status === "completed").length,
    totalSpent: bookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + b.totalAmount, 0),
    pending: bookings.filter((b) => b.status === "pending").length,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-blue-600 mb-1">
          {stats.total}
        </div>
        <div className="text-sm text-gray-600">Total de Reservas</div>
      </Card>

      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-green-600 mb-1">
          {stats.upcoming}
        </div>
        <div className="text-sm text-gray-600">Próximas</div>
      </Card>

      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-purple-600 mb-1">
          {stats.completed}
        </div>
        <div className="text-sm text-gray-600">Concluídas</div>
      </Card>

      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-orange-600 mb-1">
          {stats.pending}
        </div>
        <div className="text-sm text-gray-600">Pendentes</div>
      </Card>

      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {formatCurrency(stats.totalSpent)}
        </div>
        <div className="text-sm text-gray-600">Gasto Total</div>
      </Card>
    </div>
  );
};

export default function CustomerBookingsPage() {
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("date-desc");

  // Filter bookings
  const filteredBookings = mockBookings.filter((booking) => {
    if (statusFilter === "all") return true;
    return booking.status === statusFilter;
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "created-desc":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "amount-desc":
        return b.totalAmount - a.totalAmount;
      case "amount-asc":
        return a.totalAmount - b.totalAmount;
      default:
        return 0;
    }
  });

  const upcomingBookings = sortedBookings.filter(
    (b) => new Date(b.date) > new Date() && b.status !== "cancelled"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              As Minhas Reservas 📅
            </h1>
            <p className="text-gray-600">
              Gere as suas reservas de tours e experiências
            </p>
          </div>

          <Link href="/customer/tours">
            <Button size="lg" className="flex items-center gap-2">
              <span>🔍</span>
              Explorar Mais Tours
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <BookingStats bookings={mockBookings} />

        {/* Upcoming Bookings Quick View */}
        {upcomingBookings.length > 0 && (
          <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <span className="mr-2">⏰</span>
              Próximas Experiências ({upcomingBookings.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingBookings.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-4 rounded-lg border border-blue-200"
                >
                  <h4 className="font-medium text-gray-900 mb-1">
                    {booking.tourTitle}
                  </h4>
                  <p className="text-sm text-blue-600 mb-2">
                    {new Date(booking.date).toLocaleDateString("pt-PT")}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {booking.participants} pessoa
                      {booking.participants > 1 ? "s" : ""}
                    </span>
                    <Link href={`/customer/bookings/${booking.id}`}>
                      <Button variant="default" size="sm">
                        Ver
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Filters */}
        <BookingFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Bookings List */}
        {sortedBookings.length === 0 ? (
          <Card className="p-12 text-center">
            {statusFilter === "all" ? (
              <>
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ainda não tens reservas
                </h3>
                <p className="text-gray-600 mb-6">
                  Descobre experiências únicas em Portugal e faz a tua primeira
                  reserva!
                </p>
                <Link href="/customer/tours">
                  <Button size="lg">Explorar Tours</Button>
                </Link>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhuma reserva encontrada
                </h3>
                <p className="text-gray-600 mb-4">
                  Não existem reservas com o estado "{statusFilter}".
                </p>
                <Button
                  onClick={() => setStatusFilter("all")}
                  variant="default"
                >
                  Ver Todas as Reservas
                </Button>
              </>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {sortedBookings.length} reserva
                {sortedBookings.length !== 1 ? "s" : ""}
                {statusFilter !== "all" && ` (${statusFilter})`}
              </h2>
            </div>

            {sortedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
