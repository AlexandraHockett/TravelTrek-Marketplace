// File: lib/hooks/useApi.ts (corrected)
// Changes: Updated Translations type assumption; errors indicate loose typing. Added optional chaining and defaults in errorMappings to avoid type errors on 'object'.

"use client";

import { useState, useEffect, useCallback } from "react";
import { Tour, Booking, Translations } from "@/types";

// Generic API hook for any endpoint
export function useApi<T>(url: string | null, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for fetching tours
export function useTours(
  filters: {
    location?: string;
    maxPrice?: number;
    difficulty?: string;
    minRating?: number;
    limit?: number;
    offset?: number;
  } = {}
) {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  const url = `/api/tours${queryString ? `?${queryString}` : ""}`;

  return useApi<{ tours: Tour[]; pagination: any }>(url);
}

// Hook for fetching a single tour
export function useTour(id: string | null) {
  const url = id ? `/api/tours/${id}` : null;
  return useApi<{ tour: Tour }>(url);
}

// Hook for fetching bookings
export function useBookings(
  filters: {
    customerId?: string;
    hostId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  const url = `/api/bookings${queryString ? `?${queryString}` : ""}`;

  return useApi<{ bookings: Booking[]; pagination: any }>(url);
}

// Hook for fetching a single booking
export function useBooking(id: string | null) {
  const url = id ? `/api/bookings/${id}` : null;
  return useApi<{ booking: Booking }>(url);
}

// Hook for creating bookings
export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = useCallback(
    async (bookingData: {
      tourId: string;
      customerId: string;
      customerName: string;
      customerEmail: string;
      date: string;
      time?: string;
      participants: number;
      specialRequests?: string;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to create booking");
        }

        const result = await response.json();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createBooking, loading, error };
}

// Hook for updating bookings
export function useUpdateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBooking = useCallback(
    async (id: string, updates: Partial<Booking>) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/bookings/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to update booking");
        }

        const result = await response.json();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateBooking, loading, error };
}

// Hook for cancelling bookings
export function useCancelBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelBooking = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to cancel booking");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { cancelBooking, loading, error };
}

// Hook for creating Stripe payment sessions
export function useCreatePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentSession = useCallback(
    async (paymentData: {
      bookingId?: string;
      tourId?: string;
      amount: number;
      currency?: string;
      participants?: number;
      date?: string;
      successUrl?: string;
      cancelUrl?: string;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || "Failed to create payment session"
          );
        }

        const result = await response.json();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createPaymentSession, loading, error };
}

// Hook for handling payment flow
export function usePayment() {
  const { createPaymentSession, loading, error } = useCreatePayment();

  const processPayment = useCallback(
    async (paymentData: {
      bookingId?: string;
      tourId?: string;
      amount: number;
      currency?: string;
      participants?: number;
      date?: string;
    }) => {
      try {
        const session = await createPaymentSession({
          ...paymentData,
          successUrl: `${window.location.origin}/customer/bookings?payment=success`,
          cancelUrl: `${window.location.origin}/customer/bookings?payment=cancelled`,
        });

        if (session.url) {
          // Redirect to Stripe Checkout
          window.location.href = session.url;
        } else {
          throw new Error("No payment URL received");
        }
      } catch (err) {
        throw err;
      }
    },
    [createPaymentSession]
  );

  return { processPayment, loading, error };
}

// Hook for API mutations with optimistic updates
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
  }
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (variables: TVariables) => {
      try {
        setLoading(true);
        setError(null);

        const data = await mutationFn(variables);

        options?.onSuccess?.(data, variables);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        options?.onError?.(error, variables);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn, options]
  );

  return { mutate, loading, error };
}

// Hook for error handling with translations
export function useApiError(translations: Translations) {
  const getErrorMessage = useCallback(
    (error: string | Error) => {
      const errorString = error instanceof Error ? error.message : error;

      // Map API errors to translated messages
      const errorMappings: Record<string, string> = {
        "Tour not found":
          translations.api?.errors?.tourNotFound ?? "Tour not found",
        "Booking not found":
          translations.api?.errors?.bookingNotFound ?? "Booking not found",
        "Invalid data": translations.api?.errors?.invalidData ?? "Invalid data",
        "Maximum participants exceeded":
          translations.api?.errors?.maxParticipantsExceeded ??
          "Maximum participants exceeded",
        "Booking cannot be cancelled":
          translations.api?.errors?.bookingNotCancellable ??
          "Booking cannot be cancelled",
        "Payment failed":
          translations.api?.errors?.paymentFailed ?? "Payment failed",
        "Server error": translations.api?.errors?.serverError ?? "Server error",
        Unauthorised: translations.api?.errors?.unauthorised ?? "Unauthorised",
        "Validation failed":
          translations.api?.errors?.validationFailed ?? "Validation failed",
      };

      return errorMappings[errorString] || errorString;
    },
    [translations]
  );

  return { getErrorMessage };
}
