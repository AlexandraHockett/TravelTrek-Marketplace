// ===================================================================
// 📁 components/host/BookingList.tsx
// Location: SUBSTITUIR components/host/BookingList.tsx
// ===================================================================

"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  MessageCircle,
} from "lucide-react";

interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  customerName: string;
  customerEmail: string;
  startDate: string;
  startTime: string;
  participants: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  specialRequests?: string;
}

interface BookingListProps {
  hostId: string;
}

export default function BookingList({ hostId }: BookingListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        // ✅ DEVELOPMENT MODE - Use mock data
        if (process.env.NODE_ENV === "development") {
          console.log("🔧 DEV MODE: Using mock booking data");

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 800));

          const mockBookings: Booking[] = [
            {
              id: "bk-001",
              tourId: "tour-001",
              tourTitle: "Porto Walking Tour",
              customerName: "Ana Costa",
              customerEmail: "ana.costa@email.com",
              startDate: "2025-09-06",
              startTime: "14:00",
              participants: 2,
              totalPrice: 50,
              status: "confirmed",
              createdAt: "2025-09-01T10:00:00Z",
              specialRequests: "Vegetarian lunch options please",
            },
            {
              id: "bk-002",
              tourId: "tour-002",
              tourTitle: "Lisbon Food Experience",
              customerName: "Carlos Ferreira",
              customerEmail: "carlos.ferreira@email.com",
              startDate: "2025-09-08",
              startTime: "10:30",
              participants: 4,
              totalPrice: 140,
              status: "confirmed",
              createdAt: "2025-09-02T14:00:00Z",
            },
            {
              id: "bk-003",
              tourId: "tour-003",
              tourTitle: "Sintra Day Trip",
              customerName: "Isabel Rodrigues",
              customerEmail: "isabel.rodrigues@email.com",
              startDate: "2025-09-10",
              startTime: "09:00",
              participants: 6,
              totalPrice: 210,
              status: "pending",
              createdAt: "2025-09-03T16:00:00Z",
              specialRequests: "Need wheelchair accessibility",
            },
            {
              id: "bk-004",
              tourId: "tour-001",
              tourTitle: "Porto Walking Tour",
              customerName: "Miguel Santos",
              customerEmail: "miguel.santos@email.com",
              startDate: "2025-08-20",
              startTime: "15:00",
              participants: 3,
              totalPrice: 75,
              status: "completed",
              createdAt: "2025-08-15T09:00:00Z",
            },
            {
              id: "bk-005",
              tourId: "tour-004",
              tourTitle: "Aveiro Boat Tour",
              customerName: "Sofia Lima",
              customerEmail: "sofia.lima@email.com",
              startDate: "2025-07-15",
              startTime: "11:00",
              participants: 2,
              totalPrice: 80,
              status: "completed",
              createdAt: "2025-07-10T11:00:00Z",
            },
            {
              id: "bk-006",
              tourId: "tour-002",
              tourTitle: "Lisbon Food Experience",
              customerName: "João Silva",
              customerEmail: "joao.silva@email.com",
              startDate: "2025-06-20",
              startTime: "12:00",
              participants: 1,
              totalPrice: 35,
              status: "cancelled",
              createdAt: "2025-06-15T10:00:00Z",
            },
          ];

          setBookings(mockBookings);
          setError(null);
          return;
        }

        // ✅ PRODUCTION MODE - Try real API
        const response = await fetch(`/api/bookings?hostId=${hostId}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch bookings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [hostId]);

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      // ✅ DEVELOPMENT MODE - Update local state only
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🔧 DEV MODE: Updating booking ${bookingId} to ${newStatus}`
        );

        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: newStatus as Booking["status"] }
              : booking
          )
        );
        return;
      }

      // ✅ PRODUCTION MODE - Update via API
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: newStatus as Booking["status"] }
            : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Error updating booking status");
    }
  };

  const filteredBookings = bookings.filter(
    (booking) => filter === "all" || booking.status === filter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading bookings...</p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-gray-400 mt-2">🔧 Loading mock data</p>
        )}
      </div>
    );
  }

  if (error && process.env.NODE_ENV !== "development") {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Bookings Management
        </h2>

        {/* Development Mode Indicator */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              🔧 Development Mode: Using mock booking data ({bookings.length}{" "}
              bookings)
            </p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {(
              ["all", "pending", "confirmed", "completed", "cancelled"] as const
            ).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === status
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {status === "all"
                    ? bookings.length
                    : bookings.filter((b) => b.status === status).length}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No bookings found for the selected filter.
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(booking.status)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.tourTitle}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{booking.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(booking.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{booking.startTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{booking.participants} participants</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-semibold text-gray-900">
                        €{booking.totalPrice}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        Booked{" "}
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Special Requests:</strong>{" "}
                        {booking.specialRequests}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="ml-4 flex flex-col gap-2">
                  <button className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>

                  {booking.status === "pending" && (
                    <div className="flex flex-col gap-1 mt-2">
                      <button
                        onClick={() =>
                          updateBookingStatus(booking.id, "confirmed")
                        }
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          updateBookingStatus(booking.id, "cancelled")
                        }
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {booking.status === "confirmed" &&
                    new Date(booking.startDate) < new Date() && (
                      <button
                        onClick={() =>
                          updateBookingStatus(booking.id, "completed")
                        }
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Mark Complete
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
