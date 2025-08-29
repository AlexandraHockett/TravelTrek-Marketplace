// File: components/customer/PaymentButton.tsx
// Location: Create this file in the components/customer/ directory

"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { PaymentButtonProps, PaymentData } from "@/types";

const PaymentButton: React.FC<PaymentButtonProps> = ({
  bookingId,
  amount,
  currency = "EUR",
  variant = "default",
  size = "md",
  disabled = false,
  onPaymentSuccess,
  onPaymentError,
  className = "",
  children,
  tourTitle,
  tourId,
  participants,
  date,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Prepare payment data
      const paymentData: PaymentData = {
        amount: Math.round(amount * 100), // Convert to cents for Stripe
        currency: currency.toLowerCase(),
        successUrl: `${window.location.origin}/customer/bookings/${bookingId || "success"}?payment=success`,
        cancelUrl: `${window.location.origin}/customer/bookings/${bookingId || "cancelled"}?payment=cancelled`,
      };

      // Add optional fields
      if (bookingId) paymentData.bookingId = bookingId;
      if (tourId) paymentData.tourId = tourId;
      if (participants) paymentData.participants = participants;
      if (date) paymentData.date = date;

      // Call Stripe checkout API
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao processar pagamento");
      }

      const { url, sessionId } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else if (sessionId) {
        // Alternative: handle with Stripe JS SDK
        handleStripeRedirect(sessionId);
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      const errorMessage =
        error.message || "Erro ao processar pagamento. Tenta novamente.";

      setError(errorMessage);

      if (onPaymentError) {
        onPaymentError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripeRedirect = async (sessionId: string) => {
    try {
      // In a real app, you would import Stripe here
      // import { loadStripe } from '@stripe/stripe-js';
      // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      // await stripe?.redirectToCheckout({ sessionId });

      // For now, just simulate the redirect
      window.location.href = `/customer/bookings/${bookingId}?session_id=${sessionId}`;
    } catch (error) {
      console.error("Stripe redirect error:", error);
      setError("Erro ao redirecionar para o pagamento");
    }
  };

  // Handle successful payment (called from URL params)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("payment");
    const sessionId = urlParams.get("session_id");

    if (paymentStatus === "success" && sessionId) {
      if (onPaymentSuccess) {
        onPaymentSuccess({ sessionId, bookingId });
      }
    }
  }, [bookingId, onPaymentSuccess]);

  const getButtonVariant = () => {
    if (error) return "error";
    return variant === "success" ? "default" : variant;
  };

  const getButtonText = () => {
    if (isLoading) {
      return (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          A processar...
        </span>
      );
    }

    if (error) {
      return "Tentar Novamente";
    }

    if (children) {
      return children;
    }

    return `Pagar ${formatCurrency(amount)}`;
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handlePayment}
        variant={getButtonVariant() as any}
        size={size}
        disabled={disabled || isLoading}
        className={`relative ${
          variant === "success" ? "bg-green-600 hover:bg-green-700" : ""
        } ${className}`}
      >
        {getButtonText()}
      </Button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start">
            <span className="text-red-600 text-sm mr-2">⚠️</span>
            <div className="flex-1">
              <p className="text-red-800 text-sm font-medium">
                Erro no Pagamento
              </p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Security Info */}
      <div className="flex items-center justify-center text-xs text-gray-500 mt-3">
        <span className="mr-1">🔒</span>
        <span>Pagamento seguro processado via Stripe</span>
      </div>
    </div>
  );
};

// Specialized variants for common use cases

interface QuickPaymentProps
  extends Omit<PaymentButtonProps, "variant" | "children"> {
  label?: string;
}

export const QuickPayment: React.FC<QuickPaymentProps> = ({
  label = "Pagar Agora",
  ...props
}) => (
  <PaymentButton {...props} variant="primary" size="lg">
    <span className="flex items-center">
      <span className="mr-2">💳</span>
      {label}
    </span>
  </PaymentButton>
);

interface CompleteBookingPaymentProps
  extends Omit<PaymentButtonProps, "variant" | "children"> {
  tourTitle: string;
}

export const CompleteBookingPayment: React.FC<CompleteBookingPaymentProps> = ({
  tourTitle,
  ...props
}) => (
  <PaymentButton {...props} variant="success" size="lg">
    <span className="flex items-center">
      <span className="mr-2">✅</span>
      Confirmar e Pagar
    </span>
  </PaymentButton>
);

interface InstantBookingPaymentProps
  extends Omit<PaymentButtonProps, "variant" | "children"> {
  showAmount?: boolean;
}

export const InstantBookingPayment: React.FC<InstantBookingPaymentProps> = ({
  amount,
  showAmount = true,
  ...props
}) => (
  <PaymentButton {...props} amount={amount} variant="primary" size="lg">
    <span className="flex items-center">
      <span className="mr-2">⚡</span>
      Reserva Instantânea
      {showAmount && ` - ${formatCurrency(amount)}`}
    </span>
  </PaymentButton>
);

export default PaymentButton;
