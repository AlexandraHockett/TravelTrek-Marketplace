// File: components/customer/BookingForm.tsx
// Location: Create this file in the components/customer/ directory

"use client";

import React, { useState } from "react";
import { Tour } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface BookingFormProps {
  tour: Tour;
  variant?: "default" | "sidebar" | "modal";
  onBookingComplete?: (bookingData: BookingFormData) => void;
  className?: string;
}

interface BookingFormData {
  tourId: string;
  date: string;
  participants: number;
  specialRequests: string;
  totalAmount: number;
}

interface BookingFormErrors {
  date?: string;
  participants?: string;
  specialRequests?: string;
  general?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  tour,
  variant = "default",
  onBookingComplete,
  className = "",
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    tourId: tour.id,
    date: "",
    participants: 1,
    specialRequests: "",
    totalAmount: tour.price,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Calculate dates
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1); // Tomorrow
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // 3 months ahead

  // Calculate total amount
  const totalAmount = formData.participants * tour.price;

  const validateForm = (): boolean => {
    const newErrors: BookingFormErrors = {};

    // Date validation
    if (!formData.date) {
      newErrors.date = "Por favor selecciona uma data";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.date = "A data deve ser pelo menos amanhã";
      }

      if (selectedDate > maxDate) {
        newErrors.date =
          "Não é possível reservar com mais de 3 meses de antecedência";
      }
    }

    // Participants validation
    if (formData.participants < 1) {
      newErrors.participants = "Número mínimo de 1 participante";
    } else if (formData.participants > tour.maxParticipants) {
      newErrors.participants = `Máximo de ${tour.maxParticipants} participantes`;
    }

    // Special requests validation (optional but with length limit)
    if (formData.specialRequests && formData.specialRequests.length > 500) {
      newErrors.specialRequests =
        "Pedidos especiais não podem exceder 500 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const bookingData = {
        ...formData,
        totalAmount: totalAmount,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real app, this would make an actual API call
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const booking = await response.json();

        // Call callback if provided
        if (onBookingComplete) {
          onBookingComplete(bookingData);
        } else {
          // Default behavior - redirect to booking details
          window.location.href = `/customer/bookings/${booking.id}`;
        }
      } else {
        throw new Error("Erro ao criar reserva");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setErrors({
        general: "Erro ao criar reserva. Por favor tenta novamente.",
      });
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
    if (updatedErrors.general) delete updatedErrors.general;
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

  // Suggested dates (next few available dates)
  const getSuggestedDates = () => {
    const dates = [];
    const currentDate = new Date(minDate);

    for (let i = 0; i < 7; i++) {
      // Skip Mondays (assuming tours don't run on Mondays)
      if (currentDate.getDay() !== 1) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);

      if (dates.length === 3) break;
    }

    return dates;
  };

  const suggestedDates = getSuggestedDates();

  // Sidebar variant for sticky booking form
  if (variant === "sidebar") {
    return (
      <Card className={`sticky top-6 ${className}`}>
        <div className="p-6">
          {/* Price Display */}
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrency(tour.price)}
              </span>
              <span className="text-gray-600">/pessoa</span>
            </div>
            {tour.originalPrice && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(tour.originalPrice)}
                </span>
                <Badge
                  variant="error"
                  size="sm"
                  className="bg-green-100 text-green-800"
                >
                  Poupa {formatCurrency(tour.originalPrice - tour.price)}!
                </Badge>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Experiência *
              </label>

              {/* Suggested Dates */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {suggestedDates.map((date, index) => {
                  const dateStr = date.toISOString().split("T")[0];
                  const isSelected = formData.date === dateStr;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDateChange(dateStr)}
                      className={`p-2 text-xs rounded-lg border transition-colors ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                      }`}
                    >
                      <div className="font-medium">
                        {date.toLocaleDateString("pt-PT", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                      <div className="opacity-75">
                        {date.toLocaleDateString("pt-PT", { weekday: "short" })}
                      </div>
                    </button>
                  );
                })}
              </div>

              <input
                type="date"
                value={formData.date}
                min={minDate.toISOString().split("T")[0]}
                max={maxDate.toISOString().split("T")[0]}
                onChange={(e) => handleDateChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.date && (
                <p className="text-red-600 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* Participants */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participantes *
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() =>
                    handleParticipantsChange(formData.participants - 1)
                  }
                  disabled={formData.participants <= 1}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500"
                >
                  −
                </button>
                <span className="text-lg font-medium w-8 text-center">
                  {formData.participants}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleParticipantsChange(formData.participants + 1)
                  }
                  disabled={formData.participants >= tour.maxParticipants}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Máximo: {tour.maxParticipants} pessoas
              </p>
              {errors.participants && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.participants}
                </p>
              )}
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pedidos Especiais (Opcional)
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => handleSpecialRequestsChange(e.target.value)}
                rows={3}
                maxLength={500}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.specialRequests ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Alergias, necessidades especiais, etc."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.specialRequests ? (
                  <p className="text-red-600 text-sm">
                    {errors.specialRequests}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-gray-500">
                  {formData.specialRequests.length}/500
                </span>
              </div>
            </div>

            {/* Total */}
            {formData.participants > 1 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-700">
                    {formatCurrency(tour.price)} × {formData.participants}
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>Taxas incluídas</span>
                  <span>Cancelamento gratuito</span>
                </div>
              </div>
            )}

            {/* Error Messages */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
              ) : (
                `Reservar${formData.participants > 1 ? ` (${formatCurrency(totalAmount)})` : ""}`
              )}
            </Button>

            <p className="text-xs text-gray-600 text-center">
              Não será cobrado nada ainda. Confirma os detalhes antes do
              pagamento.
            </p>
          </form>
        </div>
      </Card>
    );
  }

  // Default variant - full form
  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Reservar Experiência
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Price Display */}
        <div className="bg-gray-50 p-4 rounded-lg">
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

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data da Experiência *
          </label>
          <input
            type="date"
            value={formData.date}
            min={minDate.toISOString().split("T")[0]}
            max={maxDate.toISOString().split("T")[0]}
            onChange={(e) => handleDateChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.date ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.date && (
            <p className="text-red-600 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        {/* Participants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Participantes *
          </label>
          <select
            value={formData.participants}
            onChange={(e) => handleParticipantsChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: tour.maxParticipants }, (_, i) => i + 1).map(
              (num) => (
                <option key={num} value={num}>
                  {num} pessoa{num > 1 ? "s" : ""}
                </option>
              )
            )}
          </select>
          {errors.participants && (
            <p className="text-red-600 text-sm mt-1">{errors.participants}</p>
          )}
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pedidos Especiais (Opcional)
          </label>
          <textarea
            value={formData.specialRequests}
            onChange={(e) => handleSpecialRequestsChange(e.target.value)}
            rows={4}
            maxLength={500}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.specialRequests ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Alergias, necessidades especiais, pedidos específicos, etc."
          />
          <div className="flex justify-between items-center mt-1">
            {errors.specialRequests && (
              <p className="text-red-600 text-sm">{errors.specialRequests}</p>
            )}
            <span className="text-xs text-gray-500 ml-auto">
              {formData.specialRequests.length}/500
            </span>
          </div>
        </div>

        {/* Total Calculation */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">
                {formatCurrency(tour.price)} × {formData.participants} pessoa
                {formData.participants > 1 ? "s" : ""}
              </span>
              <span className="text-gray-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Taxas de serviço</span>
              <span className="text-gray-600">Incluídas</span>
            </div>
            <div className="border-t pt-2 flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-semibold text-xl text-gray-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "A processar..." : "Continuar para Pagamento"}
        </Button>

        <p className="text-xs text-gray-600 text-center">
          Ao continuar, concordas com os nossos{" "}
          <a href="/terms" className="text-blue-600 hover:underline">
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Política de Privacidade
          </a>
        </p>
      </form>
    </Card>
  );
};

export default BookingForm;
