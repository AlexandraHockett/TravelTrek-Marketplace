// File: lib/utils.ts
// Location: REPLACE existing lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind CSS class merger utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency formatting with better validation
export function formatCurrency(
  amount: number,
  currency: string = "EUR"
): string {
  // Validate currency code and provide fallback
  const validCurrency = validateCurrencyCode(currency);

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: validCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Helper function to validate currency codes
function validateCurrencyCode(currency: string): string {
  // List of valid currency codes
  const validCurrencies = [
    "EUR",
    "USD",
    "GBP",
    "JPY",
    "CHF",
    "CAD",
    "AUD",
    "BRL",
  ];

  // Map locale codes to currencies (fallback)
  const localeToCurrency: Record<string, string> = {
    pt: "EUR",
    en: "EUR", // UK context, but EUR for Portugal-based app
    es: "EUR",
    fr: "EUR",
    de: "EUR",
  };

  // Check if it's a valid currency code
  if (validCurrencies.includes(currency.toUpperCase())) {
    return currency.toUpperCase();
  }

  // Check if it's a locale code and map to currency
  if (localeToCurrency[currency.toLowerCase()]) {
    return localeToCurrency[currency.toLowerCase()];
  }

  // Default fallback
  return "EUR";
}

// Price formatting for displays with locale and currency support
export function formatPrice(
  price: number,
  currency: string = "EUR",
  locale: string = "en-GB"
): string {
  const localeMap: Record<string, string> = {
    pt: "pt-PT",
    en: "en-GB",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
  };

  const intlLocale = localeMap[locale] || locale;
  const validCurrency = validateCurrencyCode(currency);

  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: validCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

// Date formatting with locale support
export function formatDate(
  date: string | Date,
  locale: string = "en-GB"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Map locale codes to Intl.DateTimeFormat locales
  const localeMap: Record<string, string> = {
    pt: "pt-PT",
    en: "en-GB",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
  };

  const intlLocale = localeMap[locale] || locale;

  return new Intl.DateTimeFormat(intlLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

// Short date format
export function formatDateShort(
  date: string | Date,
  locale: string = "en-GB"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const localeMap: Record<string, string> = {
    pt: "pt-PT",
    en: "en-GB",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
  };

  const intlLocale = localeMap[locale] || locale;

  return new Intl.DateTimeFormat(intlLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
}

// Time formatting
export function formatTime(
  date: string | Date,
  locale: string = "en-GB"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const localeMap: Record<string, string> = {
    pt: "pt-PT",
    en: "en-GB",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
  };

  const intlLocale = localeMap[locale] || locale;

  return new Intl.DateTimeFormat(intlLocale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dateObj);
}

// Number formatting
export function formatNumber(number: number, locale: string = "en-GB"): string {
  const localeMap: Record<string, string> = {
    pt: "pt-PT",
    en: "en-GB",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
  };

  const intlLocale = localeMap[locale] || locale;

  return new Intl.NumberFormat(intlLocale).format(number);
}

// Percentage formatting
export function formatPercentage(
  value: number,
  locale: string = "en-GB"
): string {
  const localeMap: Record<string, string> = {
    pt: "pt-PT",
    en: "en-GB",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
  };

  const intlLocale = localeMap[locale] || locale;

  return new Intl.NumberFormat(intlLocale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

// Server-side translations loader
export async function getTranslations(locale: string) {
  try {
    // Dynamic import for server-side usage
    const translations = await import(`../locales/${locale}.json`);
    return translations.default;
  } catch (error) {
    console.warn(
      `Translation file for locale "${locale}" not found, falling back to Portuguese`
    );
    try {
      const fallback = await import(`../locales/pt.json`);
      return fallback.default;
    } catch (fallbackError) {
      console.error("Portuguese translation file not found");
      return {};
    }
  }
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Capitalize first letter
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Generate slug from text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Check if date is today
export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

// Check if date is in the future
export function isFutureDate(date: string | Date): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.getTime() > Date.now();
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone format (basic)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,}$/;
  return phoneRegex.test(phone);
}

// Format phone number
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("351")) {
    // Portuguese format: +351 XXX XXX XXX
    return `+351 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }

  if (cleaned.length === 9 && !cleaned.startsWith("0")) {
    // Portuguese mobile without country code
    return `+351 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }

  return phone; // Return original if no formatting rules apply
}

// Calculate booking service fees (15%)
export function calculateServiceFees(baseAmount: number): number {
  return Math.round(baseAmount * 0.15);
}

// Calculate total booking amount
export function calculateTotalAmount(baseAmount: number): number {
  const serviceFees = calculateServiceFees(baseAmount);
  return baseAmount + serviceFees;
}

// Get relative time (e.g., "2 hours ago")
export function getRelativeTime(
  date: string | Date,
  locale: string = "en-GB"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 60) {
    return rtf.format(-diffMinutes, "minute");
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) {
    return rtf.format(-diffHours, "hour");
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return rtf.format(-diffDays, "day");
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) {
    return rtf.format(-diffWeeks, "week");
  }

  const diffMonths = Math.floor(diffDays / 30);
  return rtf.format(-diffMonths, "month");
}

// Generate booking confirmation ID
export function generateBookingId(): string {
  const prefix = "TT";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

// Color utilities for status badges
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: "yellow",
    confirmed: "blue",
    paid: "green",
    completed: "gray",
    cancelled: "red",
    active: "green",
    inactive: "gray",
  };

  return colorMap[status.toLowerCase()] || "gray";
}

// File size formatting
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Deep clone object utility
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Check if object is empty
export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === "string") return obj.length === 0;
  if (obj instanceof Date) return false;
  return Object.keys(obj).length === 0;
}

// Safe JSON parse
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
