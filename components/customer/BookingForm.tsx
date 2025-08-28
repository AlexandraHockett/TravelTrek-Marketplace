// File: components/customer/BookingForm.tsx
// Location: Replace the current BookingForm.tsx with this FINAL corrected version
"use client";

import React, { useState } from "react";
import { Tour } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface BookingFormProps {
  tour: Tour;
}

// Separate interfaces for form state and API payload
interface BookingFormData {
  date: string;
  participants: number;
  specialRequests: string;
}

interface BookingFormErrors {
  date?: string;
  participants?: string;
  specialRequests?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ tour }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    date: "",
    participants: 1,
    specialRequests: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<BookingFormErrors>({});

  const totalAmount = formData.participants * tour.price;
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1); // Tomorrow
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // 3 months ahead

  const validateForm = (): boolean => {
    const newErrors: BookingFormErrors = {};

    if (!formData.date) {
      newErrors.date = "Selecciona uma data";
    } else {
      const selectedDate = new Date(formData.date);
      if (selectedDate < minDate) {
        newErrors.date = "A data deve ser pelo menos amanhã";
      }
    }

    if (formData.participants < 1) {
      newErrors.participants = "Número mínimo de 1 participante";
    } else if (formData.participants > tour.maxParticipants) {
      newErrors.participants = `Máximo de ${tour.maxParticipants} participantes`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourId: tour.id,
          date: formData.date,
          participants: formData.participants,
          specialRequests: formData.specialRequests,
          totalAmount,
        }),
      });

      if (response.ok) {
        const booking = await response.json();
        // Redirect to payment or booking confirmation
        window.location.href = `/customer/bookings/${booking.id}`;
      } else {
        throw new Error("Erro ao criar reserva");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Erro ao criar reserva. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (updates: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));

    // Clear related errors
    const updatedErrors = { ...errors };
    Object.keys(updates).forEach((key) => {
      delete updatedErrors[key as keyof BookingFormErrors];
    });
    setErrors(updatedErrors);
  };

  const handleDateChange = (date: string) => {
    updateFormData({ date });
  };

  const handleParticipantsChange = (participants: number) => {
    const clampedValue = Math.max(
      1,
      Math.min(tour.maxParticipants, participants)
    );
    updateFormData({ participants: clampedValue });
  };

  const handleSpecialRequestsChange = (specialRequests: string) => {
    updateFormData({ specialRequests });
  };

  return (
    <Card className="sticky top-24">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Reservar Experiência
          </h3>

          {/* Price Display */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(tour.price)}
              </span>
              <span className="text-gray-600">por pessoa</span>
            </div>
            {tour.originalPrice && (
              <p className="text-sm text-gray-500 mt-1">
                Preço original:{" "}
                <span className="line-through">
                  {formatCurrency(tour.originalPrice)}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Data da Experiência *
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            min={minDate.toISOString().split("T")[0]}
            max={maxDate.toISOString().split("T")[0]}
            onChange={(e) => handleDateChange(e.target.value)}
            className={`w-full ${errors.date ? "border-error focus:ring-error" : ""}`}
          />
          {errors.date && (
            <p className="text-sm text-error mt-1">{errors.date}</p>
          )}
        </div>

        {/* Participants */}
        <div>
          <label
            htmlFor="participants"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Número de Participantes *
          </label>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() =>
                handleParticipantsChange(formData.participants - 1)
              }
              className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={formData.participants <= 1}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>

            <input
              type="number"
              id="participants"
              value={formData.participants}
              min="1"
              max={tour.maxParticipants}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value)) {
                  handleParticipantsChange(value);
                }
              }}
              className={`flex-1 text-center ${errors.participants ? "border-error focus:ring-error" : ""}`}
            />

            <button
              type="button"
              onClick={() =>
                handleParticipantsChange(formData.participants + 1)
              }
              className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={formData.participants >= tour.maxParticipants}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          {errors.participants && (
            <p className="text-sm text-error mt-1">{errors.participants}</p>
          )}

          <p className="text-sm text-gray-500 mt-1">
            Máximo: {tour.maxParticipants} participantes
          </p>
        </div>

        {/* Special Requests */}
        <div>
          <label
            htmlFor="specialRequests"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Pedidos Especiais (Opcional)
          </label>
          <textarea
            id="specialRequests"
            value={formData.specialRequests}
            onChange={(e) => handleSpecialRequestsChange(e.target.value)}
            placeholder="Requisitos dietéticos, acessibilidade, etc."
            rows={3}
            className="w-full"
          />
        </div>

        {/* Total Calculation */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">
              {formatCurrency(tour.price)} × {formData.participants}{" "}
              participante{formData.participants !== 1 ? "s" : ""}
            </span>
            <span className="font-medium">{formatCurrency(totalAmount)}</span>
          </div>

          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Age Requirement */}
        {tour.minimumAge && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Idade mínima:</strong> {tour.minimumAge} anos
            </p>
          </div>
        )}

        {/* Cancellation Policy */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Política de cancelamento:</strong> {tour.cancellationPolicy}
          </p>
        </div>

        {/* Submit Button */}
        <Button type="submit" loading={loading} className="w-full" size="lg">
          {loading ? "A processar..." : "Reservar Agora"}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Não será cobrado nenhum valor até confirmar a reserva
        </p>
      </form>
    </Card>
  );
};

export default BookingForm;
