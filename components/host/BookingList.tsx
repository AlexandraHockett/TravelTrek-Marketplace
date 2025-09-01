// File: components/host/BookingList.tsx
// Location: REPLACE in components/host/BookingList.tsx

"use client";

import { useState, useEffect, JSX } from "react";
import {
  Calendar,
  Users,
  Mail,
  Phone,
  Clock,
  MapPin,
  Euro,
  Filter,
  Search,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { Booking } from "@/types";
import { useTranslations } from "@/lib/i18n";
import { formatCurrency, formatDate } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface BookingListProps {
  hostId: string;
  locale: string;
  className?: string;
  bookings?: Booking[]; // ✅ OPCIONAL agora - faz fetch se não fornecido
  onUpdateBooking?: (bookingId: string, status: Booking["status"]) => void;
}

type BookingStatus =
  | "all"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export default function BookingList({
  hostId,
  locale,
  className = "",
  bookings: propBookings,
  onUpdateBooking,
}: BookingListProps) {
  const t = useTranslations(locale);

  // State management
  const [bookings, setBookings] = useState<Booking[]>(propBookings || []);
  const [loading, setLoading] = useState(!propBookings);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Fetch bookings from API se não foram fornecidos como prop
  const fetchBookings = async () => {
    if (propBookings) {
      setBookings(propBookings);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("hostId", hostId);
      if (selectedStatus !== "all") params.append("status", selectedStatus);

      const response = await fetch(`/api/bookings?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(error instanceof Error ? error.message : t("errors.generic"));

      // Mock data para desenvolvimento
      setBookings([
        {
          id: "bk-1",
          tourId: "tour-1",
          tourTitle: t("tourDetails.title") || "Porto Walking Tour",
          tourDescription: "Beautiful walking tour through Porto",
          tourImage: "/images/tours/porto-tour.jpg",
          customerId: "cust-1",
          customerName: "João Silva",
          customerEmail: "joao@example.com",
          hostId,
          hostName: "Maria Santos",
          hostEmail: "maria@example.com",
          hostPhone: "+351 123 456 789",
          hostVerified: true,
          hostResponseTime: "Within 1 hour",
          date: "2024-12-15",
          time: "10:00",
          participants: 2,
          basePrice: 25,
          totalAmount: 50,
          serviceFees: 5,
          status: "confirmed" as const,
          paymentStatus: "paid" as const,
          meetingPoint: "Praça da Liberdade",
          cancellationPolicy: "Free cancellation until 24h before",
          createdAt: "2024-12-10T10:00:00Z",
          updatedAt: "2024-12-10T10:00:00Z",
          userId: "cust-1",
          totalPrice: 50,
          currency: "EUR",
        },
        {
          id: "bk-2",
          tourId: "tour-2",
          tourTitle: t("tourDetails.title") || "Lisbon Food Tour",
          tourDescription: "Culinary adventure through Lisbon",
          tourImage: "/images/tours/lisbon-food.jpg",
          customerId: "cust-2",
          customerName: "Ana Costa",
          customerEmail: "ana@example.com",
          hostId,
          hostName: "Maria Santos",
          hostEmail: "maria@example.com",
          hostPhone: "+351 123 456 789",
          hostVerified: true,
          hostResponseTime: "Within 2 hours",
          date: "2024-12-20",
          time: "14:00",
          participants: 4,
          basePrice: 35,
          totalAmount: 140,
          serviceFees: 14,
          status: "pending" as const,
          paymentStatus: "pending" as const,
          specialRequests: "Vegetarian options please",
          meetingPoint: "Rossio Square",
          cancellationPolicy: "Free cancellation until 24h before",
          createdAt: "2024-12-12T14:00:00Z",
          updatedAt: "2024-12-12T14:00:00Z",
          userId: "cust-2",
          totalPrice: 140,
          currency: "EUR",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (
    bookingId: string,
    newStatus: Booking["status"]
  ) => {
    setUpdatingStatus(bookingId);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      const updatedBooking = await response.json();

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      // Call parent callback
      onUpdateBooking?.(bookingId, newStatus);
    } catch (error) {
      console.error("Error updating booking status:", error);
      setError("Failed to update booking status");
    } finally {
      setUpdatingStatus(null);
      setShowStatusModal(false);
      setSelectedBooking(null);
    }
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter((booking) => {
      // Status filter
      if (selectedStatus !== "all" && booking.status !== selectedStatus) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          booking.customerName.toLowerCase().includes(searchLower) ||
          booking.tourTitle.toLowerCase().includes(searchLower) ||
          booking.customerEmail.toLowerCase().includes(searchLower)
        );
      }

      return true;
    })
    .sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case "amount":
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case "status":
          const statusOrder = {
            pending: 0,
            confirmed: 1,
            completed: 2,
            cancelled: 3,
          };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        default:
          return 0;
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

  // Export bookings as CSV
  const exportBookings = () => {
    const headers = [
      t("host.bookings.customerName") || "Customer",
      t("host.bookings.tourName") || "Tour",
      t("common.date") || "Date",
      t("host.bookings.participants") || "Participants",
      t("host.bookings.amount") || "Amount",
      t("host.bookings.status") || "Status",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredBookings.map((booking) =>
        [
          booking.customerName,
          booking.tourTitle,
          formatDate(booking.date, locale),
          booking.participants,
          formatCurrency(booking.totalAmount),
          booking.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Load bookings on mount or when filters change
  useEffect(() => {
    fetchBookings();
  }, [hostId, selectedStatus]);

  // Get status badge style
  const getStatusBadge = (status: Booking["status"]) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };

    const labels = {
      pending: t("bookingList.pending") || "Pendente",
      confirmed: t("bookingList.confirmed") || "Confirmada",
      completed: t("bookingList.completed") || "Concluída",
      cancelled: t("bookingList.cancelled") || "Cancelada",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  // Get status actions
  const getStatusActions = (booking: Booking) => {
    const actions: JSX.Element[] = [];

    if (booking.status === "pending") {
      actions.push(
        <Button
          key="confirm"
          size="sm"
          variant="primary"
          onClick={() => updateBookingStatus(booking.id, "confirmed")}
          disabled={updatingStatus === booking.id}
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          {t("host.bookings.confirm") || "Confirmar"}
        </Button>
      );

      actions.push(
        <Button
          key="cancel"
          size="sm"
          variant="danger"
          onClick={() => updateBookingStatus(booking.id, "cancelled")}
          disabled={updatingStatus === booking.id}
        >
          <XCircle className="w-3 h-3 mr-1" />
          {t("common.cancel") || "Cancelar"}
        </Button>
      );
    }

    if (booking.status === "confirmed") {
      actions.push(
        <Button
          key="complete"
          size="sm"
          variant="primary"
          onClick={() => updateBookingStatus(booking.id, "completed")}
          disabled={updatingStatus === booking.id}
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          {t("host.bookings.complete") || "Concluir"}
        </Button>
      );
    }

    return actions;
  };

  // Loading state
  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-8 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <div className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("errors.generic") || "Erro ao carregar reservas"}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchBookings} variant="primary">
            {t("common.retry") || "Tentar novamente"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {t("host.bookings.manageBookings") || "Gerir Reservas"}
          </h2>

          <div className="flex gap-2">
            <Button
              onClick={exportBookings}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Download className="w-4 h-4 mr-1" />
              {t("common.export") || "Exportar"}
            </Button>
            <Button onClick={fetchBookings} variant="primary" size="sm">
              {t("common.refresh") || "Actualizar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`${t("common.search") || "Pesquisar"} clientes, tours...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as BookingStatus)
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t("common.all") || "Todas"}</option>
              <option value="pending">
                {t("bookingList.pending") || "Pendentes"}
              </option>
              <option value="confirmed">
                {t("bookingList.confirmed") || "Confirmadas"}
              </option>
              <option value="completed">
                {t("bookingList.completed") || "Concluídas"}
              </option>
              <option value="cancelled">
                {t("bookingList.cancelled") || "Canceladas"}
              </option>
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split("-") as [
                  typeof sortBy,
                  typeof sortOrder,
                ];
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date-desc">
                {t("common.sort.dateDesc") || "Data mais recente"}
              </option>
              <option value="date-asc">
                {t("common.sort.dateAsc") || "Data mais antiga"}
              </option>
              <option value="amount-desc">
                {t("common.sort.amountDesc") || "Valor mais alto"}
              </option>
              <option value="amount-asc">
                {t("common.sort.amountAsc") || "Valor mais baixo"}
              </option>
              <option value="status-asc">
                {t("common.sort.status") || "Estado"}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {bookings.length === 0
                ? t("host.bookings.noBookings") || "Ainda não tem reservas"
                : t("host.bookings.noResults") ||
                  "Nenhuma reserva corresponde aos filtros"}
            </h3>
            {bookings.length === 0 && (
              <p className="text-gray-600">
                {t("host.bookings.noBookingsDesc") ||
                  "As suas reservas aparecerão aqui quando os clientes começarem a reservar os seus tours."}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop view */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("host.bookings.customerName") || "Cliente"}
                    </th>
                    <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("host.bookings.tourName") || "Tour"}
                    </th>
                    <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("common.date") || "Data"}
                    </th>
                    <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("host.bookings.participants") || "Participantes"}
                    </th>
                    <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("host.bookings.amount") || "Valor"}
                    </th>
                    <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("host.bookings.status") || "Estado"}
                    </th>
                    <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("host.bookings.actions") || "Ações"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {booking.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="font-medium text-gray-900">
                          {booking.tourTitle}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.date, locale)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.time}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Users className="w-4 h-4 mr-1 text-gray-400" />
                          {booking.participants}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(booking.totalAmount)}
                        </div>
                      </td>
                      <td className="py-4">{getStatusBadge(booking.status)}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          {getStatusActions(booking)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view */}
            <div className="lg:hidden space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {booking.customerName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {booking.customerEmail}
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {booking.tourTitle}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(booking.date, locale)} às {booking.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {booking.participants}{" "}
                      {booking.participants === 1
                        ? t("common.person") || "pessoa"
                        : t("common.persons") || "pessoas"}
                    </div>
                    <div className="flex items-center font-medium text-gray-900">
                      <Euro className="w-4 h-4 mr-2" />
                      {formatCurrency(booking.totalAmount)}
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>
                          {t("bookingDetails.specialRequests") ||
                            "Pedidos especiais"}
                          :
                        </strong>{" "}
                        {booking.specialRequests}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {getStatusActions(booking)}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedBooking && (
        <Modal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          title={t("host.bookings.updateStatus") || "Actualizar Estado"}
        >
          <div className="space-y-4">
            <p>
              {t("host.bookings.updateStatusDesc") ||
                "Tem a certeza que quer actualizar o estado desta reserva?"}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowStatusModal(false)}
              >
                {t("common.cancel") || "Cancelar"}
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Handle status update
                }}
                disabled={updatingStatus !== null}
              >
                {updatingStatus
                  ? t("common.processing") || "A processar..."
                  : t("common.confirm") || "Confirmar"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
