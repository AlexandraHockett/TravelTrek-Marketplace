// File: app/[locale]/customer/bookings/[id]/page.tsx
// Location: MOVE the current app/customer/bookings/[id]/page.tsx to this new location

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { Booking, Translations } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getTranslations,
} from "@/lib/utils";
import {
  getLocaleFromPathname,
  getLocalizedHref,
  type Locale,
} from "@/lib/i18n";

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
    specialRequests: "bookingList.vegetarianRequest",
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
];

// Mock host contact info
const mockHostInfo = {
  name: "Maria Santos",
  avatar: "/images/avatars/host-avatar.webp",
  phone: "+351 912 345 678",
  email: "maria@traveltrek.com",
  responseTime: "< 1 hora",
  verified: true,
};

interface BookingDetailPageProps {
  params: {
    locale: Locale;
    id: string;
  };
}

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onConfirmCancel: (reason: string) => void;
  t: Translations;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onClose,
  booking,
  onConfirmCancel,
  t,
}) => {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert(
        t.bookingDetails?.cancelReasonRequired ||
          "Por favor, indica o motivo do cancelamento."
      );
      return;
    }

    setIsLoading(true);
    await onConfirmCancel(reason);
    setIsLoading(false);
    onClose();
  };

  const refundAmount =
    booking.paymentStatus === "paid" ? booking.totalAmount * 0.9 : 0; // 90% refund

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.bookingDetails?.cancelBooking || "Cancelar Reserva"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            {t.bookingDetails?.cancelDescription ||
              "Tens a certeza que queres cancelar esta reserva? Esta ação não pode ser desfeita."}
          </p>

          {refundAmount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-800">
                <strong>{t.bookingDetails?.refundInfo || "Reembolso"}:</strong>{" "}
                {formatCurrency(refundAmount)}{" "}
                {t.bookingDetails?.willBeRefunded || "será reembolsado"}
              </p>
            </div>
          )}

          <label
            htmlFor="cancelReason"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t.bookingDetails?.cancelReason || "Motivo do cancelamento"} *
          </label>
          <textarea
            id="cancelReason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder={
              t.bookingDetails?.cancelReasonPlaceholder ||
              "Por favor, explica o motivo do cancelamento..."
            }
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="default" onClick={onClose}>
            {t.common?.cancel || "Cancelar"}
          </Button>
          <Button
            type="submit"
            variant="danger"
            disabled={isLoading || !reason.trim()}
            className="text-black"
          >
            {isLoading
              ? t.common?.processing || "A processar..."
              : t.bookingDetails?.confirmCancel || "Confirmar Cancelamento"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface PaymentSectionProps {
  booking: Booking;
  onPaymentClick: () => void;
  t: Translations;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  booking,
  onPaymentClick,
  t,
}) => {
  if (booking.paymentStatus === "paid") {
    return (
      <Card className="p-6 border-green-200 bg-green-50">
        <div className="flex items-center">
          <span className="text-green-600 text-2xl mr-3">✅</span>
          <div>
            <h3 className="font-semibold text-green-800">
              {t.bookingDetails?.paymentCompleted || "Pagamento Concluído"}
            </h3>
            <p className="text-sm text-green-700">
              {t.bookingDetails?.paymentCompletedDescription ||
                "A tua reserva está confirmada e paga."}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (booking.paymentStatus === "pending" && booking.status !== "cancelled") {
    return (
      <Card className="p-6 border-orange-200 bg-orange-50">
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="text-orange-600 text-2xl mr-3">⏰</span>
            <div>
              <h3 className="font-semibold text-orange-800">
                {t.bookingDetails?.paymentPending || "Pagamento Pendente"}
              </h3>
              <p className="text-sm text-orange-700">
                {t.bookingDetails?.paymentPendingDescription ||
                  "Complete o pagamento para confirmar a sua reserva."}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">
                {booking.participants} {t.common?.person || "pessoa"}
                {booking.participants > 1 ? t.common?.persons || "s" : ""}:
              </span>
              <span className="text-gray-900">
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">
                {t.bookingDetails?.serviceFees || "Taxas de serviço"}:
              </span>
              <span className="text-gray-900">
                {t.bookingDetails?.included || "Incluídas"}
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">
                  {t.common?.total || "Total"}:
                </span>
                <span className="font-semibold text-xl text-gray-900">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={onPaymentClick}
            size="lg"
            className="w-full text-black"
          >
            {t.bookingDetails?.payNow || "Pagar Agora"}{" "}
            {formatCurrency(booking.totalAmount)}
          </Button>
        </div>
      </Card>
    );
  }

  return null;
};

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [t, setTranslations] = useState<Translations>({});
  const [currentLocale, setCurrentLocale] = useState<Locale>(params.locale);

  const pathname = usePathname();

  // Carregar traduções
  useEffect(() => {
    const loadTranslations = async () => {
      const translations = await getTranslations(params.locale);
      setTranslations(translations);
    };
    loadTranslations();
    setCurrentLocale(params.locale);
  }, [params.locale]);

  // In real app, fetch booking data based on params.id
  const booking = mockBookings.find((b) => b.id === params.id);

  if (!booking) {
    notFound();
  }

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

  const isUpcoming = new Date(booking.date) > new Date();
  const canCancel = booking.status === "confirmed" && isUpcoming;
  const canPay =
    booking.paymentStatus === "pending" && booking.status !== "cancelled";

  const handleCancelBooking = async (reason: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        `${t.bookingDetails?.cancelSuccess || "Reserva cancelada com sucesso"}. ${
          t.bookingDetails?.cancelReason || "Motivo"
        }: ${reason}`
      );

      // In real app, refresh booking data or redirect
      window.location.reload();
    } catch (error) {
      alert(
        t.bookingDetails?.cancelError ||
          "Erro ao cancelar reserva. Tenta novamente."
      );
    }
  };

  const handlePayment = async () => {
    try {
      alert(
        t.bookingDetails?.redirectingPayment ||
          "A redirecionar para o pagamento..."
      );

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect would happen here in real app
      window.location.reload();
    } catch (error) {
      alert(
        t.bookingDetails?.paymentError ||
          "Erro ao processar pagamento. Tenta novamente."
      );
    }
  };

  const handleContactHost = () => {
    alert(
      t.bookingDetails?.contactHostMessage || "A abrir chat com o anfitrião..."
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link
            href={getLocalizedHref("/", currentLocale)}
            className="hover:text-blue-600"
          >
            {t.nav?.home || "Início"}
          </Link>
          <span>›</span>
          <Link
            href={getLocalizedHref("/customer/bookings", currentLocale)}
            className="hover:text-blue-600"
          >
            {t.nav?.myBookings || "As Minhas Reservas"}
          </Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">
            {t.bookingDetails?.bookingDetails || "Detalhes da Reserva"}
          </span>
        </div>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {booking.tourTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span>
                {t.bookingList?.bookingNumber || "Reserva"} #{booking.id}
              </span>
              <span>•</span>
              <span>{formatDateTime(booking.createdAt)}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {getStatusBadge(booking.status)}
            {getPaymentStatusBadge(booking.paymentStatus)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Tour Image & Basic Info */}
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-64 flex-shrink-0">
                <img
                  src={booking.tourImage}
                  alt={booking.tourTitle}
                  className="w-full h-48 lg:h-32 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/placeholders/tour-placeholder.webp";
                  }}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {t.bookingDetails?.bookingInformation ||
                    "Informações da Reserva"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 block">
                      {t.bookingList?.date || "Data"}:
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatDate(booking.date)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">
                      {t.bookingList?.participants || "Participantes"}:
                    </span>
                    <span className="font-medium text-gray-900">
                      {booking.participants} {t.common?.person || "pessoa"}
                      {booking.participants > 1 ? t.common?.persons || "s" : ""}
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
                  <div>
                    <span className="text-gray-600 block">
                      {t.bookingList?.createdAt || "Criada em"}:
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatDate(booking.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Special Requests */}
          {booking.specialRequests && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t.bookingList?.specialRequests || "Pedidos Especiais"}
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  {t.bookingList?.vegetarianRequest}
                </p>
              </div>
            </Card>
          )}

          {/* Important Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t.bookingDetails?.importantInformation ||
                "Informações Importantes"}
            </h3>

            <div className="space-y-4">
              {isUpcoming && booking.status === "confirmed" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <span className="text-green-600 text-xl mr-2">✅</span>
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">
                        {t.bookingDetails?.confirmedBooking ||
                          "Reserva Confirmada"}
                      </h4>
                      <p className="text-sm text-green-700">
                        {t.bookingDetails?.meetingInstructions ||
                          "Apresente-se no local 15 minutos antes do início da experiência."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-blue-600 text-xl mr-2">📋</span>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">
                      {t.bookingDetails?.cancellationPolicy ||
                        "Política de Cancelamento"}
                    </h4>
                    <p className="text-sm text-blue-700">
                      {t.bookingDetails?.cancellationDescription ||
                        "Cancelamento gratuito até 24 horas antes do início do tour. Cancelamentos tardios podem incorrer em taxas."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t.bookingDetails?.actions || "Ações"}
            </h3>

            <div className="flex flex-wrap gap-3">
              <Link
                href={getLocalizedHref(
                  `/customer/tours/${booking.tourId}`,
                  currentLocale
                )}
              >
                <Button variant="default">
                  {t.bookingDetails?.viewTourDetails || "Ver Detalhes do Tour"}
                </Button>
              </Link>

              <Button onClick={handleContactHost} variant="default">
                {t.bookingDetails?.contactHost || "Contactar Anfitrião"}
              </Button>

              {canCancel && (
                <Button
                  onClick={() => setShowCancelModal(true)}
                  variant="danger"
                  className="text-black"
                >
                  {t.bookingDetails?.cancelBooking || "Cancelar Reserva"}
                </Button>
              )}

              {booking.status === "completed" && (
                <Button variant="default">
                  {t.bookingDetails?.leaveReview || "Deixar Avaliação"}
                </Button>
              )}

              {(booking.status === "cancelled" ||
                booking.status === "completed") && (
                <Link
                  href={getLocalizedHref(
                    `/customer/tours/${booking.tourId}`,
                    currentLocale
                  )}
                >
                  <Button>
                    {t.bookingList?.rebook || "Reservar Novamente"}
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Section */}
          <PaymentSection
            booking={booking}
            onPaymentClick={handlePayment}
            t={t}
          />

          {/* Host Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t.bookingDetails?.hostInformation || "Informações do Anfitrião"}
            </h3>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={mockHostInfo.avatar}
                alt={mockHostInfo.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholders/avatar-placeholder.webp";
                }}
              />
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium text-gray-900">
                    {mockHostInfo.name}
                  </h4>
                  {mockHostInfo.verified && (
                    <span className="ml-2 text-blue-600">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {t.bookingDetails?.responseTime || "Tempo de resposta"}:{" "}
                  {mockHostInfo.responseTime}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">📧</span>
                <a
                  href={`mailto:${mockHostInfo.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {mockHostInfo.email}
                </a>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">📞</span>
                <a
                  href={`tel:${mockHostInfo.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {mockHostInfo.phone}
                </a>
              </div>
            </div>

            <Button
              onClick={handleContactHost}
              variant="default"
              className="w-full mt-4"
            >
              {t.bookingDetails?.contactHost || "Contactar Anfitrião"}
            </Button>
          </Card>
        </div>
      </div>

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        booking={booking}
        onConfirmCancel={handleCancelBooking}
        t={t}
      />
    </div>
  );
}
