// File: components/customer/BookingList.tsx
// Location: Create this file in the components/customer/ directory

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Booking, Translations } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatCurrency, getTranslations } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  getLocaleFromPathname,
  getLocaleFromCookie,
  type Locale,
} from "@/lib/i18n";

interface BookingListProps {
  bookings: Booking[];
  variant?: "default" | "compact" | "detailed";
  showActions?: boolean;
  showFilters?: boolean;
  emptyStateMessage?: string;
  emptyStateAction?: {
    label: string;
    href: string;
  };
  onStatusChange?: (bookingId: string, newStatus: string) => void;
  className?: string;
}

interface BookingItemProps {
  booking: Booking;
  variant: "default" | "compact" | "detailed";
  showActions: boolean;
  onStatusChange?: (bookingId: string, newStatus: string) => void;
}

const BookingItem: React.FC<BookingItemProps> = ({
  booking,
  variant,
  showActions,
  onStatusChange,
}) => {
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<Locale>("pt");
  const [t, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const loadTranslations = async () => {
      const pathLocale =
        getLocaleFromPathname(pathname) || getLocaleFromCookie() || "pt";
      setCurrentLocale(pathLocale as Locale);
      const translations = await getTranslations(pathLocale);
      setTranslations(translations);
    };
    loadTranslations();
  }, [pathname]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="warning">
            {t.bookingList?.pending || "Pendente"}
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="success">
            {t.bookingList?.confirmed || "Confirmada"}
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default">
            {t.bookingList?.completed || "Concluída"}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="error">
            {t.bookingList?.cancelled || "Cancelada"}
          </Badge>
        );
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "pending":
        return (
          <Badge variant="warning" size="sm">
            {t.bookingList?.pendingPayment || "Pagamento Pendente"}
          </Badge>
        );
      case "paid":
        return (
          <Badge variant="success" size="sm">
            {t.bookingList?.paid || "Pago"}
          </Badge>
        );
      case "refunded":
        return (
          <Badge variant="default" size="sm">
            {t.bookingList?.refunded || "Reembolsado"}
          </Badge>
        );
      default:
        return (
          <Badge variant="default" size="sm">
            {paymentStatus}
          </Badge>
        );
    }
  };

  const getActionButtons = () => {
    const actions: React.ReactElement[] = [];
    const isUpcoming = new Date(booking.date) > new Date();

    // View Details (always available)
    actions.push(
      <Link key="view" href={`/customer/bookings/${booking.id}`}>
        <Button variant="default" size="sm">
          {t.bookingList?.viewDetails || "Ver Detalhes"}
        </Button>
      </Link>
    );

    // Payment action for pending payments
    if (booking.paymentStatus === "pending" && booking.status !== "cancelled") {
      actions.push(
        <Button key="pay" size="sm" className="bg-green-600 hover:bg-green-700">
          {t.bookingList?.pay || "Pagar"}
        </Button>
      );
    }

    // Cancel action for confirmed bookings
    if (booking.status === "confirmed" && isUpcoming) {
      actions.push(
        <Button key="cancel" variant="danger" size="sm">
          {t.bookingList?.cancel || "Cancelar"}
        </Button>
      );
    }

    // Rebook action for cancelled or completed bookings
    if (booking.status === "cancelled" || booking.status === "completed") {
      actions.push(
        <Link key="rebook" href={`/customer/tours/${booking.tourId}`}>
          <Button variant="default" size="sm">
            {t.bookingList?.rebook || "Reservar Novamente"}
          </Button>
        </Link>
      );
    }

    return actions;
  };

  const isUpcoming = new Date(booking.date) > new Date();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLocale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Compact variant for dashboard/sidebar
  if (variant === "compact") {
    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <img
              src={booking.tourImage}
              alt={booking.tourTitle}
              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/placeholders/tour-placeholder.webp";
              }}
            />

            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-gray-900 text-sm truncate">
                {booking.tourTitle}
              </h4>
              <p className="text-xs text-gray-600">
                {formatDate(booking.date)}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusBadge(booking.status)}
                {booking.paymentStatus === "pending" && (
                  <Badge variant="warning" size="sm" className="text-xs">
                    {t.bookingList?.pay || "Pagar"}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="font-medium text-sm text-gray-900">
              {formatCurrency(booking.totalAmount)}
            </p>
            {showActions && (
              <Link href={`/customer/bookings/${booking.id}`}>
                <Button variant="default" size="sm" className="mt-2">
                  {t.bookingList?.viewDetails || "Ver"}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Detailed variant with full information
  if (variant === "detailed") {
    return (
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tour Image & Info */}
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
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {booking.tourTitle}
                </h3>
                <p className="text-sm text-gray-600">
                  {t.bookingList?.bookingNumber || "Reserva"} #{booking.id}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {getStatusBadge(booking.status)}
                {getPaymentStatusBadge(booking.paymentStatus)}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600 block">
                  {t.bookingList?.date || "Data"}:
                </span>
                <span
                  className={`font-medium ${isUpcoming ? "text-blue-600" : "text-gray-900"}`}
                >
                  {formatDate(booking.date)}
                  {isUpcoming && (
                    <Badge
                      variant="default"
                      size="sm"
                      className="ml-2 text-blue-600"
                    >
                      {t.bookingList?.next || "Próximo"}
                    </Badge>
                  )}
                </span>
              </div>

              <div>
                <span className="text-gray-600 block">
                  {t.bookingList?.participants || "Participantes"}:
                </span>
                <span className="font-medium text-gray-900">
                  {booking.participants} {t.bookingList?.person || "pessoa"}
                  {booking.participants > 1 ? "s" : ""}
                </span>
              </div>

              <div>
                <span className="text-gray-600 block">
                  {t.bookingList?.totalAmount || "Valor Total"}:
                </span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>
                    {t.bookingList?.specialRequests || "Pedidos especiais"}:
                  </strong>{" "}
                  {booking.specialRequests}
                </p>
              </div>
            )}

            {/* Footer with metadata and actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {t.bookingList?.createdAt || "Criada em"}{" "}
                {new Date(booking.createdAt).toLocaleDateString(currentLocale)}
              </div>

              {showActions && (
                <div className="flex flex-wrap gap-2">{getActionButtons()}</div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Tour Image */}
        <div className="sm:w-32 flex-shrink-0">
          <img
            src={booking.tourImage}
            alt={booking.tourTitle}
            className="w-full h-24 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/placeholders/tour-placeholder.webp";
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900">
                {booking.tourTitle}
              </h3>
              <p className="text-sm text-gray-600">
                {formatDate(booking.date)} • {booking.participants}{" "}
                {t.bookingList?.person || "pessoa"}
                {booking.participants > 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {getStatusBadge(booking.status)}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="font-medium text-gray-900">
              {formatCurrency(booking.totalAmount)}
            </div>

            {showActions && (
              <div className="flex gap-2">
                <Link href={`/customer/bookings/${booking.id}`}>
                  <Button variant="default" size="sm">
                    {t.bookingList?.viewDetails || "Ver Detalhes"}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const BookingList: React.FC<BookingListProps> = ({
  bookings,
  variant = "default",
  showActions = true,
  showFilters = false,
  emptyStateMessage = "Ainda não tens reservas.",
  emptyStateAction,
  onStatusChange,
  className = "",
}) => {
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<Locale>("pt");
  const [t, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const loadTranslations = async () => {
      const pathLocale =
        getLocaleFromPathname(pathname) || getLocaleFromCookie() || "pt";
      setCurrentLocale(pathLocale as Locale);
      const translations = await getTranslations(pathLocale);
      setTranslations(translations);
    };
    loadTranslations();
  }, [pathname]);

  if (bookings.length === 0) {
    return (
      <Card className={`p-12 text-center ${className}`}>
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t.bookingList?.noBookings || emptyStateMessage}
        </h3>
        {emptyStateAction && (
          <div className="mt-6">
            <Link href={emptyStateAction.href}>
              <Button size="lg">{emptyStateAction.label}</Button>
            </Link>
          </div>
        )}
      </Card>
    );
  }

  return (
    <div
      className={`space-y-${variant === "compact" ? "3" : "6"} ${className}`}
    >
      {bookings.map((booking) => (
        <BookingItem
          key={booking.id}
          booking={booking}
          variant={variant}
          showActions={showActions}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default BookingList;
