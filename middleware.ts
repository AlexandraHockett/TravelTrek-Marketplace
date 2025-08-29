// File: middleware.ts
// Location: CREATE THIS FILE IN THE ROOT of your project (same level as next.config.js)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Supported languages
const locales = ["pt", "en", "es", "fr", "de"];
const defaultLocale = "pt";

// Get locale from pathname
function getLocale(pathname: string): string {
  const segments = pathname.split("/");
  const potentialLocale = segments[1];

  if (locales.includes(potentialLocale)) {
    return potentialLocale;
  }

  return defaultLocale;
}

// Get locale from Accept-Language header
function getLocaleFromHeader(request: NextRequest): string {
  const acceptLanguage = request.headers.get("Accept-Language");

  if (!acceptLanguage) return defaultLocale;

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().toLowerCase());

  // Find first matching locale
  for (const lang of languages) {
    if (locales.includes(lang)) {
      return lang;
    }
    // Check for language without country code (e.g., 'en' from 'en-US')
    const langCode = lang.split("-")[0];
    if (locales.includes(langCode)) {
      return langCode;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes("/.")
  ) {
    return NextResponse.next();
  }

  const currentLocale = getLocale(pathname);

  // If URL already has a locale prefix, continue
  if (locales.includes(pathname.split("/")[1])) {
    // Store locale in cookie
    const response = NextResponse.next();
    response.cookies.set("locale", currentLocale, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  // Get preferred locale (cookie > browser > default)
  let preferredLocale = defaultLocale;

  const cookieLocale = request.cookies.get("locale")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    preferredLocale = cookieLocale;
  } else {
    preferredLocale = getLocaleFromHeader(request);
  }

  // Redirect to localized version
  const redirectUrl = new URL(`/${preferredLocale}${pathname}`, request.url);
  const response = NextResponse.redirect(redirectUrl);

  // Store locale in cookie
  response.cookies.set("locale", preferredLocale, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
