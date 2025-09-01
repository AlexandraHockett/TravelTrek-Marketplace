// File: app/[locale]/customer/bookings/page.tsx
// Location: REPLACE your existing app/[locale]/customer/bookings/page.tsx with this corrected version

"use client";

import { useState, useEffect, use } from "react"; // ✅ Added 'use' import
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  CreditCard,
  MapPin,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Star,
} from "lucide-react";
import { Booking } from "@/types";
import { useTranslations } from "@/lib/i18n";
import { formatCurrency, formatDate } from "@/lib/utils";

interface CustomerBookingsPageProps {
  params: Promise<{ locale: string }>; // ✅ Now Promise<>
}

type BookingFilter = "all" | "upcoming" | "past" | "cancelled";

export default function CustomerBookingsPage({
  params,
}: CustomerBookingsPageProps) {
  // ✅ Use React.use() to unwrap the params Promise
  const { locale } = use(params);
  const t = useTranslations(locale);
  const searchParams = useSearchParams();

  // State management
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<BookingFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  // Check for payment status from URL params (after Stripe redirect)
  useEffect(() => {
    const payment = searchParams.get("payment");
    const booking = searchParams.get("booking");

    if (payment === "success") {
      setPaymentStatus(
        `Pagamento realizado com sucesso! ${booking ? `Reserva ${booking} está agora confirmada.` : ""}`
      );
    } else if (payment === "cancelled") {
      setPaymentStatus(
        "Pagamento cancelado. Podes tentar novamente a partir das tuas reservas."
      );
    }

    // Clear payment status after 5 seconds
    if (payment) {
      const timeout = setTimeout(() => setPaymentStatus(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [searchParams]);

  // Mock data for development
  const mockBookings: Booking[] = [
    {
      id: "bk1",
      tourId: "tour1",
      tourTitle: "Porto Walking Tour",
      customerId: "customer1",
      hostId: "host1",
      date: "2025-09-15",
      time: "14:00",
      participants: 2,
      totalAmount: 75.0,
      basePrice: 75.0,
      serviceFees: 0.0,
      status: "confirmed",
      paymentStatus: "paid",
      tourImage: "/images/tours/porto-walking.jpg",
      location: "Porto, Portugal",
      meetingPoint: "Praça da Liberdade",
      cancellationPolicy: "Cancelamento gratuito até 24h antes",
      createdAt: "2025-08-15T10:00:00Z",
      updatedAt: "2025-08-15T10:00:00Z",
    },
    {
      id: "bk2",
      tourId: "tour2",
      tourTitle: "Lisbon Food Experience",
      customerId: "customer1",
      hostId: "host2",
      date: "2025-09-25",
      time: "18:30",
      participants: 4,
      totalAmount: 200.0,
      basePrice: 180.0,
      serviceFees: 20.0,
      status: "pending",
      paymentStatus: "pending",
      tourImage: "/images/tours/lisbon-food.jpg",
      location: "Lisboa, Portugal",
      meetingPoint: "Rossio Square",
      cancellationPolicy: "Cancelamento gratuito até 48h antes",
      createdAt: "2025-08-20T15:30:00Z",
      updatedAt: "2025-08-20T15:30:00Z",
    },
    {
      id: "bk3",
      tourId: "tour3",
      tourTitle: "Sintra Day Trip",
      customerId: "customer1",
      hostId: "host3",
      date: "2025-07-30",
      time: "09:00",
      participants: 3,
      totalAmount: 150.0,
      basePrice: 150.0,
      serviceFees: 0.0,
      status: "completed",
      paymentStatus: "paid",
      tourImage: "/images/tours/sintra-trip.jpg",
      location: "Sintra, Portugal",
      meetingPoint: "Estação de Sintra",
      cancellationPolicy: "Cancelamento gratuito até 24h antes",
      createdAt: "2025-07-15T09:00:00Z",
      updatedAt: "2025-07-30T16:00:00Z",
    },
  ];

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // In real app, we'd get the customer ID from authentication
      const response = await fetch("/api/bookings?customerId=current");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(error instanceof Error ? error.message : t("errors.generic"));

      // Use mock data as fallback
      setBookings(mockBookings);
    } finally {
      setLoading(false);
    }
  };

  // Load bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter and search bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "upcoming" && new Date(booking.date) > new Date()) ||
      (filter === "past" &&
        new Date(booking.date) < new Date() &&
        booking.status !== "cancelled") ||
      (filter === "cancelled" && booking.status === "cancelled");

    const matchesSearch =
      searchTerm === "" ||
      booking.tourTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.location?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendente";
      case "cancelled":
        return "Cancelada";
      case "completed":
        return "Concluída";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Filters skeleton */}
            <div className="mb-6 flex gap-4">
              <div className="h-10 bg-gray-200 rounded w-64"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>

            {/* Bookings skeleton */}
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            As Tuas Reservas
          </h1>
          <p className="text-lg text-gray-600">
            Gere as tuas reservas e experiências de viagem
          </p>
        </div>

        {/* Payment Status Alert */}
        {paymentStatus && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              paymentStatus.includes("sucesso")
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-yellow-50 border border-yellow-200 text-yellow-800"
            }`}
          >
            {paymentStatus.includes("sucesso") ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <p className="text-sm font-medium">{paymentStatus}</p>
            <button
              onClick={() => setPaymentStatus(null)}
              className="ml-auto text-sm hover:underline"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar reservas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {(["all", "upcoming", "past", "cancelled"] as BookingFilter[]).map(
              (filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {filterOption === "all" && "Todas"}
                  {filterOption === "upcoming" && "Próximas"}
                  {filterOption === "past" && "Passadas"}
                  {filterOption === "cancelled" && "Canceladas"}
                </button>
              )
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-800 font-medium">
                Erro ao carregar reservas
              </p>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filter !== "all"
                ? "Nenhuma reserva encontrada"
                : "Ainda não tens reservas"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filter !== "all"
                ? "Tenta ajustar os filtros de pesquisa"
                : "Descobre experiências incríveis e faz a tua primeira reserva"}
            </p>
            {!searchTerm && filter === "all" && (
              <a
                href={`/${locale}/customer/tours`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search className="h-4 w-4 mr-2" />
                Explorar Tours
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Tour Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={
                          booking.tourImage || "/images/placeholder-tour.jpg"
                        }
                        alt={booking.tourTitle}
                        className="w-full lg:w-48 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {booking.tourTitle}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 gap-4">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {booking.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(booking.date, locale)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {booking.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {booking.participants} pessoas
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getStatusIcon(booking.status)}
                          <span className="text-sm font-medium">
                            {getStatusText(booking.status)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            <strong>Ponto de Encontro:</strong>{" "}
                            {booking.meetingPoint}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.cancellationPolicy}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(booking.totalAmount, locale)}
                          </p>
                          {booking.paymentStatus === "pending" && (
                            <p className="text-sm text-yellow-600 font-medium">
                              Pagamento Pendente
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-3">
                        <a
                          href={`/${locale}/customer/bookings/${booking.id}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Ver Detalhes
                        </a>

                        {booking.paymentStatus === "pending" && (
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                            Pagar Agora
                          </button>
                        )}

                        {booking.status === "confirmed" &&
                          new Date(booking.date) > new Date() && (
                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                              Cancelar
                            </button>
                          )}

                        {booking.status === "completed" && (
                          <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            Avaliar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
