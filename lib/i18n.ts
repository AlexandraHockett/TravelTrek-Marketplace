// File: lib/i18n.ts (App Router Compatible)
// Location: Create this file in lib/i18n.ts

"use client";

// Supported languages configuration
export const languages = {
  pt: { name: "Português", flag: "🇵🇹", code: "pt" },
  en: { name: "English", flag: "🇬🇧", code: "en" },
  es: { name: "Español", flag: "🇪🇸", code: "es" },
  fr: { name: "Français", flag: "🇫🇷", code: "fr" },
  de: { name: "Deutsch", flag: "🇩🇪", code: "de" },
};

export const locales = Object.keys(languages);
export const defaultLocale = "pt";

// Load translation files
export function loadTranslations(locale: string) {
  try {
    // Dynamic import for client-side
    const translations = require(`../locales/${locale}.json`);
    return translations;
  } catch (error) {
    console.warn(
      `Translation file for locale "${locale}" not found, falling back to Portuguese`
    );
    try {
      return require(`../locales/pt.json`);
    } catch (fallbackError) {
      console.error("Portuguese translation file not found");
      return {};
    }
  }
}

// Get translation function
export function useTranslations(locale: string) {
  const translations = loadTranslations(locale);

  return function t(key: string, fallback?: string): string {
    const keys = key.split(".");
    let result = translations;

    for (const k of keys) {
      if (result && typeof result === "object" && k in result) {
        result = result[k];
      } else {
        return fallback || key;
      }
    }

    return typeof result === "string" ? result : fallback || key;
  };
}

// Get language from pathname for client components
export function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/");
  const potentialLocale = segments[1];

  if (Object.keys(languages).includes(potentialLocale)) {
    return potentialLocale;
  }

  return defaultLocale;
}

// Remove locale from pathname for navigation
export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/");
  const potentialLocale = segments[1];

  if (Object.keys(languages).includes(potentialLocale)) {
    return "/" + segments.slice(2).join("/") || "/";
  }

  return pathname;
}

// Get localized href
export function getLocalizedHref(href: string, locale: string): string {
  if (locale === defaultLocale) {
    return href;
  }

  // Ensure href starts with /
  const cleanHref = href.startsWith("/") ? href : "/" + href;
  return `/${locale}${cleanHref}`;
}

// Get locale from cookie (client-side)
export function getLocaleFromCookie(): string {
  if (typeof document === "undefined") return defaultLocale;

  const cookies = document.cookie.split(";");
  const localeCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("locale=")
  );

  if (localeCookie) {
    const locale = localeCookie.split("=")[1];
    if (Object.keys(languages).includes(locale)) {
      return locale;
    }
  }

  return defaultLocale;
}

// Set locale cookie (client-side)
export function setLocaleCookie(locale: string): void {
  if (typeof document === "undefined") return;

  const maxAge = 60 * 60 * 24 * 30; // 30 days
  document.cookie = `locale=${locale}; max-age=${maxAge}; path=/; samesite=lax`;
}
