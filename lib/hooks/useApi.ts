// File: lib/hooks/useApi.ts
// Location: CREATE this file in lib/hooks/useApi.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { Tour, Booking } from "@/types";

// Generic API hook for fetching data
export function useApi<T>(endpoint: string, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(endpoint);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(`API Error (${endpoint}):`, err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for fetching tours with filters
export function useTours(filters?: {
  search?: string;
  location?: string;
  categories?: string[];
  minRating?: number;
  priceRange?: [number, number];
  sortBy?: string;
}) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (filters?.search) params.append("search", filters.search);
      if (filters?.location) params.append("location", filters.location);
      if (filters?.categories?.length) {
        params.append("categories", filters.categories.join(","));
      }
      if (filters?.minRating)
        params.append("minRating", filters.minRating.toString());
      if (filters?.priceRange) {
        params.append("minPrice", filters.priceRange[0].toString());
        params.append("maxPrice", filters.priceRange[1].toString());
      }
      if (filters?.sortBy) params.append("sortBy", filters.sortBy);

      const response = await fetch(`/api/tours?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch tours");
      }

      const data = await response.json();
      setTours(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tours:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch tours");
      setTours([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  return { tours, loading, error, refetch: fetchTours };
}

// Hook for fetching a single tour
export function useTour(tourId: string) {
  return useApi<Tour>(`/api/tours/${tourId}`, [tourId]);
}

// Hook for fetching bookings
export function useBookings(filters?: {
  customerId?: string;
  hostId?: string;
  status?: string;
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (filters?.customerId) params.append("customerId", filters.customerId);
      if (filters?.hostId) params.append("hostId", filters.hostId);
      if (filters?.status) params.append("status", filters.status);

      const response = await fetch(`/api/bookings?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings, setBookings };
}

// Hook for creating bookings
export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = useCallback(
    async (bookingData: {
      tourId: string;
      date: string;
      participants: number;
      specialRequests?: string;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      totalAmount: number;
      currency: string;
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

        const booking = await response.json();
        return booking;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create booking";
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
    async (bookingId: string, updates: Partial<Booking>) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/bookings/${bookingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to update booking");
        }

        const updatedBooking = await response.json();
        return updatedBooking;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update booking";
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
      tourTitle?: string;
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
          body: JSON.stringify({
            ...paymentData,
            amount: Math.round(paymentData.amount * 100), // Convert to cents
          }),
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
          err instanceof Error ? err.message : "Payment creation failed";
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

// Hook for processing payments (combines booking creation + payment)
export function useProcessPayment() {
  const { createBooking } = useCreateBooking();
  const { createPaymentSession } = useCreatePayment();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = useCallback(
    async (
      bookingData: Parameters<typeof createBooking>[0],
      paymentOptions?: {
        successUrl?: string;
        cancelUrl?: string;
      }
    ) => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Create the booking
        const booking = await createBooking(bookingData);

        // Step 2: Create payment session
        const paymentSession = await createPaymentSession({
          bookingId: booking.id,
          tourId: bookingData.tourId,
          amount: bookingData.totalAmount,
          currency: bookingData.currency,
          participants: bookingData.participants,
          date: bookingData.date,
          successUrl: paymentOptions?.successUrl,
          cancelUrl: paymentOptions?.cancelUrl,
        });

        return {
          booking,
          paymentSession,
          redirectUrl: paymentSession.url,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Payment processing failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [createBooking, createPaymentSession]
  );

  return { processPayment, loading, error };
}

// Hook for fetching earnings data
export function useEarnings(hostId?: string, period: string = "6months") {
  return useApi<{
    thisMonth: number;
    lastMonth: number;
    totalEarnings: number;
    pendingPayouts: number;
    completedPayouts: number;
    currency: string;
    growth: number;
    monthlyData: Array<{
      period: string;
      amount: number;
      bookings: number;
    }>;
  }>(
    `/api/earnings?${new URLSearchParams({
      ...(hostId && { hostId }),
      period,
    }).toString()}`,
    [hostId, period]
  );
}

// Hook for debounced search
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for managing local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}

// Hook for managing favorites
export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    "tour-favorites",
    []
  );

  const addToFavorites = useCallback(
    (tourId: string) => {
      setFavorites((prev) => [...new Set([...prev, tourId])]);
    },
    [setFavorites]
  );

  const removeFromFavorites = useCallback(
    (tourId: string) => {
      setFavorites((prev) => prev.filter((id) => id !== tourId));
    },
    [setFavorites]
  );

  const toggleFavorite = useCallback(
    (tourId: string) => {
      if (favorites.includes(tourId)) {
        removeFromFavorites(tourId);
      } else {
        addToFavorites(tourId);
      }
    },
    [favorites, addToFavorites, removeFromFavorites]
  );

  const isFavorite = useCallback(
    (tourId: string) => {
      return favorites.includes(tourId);
    },
    [favorites]
  );

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
  };
}
