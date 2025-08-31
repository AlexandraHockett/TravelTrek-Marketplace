// File: lib/utils.ts
// Location: Make sure this file exists with the correct content
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency = "EUR",
  locale = "pt-PT"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "EUR" ? 2 : 0,
  }).format(amount);
}

export function formatDate(
  date: string | Date,
  locale = "pt-PT",
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return new Intl.DateTimeFormat(locale, {
    ...defaultOptions,
    ...options,
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export async function getTranslations(locale: string) {
  try {
    const translations = await import(`@/locales/${locale}.json`);
    return translations.default;
  } catch {
    // Fallback to English (en.json)
    const translations = await import(`@/locales/en.json`);
    return translations.default;
  }
}

export async function resolvePageParams<T>(params: Promise<T> | T): Promise<T> {
  try {
    return await Promise.resolve(params);
  } catch (error) {
    console.error("Error resolving params:", error);
    throw new Error("Failed to resolve page parameters");
  }
}
