// File: app/[locale]/customer/bookings/[id]/client.tsx
// Location: Criar novo ficheiro

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import type { Booking, Translations } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

interface BookingDetailClientProps {
  booking: Booking;
  translations: Translations;
  locale: string;
}

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onConfirmCancel: (reason: string) => void;
  translations: Translations;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onClose,
  booking,
  onConfirmCancel,
  translations: t,
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
    booking.paymentStatus === "paid" ? booking.totalAmount * 0.8 : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t.bookingDetails?.cancelBooking || "Cancelar Reserva"}
        </h3>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-1 mr-2" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">
                {t.bookingDetails?.cancellationPolicy ||
                  "Política de Cancelamento"}
              </h4>
              <p className="text-sm text-yellow-700">
                {refundAmount > 0
                  ? `${t.bookingDetails?.partialRefund || "Reembolso parcial de"} €${refundAmount.toFixed(2)}`
                  : t.bookingDetails?.noRefund || "Sem reembolso disponível"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.bookingDetails?.cancelReason || "Motivo do cancelamento"}{" "}
              {/* Fixed: was cancellationReason */}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder={
                t.bookingDetails
                  ?.cancelReasonPlaceholder /* Fixed: was reasonPlaceholder */ ||
                "Indica o motivo do cancelamento..."
              }
              required
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              {t.common?.cancel || "Cancelar"}
            </Button>
            <Button
              type="submit"
              variant="danger"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading
                ? t.common?.loading || "A processar..."
                : t.bookingDetails?.confirmCancel || "Confirmar Cancelamento"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

const PaymentSection: React.FC<{
  booking: Booking;
  translations: Translations;
  onPaymentClick: () => void;
}> = ({ booking, translations: t, onPaymentClick }) => {
  if (booking.paymentStatus === "pending" && booking.status !== "cancelled") {
    return (
      <Card className="p-6 border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-orange-900 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {t.bookingDetails?.paymentPending || "Pagamento Pendente"}
          </h3>
          <Badge variant="warning">
            {t.bookingList?.pendingPayment || "Pagamento Pendente"}
          </Badge>
        </div>

        <div className="space-y-4">
          <p className="text-orange-800">
            {t.bookingDetails?.paymentInstructions ||
              "Complete o pagamento para confirmar a sua reserva."}
          </p>

          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">
                {booking.participants} {t.common?.person || "pessoa"}
                {booking.participants > 1 ? t.common?.persons || "s" : ""}:
              </span>
              <span className="text-gray-900">
                €{booking.totalAmount.toFixed(2)}
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
                  €{booking.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={onPaymentClick}
            size="lg"
            className="w-full text-white bg-green-600 hover:bg-green-700"
          >
            {t.bookingDetails?.payNow || "Pagar Agora"} €
            {booking.totalAmount.toFixed(2)}
          </Button>
        </div>
      </Card>
    );
  }

  return null;
};

export default function BookingDetailClient({
  booking,
  translations: t,
  locale,
}: BookingDetailClientProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Helper functions
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const localeMap: { [key: string]: string } = {
      pt: "pt-PT",
      en: "en-GB",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
    };
    return date.toLocaleDateString(localeMap[locale] || "pt-PT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return time || "14:30";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isUpcoming = new Date(booking.date) > new Date();
  const canCancel = booking.status === "confirmed" && isUpcoming;
  const canRebook =
    booking.status === "cancelled" || booking.status === "completed";

  const handleCancelBooking = async (reason: string) => {
    // Aqui seria chamada a API para cancelar
    console.log("Cancelar reserva:", booking.id, "Motivo:", reason);
    // Simular sucesso
    alert(t.bookingDetails?.cancelSuccess || "Reserva cancelada com sucesso!");
  };

  const handlePaymentClick = () => {
    // Aqui seria iniciado o processo de pagamento Stripe
    console.log("Iniciar pagamento para reserva:", booking.id);
    // Redirecionar para Stripe checkout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href={`/${locale}/customer/bookings`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t.pages?.bookingDetail?.title || "Detalhes da Reserva"}
            </h1>
            <p className="text-gray-600">
              {t.bookingList?.bookingNumber || "Reserva"} #
              {booking.id.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Status Alert */}
        <Card className={`p-4 mb-6 ${getStatusColor(booking.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(booking.status)}
              <div>
                <h3 className="font-semibold">
                  {t.bookingList?.[booking.status] || booking.status}
                </h3>
                <p className="text-sm opacity-90">
                  {booking.status === "pending" &&
                    (t.bookingDetails?.pendingMessage ||
                      "A aguardar confirmação do anfitrião")}
                  {booking.status === "confirmed" &&
                    (t.bookingDetails?.confirmedMessage ||
                      "A sua reserva foi confirmada!")}
                  {booking.status === "completed" &&
                    (t.bookingDetails?.completedMessage ||
                      "Experiência concluída")}
                  {booking.status === "cancelled" &&
                    (t.bookingDetails?.cancelledMessage || "Reserva cancelada")}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {canCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCancelModal(true)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  {t.bookingList?.cancel || "Cancelar"}
                </Button>
              )}
              {canRebook && (
                <Link href={`/${locale}/customer/tours/${booking.tourId}`}>
                  <Button variant="outline" size="sm">
                    {t.bookingList?.rebook || "Reservar Novamente"}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Card>

        {/* Payment Section - Only show if payment pending */}
        <PaymentSection
          booking={booking}
          translations={t}
          onPaymentClick={handlePaymentClick}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tour Information */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-32 h-32 flex-shrink-0">
                  <Image
                    src={booking.tourImage}
                    alt={booking.tourTitle}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {booking.tourTitle}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3">
                    {booking.tourDescription
                      ? t.bookingDetails?.tourDescription?.[
                          booking.tourDescription
                        ] || "Experiência única de viagem"
                      : "Experiência única de viagem"}
                  </p>
                  <Link href={`/${locale}/customer/tours/${booking.tourId}`}>
                    <Button variant="outline" size="sm">
                      {t.bookingDetails?.viewTour || "Ver Tour"}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Booking Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t.bookingDetails?.bookingDetails || "Detalhes da Reserva"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-gray-600 block text-sm">
                        {t.bookingList?.date || "Data"}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatDate(booking.date)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-gray-600 block text-sm">
                        {t.bookingDetails?.time || "Hora"}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatTime(booking.time)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-gray-600 block text-sm">
                        {t.bookingList?.participants || "Participantes"}
                      </span>
                      <span className="font-medium text-gray-900">
                        {booking.participants}{" "}
                        {booking.participants === 1
                          ? t.common?.person
                          : t.common?.persons || "pessoas"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <span className="text-gray-600 block text-sm">
                        {t.bookingDetails?.meetingPoint || "Ponto de Encontro"}
                      </span>
                      <span className="font-medium text-gray-900">
                        {booking.meetingPoint
                          ? t.bookingDetails?.meetingPointDetails?.[
                              booking.meetingPoint
                            ] || "A definir"
                          : "A definir"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-600 block text-sm">
                      {t.bookingList?.totalAmount || "Valor Total"}
                    </span>
                    <span className="font-medium text-gray-900 text-lg">
                      €{booking.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-600 block text-sm">
                      {t.bookingList?.createdAt || "Criada em"}
                    </span>
                    <span className="font-medium text-gray-900">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
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
                    {booking.specialRequests
                      ? t.bookingDetails?.specialRequests?.[
                          booking.specialRequests
                        ] || booking.specialRequests
                      : booking.specialRequests}
                  </p>
                </div>
              </Card>
            )}

            {/* Important Information */}
            {booking.status === "confirmed" && isUpcoming && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t.bookingDetails?.importantInformation ||
                    "Informações Importantes"}
                </h3>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 mr-3" />
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
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Host Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t.bookingDetails?.hostInformation ||
                  "Informações do Anfitrião"}
              </h3>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {booking.hostAvatar ? (
                    <Image
                      src={booking.hostAvatar}
                      alt={booking.hostName || "Host"}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-lg">
                      {booking.hostName?.charAt(0) || "H"}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">
                      {booking.hostName || "Anfitrião"}
                    </h4>
                    {booking.hostVerified && (
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {t.bookingDetails?.responseTime || "Tempo de resposta"}:{" "}
                    {booking.hostResponseTime || "< 1 hora"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {booking.hostPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a
                      href={`tel:${booking.hostPhone}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {booking.hostPhone}
                    </a>
                  </div>
                )}
                {booking.hostEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a
                      href={`mailto:${booking.hostEmail}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {booking.hostEmail}
                    </a>
                  </div>
                )}
              </div>

              <Button className="w-full mt-4" variant="outline" size="sm">
                {t.bookingDetails?.contactHost || "Contactar Anfitrião"}
              </Button>
            </Card>

            {/* Support */}
            <Card className="p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t.bookingDetails?.needHelp || "Precisa de Ajuda?"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {t.bookingDetails?.supportMessage ||
                  "A nossa equipa está disponível 24/7 para apoio."}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                {t.bookingDetails?.contactSupport || "Contactar Suporte"}
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
          translations={t}
        />
      </div>
    </div>
  );
}
