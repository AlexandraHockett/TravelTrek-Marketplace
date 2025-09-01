// File: components/customer/TourCard.tsx (corrected)
// Changes:
// - Added null check for bookingError in getErrorMessage call.
// - Assumed Translations type includes optional chaining; errors indicate Translations is loosely typed as object, but fixes rely on updating types/index.ts (see below).

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tour, Translations } from "@/types";
import { useCreateBooking, usePayment, useApiError } from "@/lib/hooks/useApi";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface TourCardProps {
  tour: Tour;
  locale: string;
  translations: Translations;
  compact?: boolean;
  showBookingForm?: boolean;
  customerId?: string;
  className?: string;
}

const TourCard: React.FC<TourCardProps> = ({
  tour,
  locale,
  translations,
  compact = false,
  showBookingForm = false,
  customerId,
  className = "",
}) => {
  const [participants, setParticipants] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Added for better error handling

  // API hooks
  const {
    createBooking,
    loading: bookingLoading,
    error: bookingError,
  } = useCreateBooking();
  const { processPayment, loading: paymentLoading } = usePayment();
  const { getErrorMessage } = useApiError(translations);

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Get max date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split("T")[0];

  // Calculate total price
  const baseTotal = tour.price * participants;
  const serviceFees = Math.round(baseTotal * 0.1); // 10% service fee
  const totalAmount = baseTotal + serviceFees;

  // Get difficulty badge color
  const getDifficultyColor = (
    difficulty: string
  ): "success" | "warning" | "error" | "default" => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "success";
      case "moderate":
        return "warning";
      case "challenging":
        return "error";
      default:
        return "default";
    }
  };

  // Handle booking submission
  const handleBooking = async () => {
    setErrorMessage(null); // Clear previous errors

    if (!customerId) {
      setErrorMessage(
        translations.auth?.pleaseLogin || "Please log in to make a booking"
      );
      return;
    }

    if (!selectedDate) {
      setErrorMessage(
        translations.bookingForm?.requiredDate || "Date is required"
      );
      return;
    }

    if (participants < 1 || participants > tour.maxParticipants) {
      setErrorMessage(
        translations.bookingForm?.invalidParticipants ||
          "Invalid number of participants"
      );
      return;
    }

    try {
      // TODO: Replace hardcoded customerName and customerEmail with actual user profile data
      const bookingData = {
        tourId: tour.id,
        customerId,
        customerName: "Customer Name", // Should come from user profile
        customerEmail: "customer@example.com", // Should come from user profile
        date: selectedDate,
        time: "09:00", // Default time, could be dynamic
        participants,
        specialRequests: specialRequests || undefined,
      };

      // Create booking
      const result = await createBooking(bookingData);
      console.log("Booking created:", result);

      // Process payment
      await processPayment({
        bookingId: result.booking.id,
        tourId: tour.id,
        amount: totalAmount * 100, // Convert to cents for Stripe
        currency: tour.currency.toLowerCase(),
        participants,
        date: selectedDate,
      });

      // Optionally, show success message or redirect
      setShowForm(false); // Close form on success
    } catch (error) {
      console.error("Booking error:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Booking failed";
      setErrorMessage(
        errorMsg.includes("booking")
          ? translations.bookingForm?.bookingError || "Failed to create booking"
          : translations.bookingForm?.paymentError ||
              "Payment processing failed"
      );
    }
  };

  const loading = bookingLoading || paymentLoading;

  if (compact) {
    return (
      <Card
        className={`hover:shadow-lg transition-shadow duration-300 ${className}`}
      >
        <Link href={`/${locale}/customer/tours/${tour.id}`}>
          <div className="relative h-48 mb-3">
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {tour.originalPrice && tour.originalPrice > tour.price && (
              <div className="absolute top-2 left-2">
                <Badge variant="error" size="sm">
                  -
                  {Math.round(
                    ((tour.originalPrice - tour.price) / tour.originalPrice) *
                      100
                  )}
                  %
                </Badge>
              </div>
            )}
          </div>
        </Link>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={getDifficultyColor(tour.difficulty)} size="sm">
              {translations.tourDetails?.difficulty?.[
                tour.difficulty.toLowerCase() as keyof typeof translations.tourDetails.difficulty
              ] || tour.difficulty}
            </Badge>
            <span className="text-sm text-gray-600">
              {tour.duration}{" "}
              {tour.duration === 1
                ? translations.common?.hour
                : translations.common?.hours}
            </span>
          </div>

          <Link href={`/${locale}/customer/tours/${tour.id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
              {tour.title}
            </h3>
          </Link>

          <p className="text-sm text-gray-600 line-clamp-2">
            {tour.shortDescription || tour.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              {tour.originalPrice && tour.originalPrice > tour.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(tour.originalPrice, tour.currency)}
                </span>
              )}
              <span className="font-bold">
                {formatCurrency(tour.price, tour.currency)}
              </span>
              <span className="text-sm text-gray-600">
                {translations.bookingForm?.perPerson}
              </span>
            </div>

            <Link href={`/${locale}/customer/tours/${tour.id}`}>
              <Button size="sm">{translations.tourDetails?.viewDetails}</Button>
            </Link>
          </div>

          {showBookingForm && showForm && (
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {translations.bookingForm?.selectDate}
                </label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                  max={maxDateString}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="participants"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {translations.bookingForm?.participants}
                </label>
                <input
                  type="number"
                  id="participants"
                  value={participants}
                  onChange={(e) => setParticipants(parseInt(e.target.value))}
                  min={1}
                  max={tour.maxParticipants}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  {translations.tourDetails?.maxParticipants}:{" "}
                  {tour.maxParticipants}
                </p>
              </div>

              <div>
                <label
                  htmlFor="special-requests"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {translations.bookingForm?.specialRequests}
                </label>
                <textarea
                  id="special-requests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder={translations.bookingForm?.allergiesPlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  maxLength={500}
                  aria-describedby="special-requests-desc"
                />
                <p id="special-requests-desc" className="sr-only">
                  Optional field for special requests, such as allergies or
                  accommodations
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {tour.price} × {participants}{" "}
                    {participants === 1
                      ? translations.common?.person
                      : translations.common?.persons}
                  </span>
                  <span>{formatCurrency(baseTotal, tour.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{translations.bookingForm?.serviceFees}</span>
                  <span>{formatCurrency(serviceFees, tour.currency)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>{translations.bookingForm?.total}</span>
                  <span>{formatCurrency(totalAmount, tour.currency)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowForm(false)}
                  variant="secondary"
                  size="sm"
                  disabled={loading}
                >
                  {translations.common?.cancel}
                </Button>
                <Button
                  onClick={handleBooking}
                  disabled={
                    loading ||
                    !selectedDate ||
                    participants < 1 ||
                    participants > tour.maxParticipants
                  }
                  size="sm"
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">
                        {translations.bookingForm?.processing}
                      </span>
                    </>
                  ) : (
                    translations.bookingForm?.bookButton
                  )}
                </Button>
              </div>

              {(bookingError || errorMessage) && (
                <div className="text-red-600 text-sm mt-2">
                  {errorMessage ||
                    (bookingError ? getErrorMessage(bookingError) : "")}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Full card layout
  return (
    <Card
      className={`hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <Link href={`/${locale}/customer/tours/${tour.id}`}>
        <div className="relative h-64 mb-4">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {tour.originalPrice && tour.originalPrice > tour.price && (
            <div className="absolute top-3 left-3">
              <Badge variant="error">
                -
                {Math.round(
                  ((tour.originalPrice - tour.price) / tour.originalPrice) * 100
                )}
                %
              </Badge>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant={getDifficultyColor(tour.difficulty)}>
              {translations.tourDetails?.difficulty?.[
                tour.difficulty.toLowerCase() as keyof typeof translations.tourDetails.difficulty
              ] || tour.difficulty}
            </Badge>
          </div>
        </div>
      </Link>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{tour.location}</span>
          <span>
            {tour.duration}{" "}
            {tour.duration === 1
              ? translations.common?.hour
              : translations.common?.hours}
          </span>
        </div>

        <Link href={`/${locale}/customer/tours/${tour.id}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            {tour.title}
          </h3>
        </Link>

        <p className="text-gray-600 line-clamp-3">{tour.description}</p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="font-medium">{tour.rating}</span>
            <span className="text-sm text-gray-600">
              ({tour.reviewCount} {translations.tourDetails?.reviews})
            </span>
          </div>

          <div className="text-sm text-gray-600">
            {translations.tourDetails?.maxParticipants}: {tour.maxParticipants}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-baseline gap-2">
            {tour.originalPrice && tour.originalPrice > tour.price && (
              <span className="text-lg text-gray-500 line-through">
                {formatCurrency(tour.originalPrice, tour.currency)}
              </span>
            )}
            <span className="text-2xl font-bold">
              {formatCurrency(tour.price, tour.currency)}
            </span>
            <span className="text-gray-600">
              {translations.bookingForm?.perPerson}
            </span>
          </div>

          <Link href={`/${locale}/customer/tours/${tour.id}`}>
            <Button>{translations.tourDetails?.bookNow}</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default TourCard;
