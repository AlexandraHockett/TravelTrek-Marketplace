// File: lib/i18n.ts
// Location: SUBSTITUIR o arquivo existente lib/i18n.ts

"use client";

// Configuração de idiomas suportados
export const languages = {
  pt: { name: "Português", flag: "🇵🇹", code: "pt", htmlLang: "pt-PT" },
  en: { name: "English", flag: "🇬🇧", code: "en", htmlLang: "en-GB" },
  es: { name: "Español", flag: "🇪🇸", code: "es", htmlLang: "es-ES" },
  fr: { name: "Français", flag: "🇫🇷", code: "fr", htmlLang: "fr-FR" },
  de: { name: "Deutsch", flag: "🇩🇪", code: "de", htmlLang: "de-DE" },
} as const;

export const locales = Object.keys(languages) as Array<keyof typeof languages>;
export const defaultLocale = "pt" as const;

export type Locale = keyof typeof languages;

// Carrega arquivos de tradução (para uso client-side)
export function loadTranslations(locale: string) {
  try {
    // Para client-side, usar import dinâmico
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

// Hook para obter função de tradução (client-side)
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

// Obtém idioma do pathname (client-side)
export function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/");
  const potentialLocale = segments[1];

  if (Object.keys(languages).includes(potentialLocale)) {
    return potentialLocale;
  }

  return defaultLocale;
}

// Remove locale do pathname
export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/");
  const potentialLocale = segments[1];

  if (Object.keys(languages).includes(potentialLocale)) {
    return "/" + segments.slice(2).join("/") || "/";
  }

  return pathname;
}

// Obtém href localizado
export function getLocalizedHref(href: string, locale: string): string {
  // Remove locale actual se existir
  const cleanHref = removeLocaleFromPathname(href);

  // Adiciona novo locale
  return `/${locale}${cleanHref === "/" ? "" : cleanHref}`;
}

// Utilitários para cookies (client-side)
export function getLocaleFromCookie(): string {
  if (typeof window === "undefined") return defaultLocale;

  const cookies = document.cookie.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

  const cookieLocale = cookies["NEXT_LOCALE"];
  return cookieLocale && Object.keys(languages).includes(cookieLocale)
    ? cookieLocale
    : defaultLocale;
}

export function setLocaleCookie(locale: string): void {
  if (typeof window === "undefined") return;

  document.cookie = `NEXT_LOCALE=${locale}; max-age=${60 * 60 * 24 * 30}; path=/; SameSite=Lax`;
}

// Validação de locale
export function isValidLocale(locale: string): locale is Locale {
  return Object.keys(languages).includes(locale);
}
