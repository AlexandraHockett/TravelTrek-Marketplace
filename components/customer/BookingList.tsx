// File: components/host/BookingList.tsx
// Location: REPLACE/CREATE in components/host/BookingList.tsx

"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Booking } from "@/types";
import { useTranslations } from "@/lib/i18n";
import { formatCurrency, formatDate } from "@/lib/utils";

interface BookingListProps {
  hostId?: string;
  locale: string;
  className?: string;
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
}: BookingListProps) {
  const t = useTranslations(locale);

  // State management
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (hostId) params.append("hostId", hostId);
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
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
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
          booking.id === bookingId ? { ...booking, ...updatedBooking } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking:", error);
      alert(t("errors.generic"));
    }
  };

  // Initial load and status filter changes
  useEffect(() => {
    fetchBookings();
  }, [selectedStatus, hostId]);

  // Filter and sort bookings
  const filteredAndSortedBookings = bookings
    .filter((booking) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          booking.customerName?.toLowerCase().includes(searchLower) ||
          booking.tourTitle?.toLowerCase().includes(searchLower) ||
          booking.customerEmail?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          comparison = (a.totalAmount || 0) - (b.totalAmount || 0);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Get status badge styles
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  // Export bookings data
  const exportBookings = () => {
    const csvContent = [
      [
        "Customer Name",
        "Email",
        "Tour",
        "Date",
        "Participants",
        "Amount",
        "Status",
      ].join(","),
      ...filteredAndSortedBookings.map((booking) =>
        [
          booking.customerName || "",
          booking.customerEmail || "",
          booking.tourTitle || "",
          formatDate(booking.date, locale),
          booking.participants || "",
          booking.totalAmount || "",
          t(`bookings.status.${booking.status}`),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {t("host.bookings.manageBookings")}
          </h2>

          <div className="flex gap-2">
            <button
              onClick={exportBookings}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
            <button
              onClick={fetchBookings}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
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
                placeholder={`${t("common.search")} customers, tours...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as BookingStatus)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">{t("bookings.status.pending")}</option>
            <option value="confirmed">{t("bookings.status.confirmed")}</option>
            <option value="completed">{t("bookings.status.completed")}</option>
            <option value="cancelled">{t("bookings.status.cancelled")}</option>
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field as typeof sortBy);
              setSortOrder(order as typeof sortOrder);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="status-asc">Status A-Z</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {filteredAndSortedBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {bookings.length === 0
                ? t("bookings.noBookings")
                : "No bookings match your filters"}
            </h3>
            {bookings.length === 0 && (
              <p className="text-gray-600">
                Your bookings will appear here once customers start booking your
                tours.
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
                      {t("host.bookings.customerName")}
                    </th>
                    <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("host.bookings.tourName")}
                    </th>
                    <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("host.bookings.date")}
                    </th>
                    <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("host.bookings.participants")}
                    </th>
                    <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("host.bookings.amount")}
                    </th>
                    <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("host.bookings.status")}
                    </th>
                    <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("host.bookings.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSortedBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {booking.customerName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {booking.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-900">
                        {booking.tourTitle}
                      </td>
                      <td className="py-4 text-sm text-gray-900">
                        {formatDate(booking.date, locale)}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Users className="w-4 h-4 mr-1" />
                          {booking.participants}
                        </div>
                      </td>
                      <td className="py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(
                          booking.totalAmount || 0,
                          booking.currency || "EUR"
                        )}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}
                        >
                          {t(`bookings.status.${booking.status}`)}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          {booking.status === "pending" && (
                            <button
                              onClick={() =>
                                updateBookingStatus(booking.id, "confirmed")
                              }
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              Confirm
                            </button>
                          )}
                          <a
                            href={`mailto:${booking.customerEmail}`}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view */}
            <div className="lg:hidden space-y-4">
              {filteredAndSortedBookings.map((booking) => (
                <div key={booking.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {booking.customerName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {booking.customerEmail}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}
                    >
                      {t(`bookings.status.${booking.status}`)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {booking.tourTitle}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(booking.date, locale)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {booking.participants}{" "}
                      {booking.participants === 1
                        ? t("common.person")
                        : t("common.persons")}
                    </div>
                    <div className="flex items-center font-medium text-gray-900">
                      <Euro className="w-4 h-4 mr-2" />
                      {formatCurrency(
                        booking.totalAmount || 0,
                        booking.currency || "EUR"
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {booking.status === "pending" && (
                      <button
                        onClick={() =>
                          updateBookingStatus(booking.id, "confirmed")
                        }
                        className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Confirm Booking
                      </button>
                    )}
                    <a
                      href={`mailto:${booking.customerEmail}`}
                      className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                    >
                      Contact
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
