// File: app/[locale]/customer/bookings/page.tsx
// Location: CREATE/REPLACE in app/[locale]/customer/bookings/page.tsx

"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Booking } from "@/types";
import { useTranslations } from "@/lib/i18n";
import { formatCurrency, formatDate } from "@/lib/utils";
import { QuickPayment } from "@/components/customer/PaymentButton";

interface CustomerBookingsPageProps {
  params: { locale: string };
}

type BookingFilter = "all" | "upcoming" | "past" | "cancelled";

export default function CustomerBookingsPage({
  params,
}: CustomerBookingsPageProps) {
  const { locale } = params;
  const t = useTranslations(locale);
  const searchParams = useSearchParams();

  // State management
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<BookingFilter>("all");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  // Check for payment status from URL params (after Stripe redirect)
  useEffect(() => {
    const payment = searchParams.get("payment");
    const booking = searchParams.get("booking");

    if (payment === "success") {
      setPaymentStatus(
        `Payment successful! ${booking ? `Booking ${booking} is now confirmed.` : ""}`
      );
    } else if (payment === "cancelled") {
      setPaymentStatus(
        "Payment cancelled. You can try again from your bookings."
      );
    }

    // Clear payment status after 5 seconds
    if (payment) {
      setTimeout(() => setPaymentStatus(null), 5000);
    }
  }, [searchParams]);

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
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Load bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on selected filter
  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const now = new Date();

    switch (filter) {
      case "upcoming":
        return bookingDate >= now && booking.status !== "cancelled";
      case "past":
        return bookingDate < now || booking.status === "completed";
      case "cancelled":
        return booking.status === "cancelled";
      default:
        return true;
    }
  });

  // Get status badge styles
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
      confirmed: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: CheckCircle,
      },
      paid: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
      completed: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: CheckCircle,
      },
      cancelled: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
    };

    return styles[status as keyof typeof styles] || styles.pending;
  };

  // Handle payment success
  const handlePaymentSuccess = (booking: Booking) => {
    // Update booking status locally
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? { ...b, paymentStatus: "paid", status: "confirmed" }
          : b
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
            {t("bookings.myBookings")}
          </h1>
          <p className="text-lg text-gray-600">
            Manage your tour bookings and payments
          </p>
        </div>

        {/* Payment Status Alert */}
        {paymentStatus && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center ${
              paymentStatus.includes("successful")
                ? "bg-green-50 border border-green-200"
                : "bg-yellow-50 border border-yellow-200"
            }`}
          >
            <CheckCircle
              className={`w-5 h-5 mr-3 ${
                paymentStatus.includes("successful")
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            />
            <span
              className={`text-sm ${
                paymentStatus.includes("successful")
                  ? "text-green-800"
                  : "text-yellow-800"
              }`}
            >
              {paymentStatus}
            </span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { key: "all", label: "All Bookings" },
              { key: "upcoming", label: t("bookings.upcomingBookings") },
              { key: "past", label: t("bookings.pastBookings") },
              { key: "cancelled", label: "Cancelled" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as BookingFilter)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {filteredBookings.length}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-6">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">
              Error Loading Bookings
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchBookings}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!error && filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {bookings.length === 0
                ? t("bookings.noBookings")
                : "No bookings match your filter"}
            </h3>
            <p className="text-gray-600 mb-6">
              {bookings.length === 0
                ? "Start exploring amazing tours and experiences"
                : "Try selecting a different filter to view your bookings"}
            </p>
            <a
              href={`/${locale}/customer/tours`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Tours
            </a>
          </div>
        )}

        {/* Bookings List */}
        {!error && filteredBookings.length > 0 && (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const statusBadge = getStatusBadge(booking.status);
              const StatusIcon = statusBadge.icon;
              const needsPayment =
                booking.paymentStatus === "pending" &&
                booking.status !== "cancelled";

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                      <div className="flex items-center space-x-3 mb-2 lg:mb-0">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
                        >
                          <StatusIcon className="w-4 h-4 mr-1" />
                          {t(`bookings.status.${booking.status}`)}
                        </div>
                        {needsPayment && (
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <CreditCard className="w-4 h-4 mr-1" />
                            Payment Required
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Booking ID: {booking.id}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Tour Information */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {booking.tourTitle}
                        </h3>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatDate(booking.date, locale)}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            <span>
                              {booking.participants}{" "}
                              {booking.participants === 1
                                ? t("common.person")
                                : t("common.persons")}
                            </span>
                          </div>
                          {booking.specialRequests && (
                            <div className="flex items-start">
                              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-xs">
                                {booking.specialRequests}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div>
                        <div className="text-right mb-4">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(
                              booking.totalAmount || 0,
                              booking.currency || "EUR"
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Amount
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          {needsPayment && (
                            <QuickPayment
                              bookingId={booking.id}
                              amount={booking.totalAmount || 0}
                              currency={booking.currency || "EUR"}
                              locale={locale}
                              onSuccess={() => handlePaymentSuccess(booking)}
                              onError={(error) =>
                                console.error("Payment error:", error)
                              }
                            />
                          )}

                          <a
                            href={`/${locale}/customer/bookings/${booking.id}`}
                            className={`inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${
                              needsPayment ? "" : "flex-1"
                            }`}
                          >
                            {t("bookings.actions.viewDetails")}
                          </a>

                          {booking.status === "confirmed" && (
                            <a
                              href={`mailto:host@example.com`}
                              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              {t("bookings.actions.contactHost")}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {filteredBookings.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Load More Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
