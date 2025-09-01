// File: components/customer/PaymentButton.tsx
// Location: REPLACE the existing components/customer/PaymentButton.tsx

"use client";

import { useState } from "react";
import { CreditCard, Loader2, Shield, Lock } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";

interface PaymentButtonProps {
  bookingId?: string;
  tourId?: string;
  amount: number;
  currency?: string;
  participants?: number;
  date?: string;
  tourTitle?: string;
  locale: string;
  variant?: "default" | "primary" | "success";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function PaymentButton({
  bookingId,
  tourId,
  amount,
  currency = "EUR",
  participants = 1,
  date,
  tourTitle,
  locale,
  variant = "primary",
  size = "md",
  disabled = false,
  onPaymentSuccess,
  onPaymentError,
  className = "",
  children,
}: PaymentButtonProps) {
  const t = useTranslations(locale);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "default":
        return "bg-gray-600 hover:bg-gray-700 text-white";
      case "primary":
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };

  // Size styles
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-2 text-sm";
      case "lg":
        return "px-8 py-4 text-lg";
      case "md":
      default:
        return "px-6 py-3 text-base";
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare payment data
      const paymentData = {
        bookingId,
        tourId,
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        participants,
        date,
        tourTitle,
        // Generate success/cancel URLs
        successUrl: `${window.location.origin}/${locale}/customer/bookings?payment=success${
          bookingId ? `&booking=${bookingId}` : ""
        }`,
        cancelUrl: `${window.location.origin}/${locale}/customer/bookings?payment=cancelled${
          bookingId ? `&booking=${bookingId}` : ""
        }`,
      };

      // Call Stripe checkout API
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || t("payment.paymentFailed"));
      }

      const { sessionId, url } = await response.json();

      // Success callback before redirect
      if (onPaymentSuccess) {
        onPaymentSuccess({ sessionId, url, bookingId, amount, currency });
      }

      // Redirect to Stripe checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("payment.paymentFailed");

      setError(errorMessage);

      if (onPaymentError) {
        onPaymentError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={disabled || loading}
        className={`
          relative inline-flex items-center justify-center
          rounded-lg font-medium transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${getVariantStyles()}
          ${getSizeStyles()}
          ${className}
        `}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            {t("payment.processingPayment")}
          </>
        ) : (
          <>
            {children || (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                {t("payment.payWithStripe")} {formatCurrency(amount, currency)}
              </>
            )}
          </>
        )}
      </button>

      {/* Security Badge */}
      {!children && (
        <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
          <Lock className="w-3 h-3 mr-1" />
          {t("payment.securePayment")}
          <Shield className="w-3 h-3 ml-1" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}

// Quick Payment Component (for booking confirmations)
export function QuickPayment({
  bookingId,
  amount,
  currency = "EUR",
  locale,
  onSuccess,
  onError,
}: {
  bookingId: string;
  amount: number;
  currency?: string;
  locale: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) {
  const t = useTranslations(locale);

  return (
    <PaymentButton
      bookingId={bookingId}
      amount={amount}
      currency={currency}
      locale={locale}
      variant="success"
      size="lg"
      onPaymentSuccess={onSuccess}
      onPaymentError={onError}
      className="w-full"
    >
      <CreditCard className="w-5 h-5 mr-3" />
      {t("common.payNow")} - {formatCurrency(amount, currency)}
    </PaymentButton>
  );
}

// Complete Booking Payment (for checkout process)
export function CompleteBookingPayment({
  tourTitle,
  tourId,
  bookingId,
  amount,
  currency = "EUR",
  participants,
  date,
  locale,
  onSuccess,
  onError,
}: {
  tourTitle: string;
  tourId: string;
  bookingId?: string;
  amount: number;
  currency?: string;
  participants: number;
  date: string;
  locale: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) {
  const t = useTranslations(locale);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {t("payment.securePayment")}
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <Shield className="w-4 h-4 mr-1" />
          Stripe
        </div>
      </div>

      <div className="space-y-2 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">{tourTitle}</span>
          <span className="font-medium">
            {formatCurrency(amount, currency)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">
            {participants}{" "}
            {participants === 1 ? t("common.person") : t("common.persons")}
          </span>
          <span className="text-gray-600">{date}</span>
        </div>
      </div>

      <PaymentButton
        bookingId={bookingId}
        tourId={tourId}
        amount={amount}
        currency={currency}
        participants={participants}
        date={date}
        tourTitle={tourTitle}
        locale={locale}
        variant="primary"
        size="lg"
        onPaymentSuccess={onSuccess}
        onPaymentError={onError}
        className="w-full"
      />
    </div>
  );
}

// Instant Booking Payment (for direct bookings)
export function InstantBookingPayment({
  tourId,
  tourTitle,
  amount,
  currency = "EUR",
  participants,
  date,
  locale,
  onSuccess,
  onError,
}: {
  tourId: string;
  tourTitle: string;
  amount: number;
  currency?: string;
  participants: number;
  date: string;
  locale: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) {
  return (
    <PaymentButton
      tourId={tourId}
      amount={amount}
      currency={currency}
      participants={participants}
      date={date}
      tourTitle={tourTitle}
      locale={locale}
      variant="success"
      size="md"
      onPaymentSuccess={onSuccess}
      onPaymentError={onError}
    >
      <Lock className="w-4 h-4 mr-2" />
      {useTranslations(locale)("common.bookNow")}
    </PaymentButton>
  );
}
