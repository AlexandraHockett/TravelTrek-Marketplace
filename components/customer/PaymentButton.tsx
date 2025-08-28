"use client";

import React, { useState } from "react";
import { Booking } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface PaymentButtonProps {
  booking: Booking;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  booking,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
          successUrl: `${window.location.origin}/customer/bookings/${booking.id}?payment=success`,
          cancelUrl: `${window.location.origin}/customer/bookings/${booking.id}?payment=cancelled`,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar sessão de pagamento");
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("URL de pagamento não recebida");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido no pagamento";
      console.error("Payment error:", error);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (booking.paymentStatus === "paid") {
    return (
      <div className="flex items-center text-success">
        <svg
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        Pagamento Concluído
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Total a pagar:</span>
          <span className="text-xl font-bold text-primary">
            {formatCurrency(booking.totalAmount)}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Pagamento seguro processado pelo Stripe
        </p>
      </div>

      <Button
        onClick={handlePayment}
        loading={loading}
        size="lg"
        className="w-full"
        leftIcon={
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        }
      >
        {loading ? "A redirecionar..." : "Pagar com Stripe"}
      </Button>

      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center">
          <svg
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          SSL Seguro
        </div>
        <span>•</span>
        <span>256-bit encryption</span>
        <span>•</span>
        <span>Powered by Stripe</span>
      </div>
    </div>
  );
};

export default PaymentButton;
