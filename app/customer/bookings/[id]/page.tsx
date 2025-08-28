// File: app/customer/bookings/[id]/page.tsx
// Location: Create this file in the app/customer/bookings/[id]/ directory

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Booking } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/utils";

// Mock data - replace with actual API calls later
const mockBookings: Booking[] = [
  {
    id: "b1",
    tourId: "t1",
    tourTitle: "Porto Food & Wine Tour",
    tourImage: "/images/porto-food.jpg",
    customerId: "c1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    hostId: "h1",
    date: "2025-09-15",
    participants: 2,
    totalAmount: 89.98,
    status: "confirmed",
    paymentStatus: "paid",
    specialRequests:
      "One participant is vegetarian, please provide suitable food options. Also, we would prefer to start the tour at 10:30 instead of 10:00 if possible.",
    createdAt: "2025-08-20T10:00:00Z",
    updatedAt: "2025-08-20T10:00:00Z",
  },
  {
    id: "b2",
    tourId: "t2",
    tourTitle: "Sintra Royal Palaces",
    tourImage: "/images/sintra-palace.jpg",
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
  avatar: "/images/host-avatar.jpg",
  phone: "+351 912 345 678",
  email: "maria@traveltrek.com",
  responseTime: "< 1 hora",
  verified: true,
};

interface BookingDetailPageProps {
  params: {
    id: string;
  };
}

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onConfirmCancel: (reason: string) => void;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onClose,
  booking,
  onConfirmCancel,
}) => {
  const [reason, setReason] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("Por favor, indica o motivo do cancelamento.");
      return;
    }

    setIsLoading(true);
    await onConfirmCancel(reason);
    setIsLoading(false);
    onClose();
  };

  const refundAmount =
    booking.paymentStatus === "paid" ? booking.totalAmount : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cancelar Reserva">
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-yellow-600 text-xl mr-2">⚠️</span>
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">
                Política de Cancelamento
              </h4>
              <p className="text-sm text-yellow-700">
                Cancelamento gratuito até 24 horas antes do início do tour.
                {refundAmount > 0 && (
                  <span className="block mt-2 font-medium">
                    Valor a reembolsar: {formatCurrency(refundAmount)}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo do cancelamento *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Por favor, explica o motivo do cancelamento..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="default"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Manter Reserva
            </Button>
            <Button
              type="submit"
              variant="danger"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "A cancelar..." : "Confirmar Cancelamento"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

interface PaymentSectionProps {
  booking: Booking;
  onPaymentClick: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  booking,
  onPaymentClick,
}) => {
  const getPaymentStatusInfo = () => {
    switch (booking.paymentStatus) {
      case "pending":
        return {
          icon: "⏳",
          text: "Pagamento Pendente",
          description: "Complete o pagamento para confirmar a sua reserva.",
          variant: "warning" as const,
          showPayButton: true,
        };
      case "paid":
        return {
          icon: "✅",
          text: "Pago",
          description: "Pagamento processado com sucesso.",
          variant: "success" as const,
          showPayButton: false,
        };
      case "refunded":
        return {
          icon: "↩️",
          text: "Reembolsado",
          description:
            "O valor foi reembolsado para o seu método de pagamento original.",
          variant: "default" as const,
          showPayButton: false,
        };
      default:
        return {
          icon: "❓",
          text: booking.paymentStatus,
          description: "",
          variant: "default" as const,
          showPayButton: false,
        };
    }
  };

  const paymentInfo = getPaymentStatusInfo();

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Informações de Pagamento
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{paymentInfo.icon}</span>
            <div>
              <Badge variant={paymentInfo.variant}>{paymentInfo.text}</Badge>
              <p className="text-sm text-gray-600 mt-1">
                {paymentInfo.description}
              </p>
            </div>
          </div>

          {paymentInfo.showPayButton && (
            <Button
              onClick={onPaymentClick}
              className="bg-green-600 hover:bg-green-700"
            >
              Pagar Agora
            </Button>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">
              Subtotal ({booking.participants} pessoa
              {booking.participants > 1 ? "s" : ""}):
            </span>
            <span className="text-gray-900">
              {formatCurrency(booking.totalAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Taxas de serviço:</span>
            <span className="text-gray-900">Incluídas</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="font-semibold text-xl text-gray-900">
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  const [showCancelModal, setShowCancelModal] = React.useState(false);

  // In real app, fetch booking data based on params.id
  const booking = mockBookings.find((b) => b.id === params.id);

  if (!booking) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Pendente</Badge>;
      case "confirmed":
        return <Badge variant="success">Confirmada</Badge>;
      case "completed":
        return <Badge variant="default">Concluída</Badge>;
      case "cancelled":
        return <Badge variant="error">Cancelada</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
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

      alert(`Reserva cancelada com sucesso. Motivo: ${reason}`);

      // In real app, refresh booking data or redirect
      window.location.reload();
    } catch (error) {
      alert("Erro ao cancelar reserva. Tenta novamente.");
    }
  };

  const handlePayment = async () => {
    try {
      // In real app, redirect to Stripe checkout
      alert("A redirecionar para o pagamento...");

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect would happen here in real app
      window.location.reload();
    } catch (error) {
      alert("Erro ao processar pagamento. Tenta novamente.");
    }
  };

  const handleContactHost = () => {
    // In real app, this would open messaging system or redirect to contact
    alert(`A contactar ${mockHostInfo.name}...`);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/customer/bookings" className="hover:text-blue-600">
              Reservas
            </Link>
            <span>→</span>
            <span className="text-gray-900">Reserva #{booking.id}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-48 flex-shrink-0">
                  <img
                    src={booking.tourImage}
                    alt={booking.tourTitle}
                    className="w-full h-40 md:h-32 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/tour-placeholder.jpg";
                    }}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {booking.tourTitle}
                      </h1>
                      <p className="text-gray-600 text-sm">
                        Reserva #{booking.id}
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Data:</span>
                      <p className="font-medium text-gray-900">
                        {formatDateTime(booking.date)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Participantes:</span>
                      <p className="font-medium text-gray-900">
                        {booking.participants} pessoa
                        {booking.participants > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Valor Total:</span>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(booking.totalAmount)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Criada em:</span>
                      <p className="font-medium text-gray-900">
                        {new Date(booking.createdAt).toLocaleDateString(
                          "pt-PT"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Special Requests */}
            {booking.specialRequests && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Pedidos Especiais
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">{booking.specialRequests}</p>
                </div>
              </Card>
            )}

            {/* Important Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informações Importantes
              </h3>

              <div className="space-y-4">
                {canPay && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <span className="text-orange-600 text-xl mr-2">⚠️</span>
                      <div>
                        <h4 className="font-medium text-orange-800 mb-1">
                          Pagamento Pendente
                        </h4>
                        <p className="text-sm text-orange-700">
                          Complete o pagamento para confirmar a sua reserva.
                          Reservas não pagas podem ser canceladas
                          automaticamente.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isUpcoming && booking.status === "confirmed" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <span className="text-green-600 text-xl mr-2">✅</span>
                      <div>
                        <h4 className="font-medium text-green-800 mb-1">
                          Reserva Confirmada
                        </h4>
                        <p className="text-sm text-green-700">
                          A sua reserva está confirmada! Apresente-se no local
                          15 minutos antes do início da experiência.
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
                        Política de Cancelamento
                      </h4>
                      <p className="text-sm text-blue-700">
                        Cancelamento gratuito até 24 horas antes do início do
                        tour. Cancelamentos tardios podem incorrer em taxas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Acções
              </h3>

              <div className="flex flex-wrap gap-3">
                <Link href={`/customer/tours/${booking.tourId}`}>
                  <Button variant="default">Ver Detalhes do Tour</Button>
                </Link>

                <Button onClick={handleContactHost} variant="default">
                  Contactar Anfitrião
                </Button>

                {canCancel && (
                  <Button
                    onClick={() => setShowCancelModal(true)}
                    variant="danger"
                  >
                    Cancelar Reserva
                  </Button>
                )}

                {booking.status === "completed" && (
                  <Button variant="default">Deixar Avaliação</Button>
                )}

                {(booking.status === "cancelled" ||
                  booking.status === "completed") && (
                  <Link href={`/customer/tours/${booking.tourId}`}>
                    <Button>Reservar Novamente</Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Section */}
            <PaymentSection booking={booking} onPaymentClick={handlePayment} />

            {/* Host Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Anfitrião da Experiência
              </h3>

              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={mockHostInfo.avatar}
                  alt={mockHostInfo.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/default-avatar.jpg";
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">
                      {mockHostInfo.name}
                    </h4>
                    {mockHostInfo.verified && (
                      <Badge
                        variant="default"
                        size="sm"
                        className="text-blue-600 border-blue-200"
                      >
                        ✓ Verificado
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Responde normalmente em {mockHostInfo.responseTime}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-2">📧</span>
                  {mockHostInfo.email}
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📞</span>
                  {mockHostInfo.phone}
                </div>
              </div>

              <Button
                onClick={handleContactHost}
                variant="default"
                className="w-full mt-4"
              >
                Enviar Mensagem
              </Button>
            </Card>

            {/* Quick Links */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Links Úteis
              </h3>

              <div className="space-y-2">
                <Link
                  href="/customer/bookings"
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  ← Ver todas as reservas
                </Link>
                <Link
                  href="/customer/tours"
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  Explorar mais tours
                </Link>
                <Link
                  href="/help"
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  Centro de Ajuda
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Cancellation Modal */}
        <CancellationModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          booking={booking}
          onConfirmCancel={handleCancelBooking}
        />
      </div>
    </div>
  );
}
