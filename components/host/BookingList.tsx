"use client";

import React, { useState } from "react";
import { Booking } from "@/types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";

interface BookingListProps {
  bookings: Booking[];
  onUpdateBooking?: (bookingId: string, status: Booking["status"]) => void;
  hostId: string; // Added hostId to props
  locale: string; // Added locale for i18n
}

interface BookingFilters {
  status: "all" | Booking["status"];
  sortBy: "date" | "created" | "amount";
  sortOrder: "asc" | "desc";
}

const BookingList: React.FC<BookingListProps> = ({
  bookings,
  onUpdateBooking,
}) => {
  const [filters, setFilters] = useState<BookingFilters>({
    status: "all",
    sortBy: "date",
    sortOrder: "desc",
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
  };

  const statusLabels = {
    pending: "Pendente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Concluída",
  };

  // Filter and sort bookings
  const filteredBookings = React.useMemo(() => {
    let filtered = bookings;

    if (filters.status !== "all") {
      filtered = filtered.filter(
        (booking) => booking.status === filters.status
      );
    }

    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case "date":
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case "created":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "amount":
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filtered;
  }, [bookings, filters]);

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: Booking["status"]
  ) => {
    setLoading(bookingId);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        onUpdateBooking?.(bookingId, newStatus);
      } else {
        throw new Error("Falha ao actualizar reserva");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Erro ao actualizar estado da reserva");
    } finally {
      setLoading(null);
    }
  };

  const getTotalEarnings = () => {
    return filteredBookings
      .filter(
        (booking) =>
          booking.status === "confirmed" || booking.status === "completed"
      )
      .reduce((total, booking) => total + booking.totalAmount, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestão de Reservas
          </h2>
          <p className="text-gray-600">
            {filteredBookings.length} reserva
            {filteredBookings.length !== 1 ? "s" : ""} • Ganhos:{" "}
            {formatCurrency(getTotalEarnings())}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value as any }))
            }
            className="text-sm"
          >
            <option value="all">Todos os Estados</option>
            <option value="pending">Pendentes</option>
            <option value="confirmed">Confirmadas</option>
            <option value="completed">Concluídas</option>
            <option value="cancelled">Canceladas</option>
          </select>

          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-");
              setFilters((prev) => ({
                ...prev,
                sortBy: sortBy as any,
                sortOrder: sortOrder as any,
              }));
            }}
            className="text-sm"
          >
            <option value="date-desc">Data (Mais Recente)</option>
            <option value="date-asc">Data (Mais Antiga)</option>
            <option value="created-desc">Criada (Mais Recente)</option>
            <option value="created-asc">Criada (Mais Antiga)</option>
            <option value="amount-desc">Valor (Maior)</option>
            <option value="amount-asc">Valor (Menor)</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card className="text-center py-12">
          <svg
            className="h-12 w-12 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sem reservas
          </h3>
          <p className="text-gray-600">
            Ainda não tens reservas com estes filtros.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} padding="none" className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {booking.tourTitle}
                      </h3>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          statusColors[booking.status]
                        )}
                      >
                        {statusLabels[booking.status]}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Cliente:</span>{" "}
                        {booking.customerName}
                      </div>
                      <div>
                        <span className="font-medium">Data:</span>{" "}
                        {formatDate(booking.date)}
                      </div>
                      <div>
                        <span className="font-medium">Participantes:</span>{" "}
                        {booking.participants}
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">
                          Pedidos especiais:
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          {booking.specialRequests}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(booking.totalAmount)}
                    </div>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        booking.paymentStatus === "paid"
                          ? "text-success"
                          : "text-warning"
                      )}
                    >
                      {booking.paymentStatus === "paid"
                        ? "Pago"
                        : "Pagamento pendente"}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    Ver Detalhes
                  </Button>

                  {booking.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        loading={loading === booking.id}
                        onClick={() =>
                          handleStatusUpdate(booking.id, "confirmed")
                        }
                      >
                        Confirmar
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        loading={loading === booking.id}
                        onClick={() =>
                          handleStatusUpdate(booking.id, "cancelled")
                        }
                      >
                        Cancelar
                      </Button>
                    </>
                  )}

                  {booking.status === "confirmed" &&
                    new Date(booking.date) < new Date() && (
                      <Button
                        size="sm"
                        loading={loading === booking.id}
                        onClick={() =>
                          handleStatusUpdate(booking.id, "completed")
                        }
                      >
                        Marcar como Concluída
                      </Button>
                    )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Detalhes da Reserva"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Informações do Cliente
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Nome:</span>
                  <p className="font-medium">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium">{selectedBooking.customerEmail}</p>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Detalhes da Reserva
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Data da Experiência:</span>
                  <p className="font-medium">
                    {formatDate(selectedBooking.date)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Participantes:</span>
                  <p className="font-medium">{selectedBooking.participants}</p>
                </div>
                <div>
                  <span className="text-gray-500">Estado:</span>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium inline-block",
                      statusColors[selectedBooking.status]
                    )}
                  >
                    {statusLabels[selectedBooking.status]}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Valor Total:</span>
                  <p className="font-bold text-lg">
                    {formatCurrency(selectedBooking.totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {selectedBooking.specialRequests && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Pedidos Especiais
                </h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedBooking.specialRequests}
                </p>
              </div>
            )}

            {/* Timeline */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Cronologia</h4>
              <div className="text-sm text-gray-600">
                <p>Reserva criada: {formatDate(selectedBooking.createdAt)}</p>
                <p>
                  Última actualização: {formatDate(selectedBooking.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingList;
