// ===================================================================
// 📁 lib/utils.ts
// Location: SUBSTITUIR APENAS AS LINHAS DAS EXPORTAÇÕES (linhas 8-16)
// ===================================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Re-export server translation functions - APENAS O QUE EXISTE
export {
  getServerTranslations,
  getTranslations,
  type TranslationFunction,
} from "./server-translations";

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

// Check if date is this week
export function isThisWeek(date: string | Date): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const endOfWeek = new Date(
    today.setDate(today.getDate() - today.getDay() + 6)
  );

  return dateObj >= startOfWeek && dateObj <= endOfWeek;
}

// Generate random ID
export function generateId(length: number = 8): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
