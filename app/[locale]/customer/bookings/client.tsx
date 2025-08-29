// File: app/[locale]/customer/bookings/client.tsx
// Location: Substituir o ficheiro existente

"use client";
import React from "react";
import Link from "next/link";
import { Booking, Translations } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

interface CustomerBookingsClientProps {
  initialBookings: Booking[];
  translations: Translations;
  locale: string;
}

interface BookingFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  translations: Translations;
}

const BookingFilters: React.FC<BookingFiltersProps> = ({
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  translations: t,
}) => {
  const statusOptions = [
    { value: "all", label: t.pages?.customerBookings?.filters?.all || "Todas" },
    { value: "pending", label: t.bookingList?.pending || "Pendentes" },
    { value: "confirmed", label: t.bookingList?.confirmed || "Confirmadas" },
    { value: "completed", label: t.bookingList?.completed || "Concluídas" },
    { value: "cancelled", label: t.bookingList?.cancelled || "Canceladas" },
  ];

  const sortOptions = [
    {
      value: "date-desc",
      label: t.pages?.customerBookings?.sort?.dateDesc || "Data mais recente",
    },
    {
      value: "date-asc",
      label: t.pages?.customerBookings?.sort?.dateAsc || "Data mais antiga",
    },
    { value: "created-desc", label: "Reserva mais recente" },
    {
      value: "amount-desc",
      label: t.pages?.customerBookings?.sort?.amountDesc || "Valor mais alto",
    },
    {
      value: "amount-asc",
      label: t.pages?.customerBookings?.sort?.amountAsc || "Valor mais baixo",
    },
  ];

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.pages?.customerBookings?.filters?.bookingStatusLabel}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            {t.pages?.customerBookings?.filters?.sortByLabel}
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
  translations: Translations;
  locale: string;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  translations: t,
  locale,
}) => {
  const getStatusBadge = (status: string, paymentStatus: string) => {
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
          <Badge variant="warning" className="bg-orange-100 text-orange-800">
            {t.bookingList?.pendingPayment || "Pagamento Pendente"}
          </Badge>
        );
      case "paid":
        return (
          <Badge variant="success" className="bg-green-100 text-green-800">
            {t.bookingList?.paid || "Pago"}
          </Badge>
        );
      case "refunded":
        return (
          <Badge variant="default" className="bg-gray-100 text-gray-800">
            {t.bookingList?.refunded || "Reembolsado"}
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
      <Link key="view" href={`/${locale}/customer/bookings/${booking.id}`}>
        <Button variant="default" size="sm">
          {t.bookingList?.viewDetails || "Ver Detalhes"}
        </Button>
      </Link>
    );

    // Payment action for pending payments
    if (booking.paymentStatus === "pending" && booking.status !== "cancelled") {
      actions.push(
        <Button key="pay" size="sm" className="bg-green-600 hover:bg-green-700">
          {t.bookingList?.pay || "Pagar Agora"}
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
          {t.bookingList?.cancel || "Cancelar"}
        </Button>
      );
    }

    // Rebook action for cancelled or completed bookings
    if (booking.status === "cancelled" || booking.status === "completed") {
      actions.push(
        <Link key="rebook" href={`/${locale}/customer/tours/${booking.tourId}`}>
          <Button variant="default" size="sm">
            {t.bookingList?.rebook || "Reservar Novamente"}
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

  // Formatação de data baseada no locale
  const getLocaleDateString = (date: string) => {
    const localeMap: { [key: string]: string } = {
      pt: "pt-PT",
      en: "en-GB",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
    };

    return new Date(date).toLocaleDateString(localeMap[locale] || "pt-PT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getShortDateString = (date: string) => {
    const localeMap: { [key: string]: string } = {
      pt: "pt-PT",
      en: "en-GB",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
    };

    return new Date(date).toLocaleDateString(localeMap[locale] || "pt-PT");
  };

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
                  {getLocaleDateString(booking.date)}
                </span>
                {isUpcoming && (
                  <Badge
                    variant="default"
                    size="sm"
                    className="ml-2 text-blue-600 border-blue-200"
                  >
                    {t.bookingList?.next || "Próximo"}
                  </Badge>
                )}
              </div>

              <div className="flex items-center">
                <span className="mr-1">👥</span>
                {booking.participants}{" "}
                {booking.participants === 1
                  ? t.bookingList?.person || "pessoa"
                  : t.bookingList?.persons || "pessoas"}
              </div>

              <div className="flex items-center font-medium text-gray-900">
                <span className="mr-1">💰</span>
                {formatCurrency(booking.totalAmount)}
              </div>
            </div>

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
          </div>

          {/* Booking Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {t.bookingList?.bookingNumber || "Reserva"} #{booking.id} •{" "}
              {t.bookingList?.createdAt || "Criada em"}{" "}
              {getShortDateString(booking.createdAt)}
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
  translations: Translations;
}

const BookingStats: React.FC<BookingStatsProps> = ({
  bookings,
  translations: t,
}) => {
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
        <div className="text-sm text-gray-600">
          {t.pages?.customerBookings?.stats?.totalBookings ||
            "Total de Reservas"}
        </div>
      </Card>

      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-green-600 mb-1">
          {stats.upcoming}
        </div>
        <div className="text-sm text-gray-600">
          {t.pages?.customerBookings?.stats?.upcoming || "Próximas"}
        </div>
      </Card>

      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-purple-600 mb-1">
          {stats.completed}
        </div>
        <div className="text-sm text-gray-600">
          {t.bookingList?.completed || "Concluídas"}
        </div>
      </Card>

      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-orange-600 mb-1">
          {stats.pending}
        </div>
        <div className="text-sm text-gray-600">
          {t.bookingList?.pending || "Pendentes"}
        </div>
      </Card>

      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {formatCurrency(stats.totalSpent)}
        </div>
        <div className="text-sm text-gray-600">
          {t.pages?.customerBookings?.stats?.totalSpent || "Gasto Total"}
        </div>
      </Card>
    </div>
  );
};

export default function CustomerBookingsClient({
  initialBookings,
  translations: t,
  locale,
}: CustomerBookingsClientProps) {
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("date-desc");

  // Filter bookings
  const filteredBookings = initialBookings.filter((booking) => {
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

  // Função para data curta baseada no locale
  const getShortDateString = (date: string) => {
    const localeMap: { [key: string]: string } = {
      pt: "pt-PT",
      en: "en-GB",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
    };

    return new Date(date).toLocaleDateString(localeMap[locale] || "pt-PT");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t.pages?.customerBookings?.title || "As Minhas Reservas"} 📅
            </h1>
            <p className="text-gray-600">
              {t.pages?.customerBookings?.subtitle ||
                "Gere as suas reservas de tours e experiências"}
            </p>
          </div>

          <Link href={`/${locale}/customer/tours`}>
            <Button size="lg" className="flex items-center gap-2 text-black">
              <span>🔍</span>
              {t.pages?.customerBookings?.browseTours || "Explorar Mais Tours"}
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <BookingStats bookings={initialBookings} translations={t} />

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
                    {getShortDateString(booking.date)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {booking.participants}{" "}
                      {booking.participants === 1
                        ? t.bookingList?.person || "pessoa"
                        : t.bookingList?.persons || "pessoas"}
                    </span>
                    <Link href={`/${locale}/customer/bookings/${booking.id}`}>
                      <Button variant="default" size="sm">
                        {t.bookingList?.view}
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
          translations={t}
        />

        {/* Bookings List */}
        {sortedBookings.length === 0 ? (
          <Card className="p-12 text-center">
            {statusFilter === "all" ? (
              <>
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t.bookingList?.noBookings || "Ainda não tens reservas"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t.pages?.customerBookings?.noBookingsDescription ||
                    "Descobre experiências únicas em Portugal e faz a tua primeira reserva!"}
                </p>
                <Link href={`/${locale}/customer/tours`}>
                  <Button size="lg">
                    {t.pages?.customerBookings?.browseTours || "Explorar Tours"}
                  </Button>
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
              <BookingCard
                key={booking.id}
                booking={booking}
                translations={t}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
