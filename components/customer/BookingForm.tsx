"use client";

import { useState } from "react";
import { Tour, BookingFormProps } from "@/types";
import {
  Calendar,
  Users,
  AlertCircle,
  CreditCard,
  Shield,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { useTranslations } from "@/lib/i18n";

interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
}

interface FormErrors {
  general?: string;
  date?: string;
  participants?: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

export default function BookingForm({
  tour,
  onSuccess,
  onError,
  onBookingComplete,
  className = "",
  variant = "default",
}: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [participants, setParticipants] = useState<number>(1);
  const [specialRequests, setSpecialRequests] = useState<string>("");
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showForm, setShowForm] = useState<boolean>(false);

  // Get current locale from URL or default
  const locale =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1] || "en"
      : "en";
  const t = useTranslations(locale);

  // Calculate pricing
  const basePrice = tour.price * participants;
  const serviceFees = Math.round(basePrice * 0.12); // 12% service fee
  const totalAmount = basePrice + serviceFees;

  // Format currency
  const formatCurrency = (amount: number, currency: string = "EUR") => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split("T")[0];
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!selectedDate) {
      newErrors.date = t("bookingForm.requiredDate", "Date is required");
    } else {
      const selectedDateObj = new Date(selectedDate);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (selectedDateObj < tomorrow) {
        newErrors.date = t(
          "bookingForm.minDateTomorrow",
          "Date must be at least tomorrow"
        );
      }
    }

    if (participants < 1) {
      newErrors.participants = t(
        "bookingForm.minParticipants",
        "At least 1 participant required"
      );
    } else if (participants > tour.maxParticipants) {
      newErrors.participants = t(
        "bookingForm.maxParticipants",
        `Maximum ${tour.maxParticipants} participants`
      );
    }

    if (!contactInfo.fullName.trim()) {
      newErrors.fullName = t("common.required", "Full name is required");
    }

    if (!contactInfo.email.trim()) {
      newErrors.email = t("common.required", "Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = t("common.invalidEmail", "Invalid email format");
    }

    if (!contactInfo.phone.trim()) {
      newErrors.phone = t("common.required", "Phone number is required");
    }

    if (specialRequests.length > 500) {
      newErrors.general = t(
        "bookingForm.maxSpecialRequestsLength",
        "Special requests must be under 500 characters"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle booking submission
  const handleBooking = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // ✅ FIXED: Updated API call to match backend format
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourId: tour.id,
          date: selectedDate,
          participants,
          specialRequests: specialRequests.trim() || undefined,
          customerName: contactInfo.fullName.trim(),
          customerEmail: contactInfo.email.trim(),
          customerPhone: contactInfo.phone.trim(),
          totalAmount, // Include total amount
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      // ✅ FIXED: Handle API response format
      if (result.success && result.data) {
        onSuccess?.(result.data);
        onBookingComplete?.(result.data);

        // Show success message
        alert(t("bookingForm.bookingSuccess", "Booking created successfully!"));

        // Reset form
        setSelectedDate("");
        setParticipants(1);
        setSpecialRequests("");
        setContactInfo({ fullName: "", email: "", phone: "" });
        setShowForm(false);
      } else {
        throw new Error(result.error || "Booking creation failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      setErrors({ general: errorMessage });
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
      >
        {t("bookingForm.bookButton", "Book Experience")}
      </button>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          {t("bookingForm.experienceDate", "Experience Date")}
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={getMinDate()}
          max={getMaxDate()}
          className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
          {t("bookingForm.participants", "Participants")}
        </label>
        <select
          value={participants}
          onChange={(e) => setParticipants(Number(e.target.value))}
          className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.participants ? "border-red-500" : "border-gray-300"
          }`}
        >
          {Array.from(
            { length: Math.min(tour.maxParticipants, 10) },
            (_, i) => i + 1
          ).map((num) => (
            <option key={num} value={num}>
              {num}{" "}
              {num === 1
                ? t("common.person", "person")
                : t("common.persons", "people")}
            </option>
          ))}
        </select>
        {errors.participants && (
          <p className="mt-1 text-sm text-red-600">{errors.participants}</p>
        )}
      </div>

      {/* Contact Information */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t("common.contactInfo", "Contact Information")}
        </h3>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              {t("common.fullName", "Full Name")}
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
              placeholder={t(
                "common.fullNamePlaceholder",
                "Enter your full name"
              )}
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              {t("common.email", "Email")}
            </label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) =>
                setContactInfo((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder={t("common.emailPlaceholder", "Enter your email")}
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              {t("common.phone", "Phone")}
            </label>
            <input
              type="tel"
              value={contactInfo.phone}
              onChange={(e) =>
                setContactInfo((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder={t(
                "common.phonePlaceholder",
                "Enter your phone number"
              )}
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("bookingForm.specialRequests", "Special Requests")} (
          {t("common.optional", "optional")})
        </label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder={t(
            "bookingForm.specialRequestsPlaceholder",
            "Any dietary requirements, accessibility needs, or other requests..."
          )}
          rows={3}
          maxLength={500}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500">
          {specialRequests.length}/500 {t("common.characters", "characters")}
        </p>
      </div>

      {/* Price Breakdown */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t("bookingForm.priceBreakdown", "Price Breakdown")}
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>
              {formatCurrency(tour.price, tour.currency)} × {participants}{" "}
              {participants === 1
                ? t("common.person", "person")
                : t("common.persons", "people")}
            </span>
            <span>{formatCurrency(basePrice, tour.currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t("bookingForm.serviceFees", "Service fees")}</span>
            <span>{formatCurrency(serviceFees, tour.currency)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-3">
            <span>{t("bookingForm.total", "Total")}</span>
            <span>{formatCurrency(totalAmount, tour.currency)}</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
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
          {t("common.cancel", "Cancel")}
        </button>
        <button
          onClick={handleBooking}
          disabled={loading || !selectedDate || participants < 1}
          className="flex-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {t("bookingForm.processing", "Processing...")}
            </span>
          ) : (
            t("bookingForm.continueToPayment", "Continue to Payment")
          )}
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center space-x-6 pt-4 text-xs text-gray-500">
        <div className="flex items-center">
          <Shield className="w-4 h-4 mr-1" />
          {t("bookingForm.instantConfirmation", "Instant confirmation")}
        </div>
        <div className="flex items-center">
          <CreditCard className="w-4 h-4 mr-1" />
          {t("bookingForm.freeCancellation", "Free cancellation")}
        </div>
      </div>
    </div>
  );
}
