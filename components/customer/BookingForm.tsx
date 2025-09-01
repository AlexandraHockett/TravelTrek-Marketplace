// File: components/customer/BookingForm.tsx
// Location: REPLACE the existing components/customer/BookingForm.tsx

"use client";

import { useState } from "react";
import { Calendar, Users, Clock, AlertCircle } from "lucide-react";
import { Tour, Booking } from "@/types";
import { useTranslations } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";

interface BookingFormProps {
  tour: Tour;
  locale: string;
  onSuccess?: (booking: Booking) => void;
  onError?: (error: string) => void;
  className?: string;
}

export default function BookingForm({
  tour,
  locale,
  onSuccess,
  onError,
  className = "",
}: BookingFormProps) {
  const t = useTranslations(locale);

  // Form state
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [participants, setParticipants] = useState<number>(1);
  const [specialRequests, setSpecialRequests] = useState<string>("");
  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);

  // Price calculations
  const basePrice = tour.price * participants;
  const serviceFees = Math.round(basePrice * 0.15); // 15% service fees
  const totalAmount = basePrice + serviceFees;

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedDate) {
      newErrors.date = t("bookingForm.errors.dateRequired");
    }

    if (participants < 1 || participants > tour.maxParticipants) {
      newErrors.participants = t("bookingForm.errors.participantsRequired");
    }

    if (!contactInfo.fullName.trim()) {
      newErrors.fullName = t("bookingForm.errors.nameRequired");
    }

    if (!contactInfo.email.trim()) {
      newErrors.email = t("bookingForm.errors.emailRequired");
    }

    if (!contactInfo.phone.trim()) {
      newErrors.phone = t("bookingForm.errors.phoneRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit booking to API
  const handleBooking = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const bookingData = {
        tourId: tour.id,
        date: selectedDate,
        participants,
        specialRequests: specialRequests.trim(),
        customerName: contactInfo.fullName.trim(),
        customerEmail: contactInfo.email.trim(),
        customerPhone: contactInfo.phone.trim(),
        totalAmount,
        currency: tour.currency || "EUR",
      };

      // Call the bookings API
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || t("bookingForm.errors.serverError"));
      }

      const booking = await response.json();

      // Success callback
      if (onSuccess) {
        onSuccess(booking);
      }

      // Reset form
      setSelectedDate("");
      setParticipants(1);
      setSpecialRequests("");
      setContactInfo({ fullName: "", email: "", phone: "" });
      setShowForm(false);

      // Show success message or redirect
      alert(t("tourDetails.bookingSuccess"));
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("bookingForm.errors.networkError");

      setErrors({ general: errorMessage });

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  if (!showForm) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(tour.price, tour.currency)}
              <span className="text-base font-normal text-gray-600 ml-1">
                / {t("common.person")}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {tour.reviewsCount > 0 && (
                <>
                  ★ {tour.rating} ({tour.reviewsCount} {t("tours.reviewsCount")}
                  )
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {t("tourDetails.bookThisTour")}
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="space-y-6">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            {t("bookingForm.selectDate")}
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={getMinDate()}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        {/* Participants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            {t("bookingForm.participants")}
          </label>
          <select
            value={participants}
            onChange={(e) => setParticipants(Number(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.participants ? "border-red-500" : "border-gray-300"
            }`}
          >
            {Array.from({ length: tour.maxParticipants }, (_, i) => i + 1).map(
              (num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? t("common.person") : t("common.persons")}
                </option>
              )
            )}
          </select>
          {errors.participants && (
            <p className="mt-1 text-sm text-red-600">{errors.participants}</p>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            {t("bookingForm.contactInfo")}
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("bookingForm.fullName")}
            </label>
            <input
              type="text"
              value={contactInfo.fullName}
              onChange={(e) =>
                setContactInfo((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("bookingForm.email")}
            </label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) =>
                setContactInfo((prev) => ({ ...prev, email: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("bookingForm.phone")}
            </label>
            <input
              type="tel"
              value={contactInfo.phone}
              onChange={(e) =>
                setContactInfo((prev) => ({ ...prev, phone: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("bookingForm.specialRequests")}
          </label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder={t("bookingForm.specialRequestsPlaceholder")}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Price Breakdown */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            {t("bookingForm.priceBreakdown")}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                {formatCurrency(tour.price, tour.currency)} × {participants}{" "}
                {participants === 1 ? t("common.person") : t("common.persons")}
              </span>
              <span>{formatCurrency(basePrice, tour.currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t("bookingForm.serviceFees")}</span>
              <span>{formatCurrency(serviceFees, tour.currency)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>{t("bookingForm.total")}</span>
              <span>{formatCurrency(totalAmount, tour.currency)}</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
            <span className="text-sm text-red-800">{errors.general}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => setShowForm(false)}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleBooking}
            disabled={loading || !selectedDate || participants < 1}
            className="flex-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Clock className="w-4 h-4 animate-spin inline mr-2" />
                {t("bookingForm.processing")}
              </>
            ) : (
              t("bookingForm.bookButton")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
