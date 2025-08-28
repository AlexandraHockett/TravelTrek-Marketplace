// components/customer/PaymentButton.tsx
"use client";

import Button from "../shared/Button";

interface PaymentButtonProps {
  bookingId: string;
}

export default function PaymentButton({ bookingId }: PaymentButtonProps) {
  const handlePayment = async () => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({ bookingId }),
    });
    const { url } = await res.json();
    window.location.href = url; // Redirect to Stripe checkout
  };

  return <Button onClick={handlePayment}>Pay with Stripe</Button>;
}
