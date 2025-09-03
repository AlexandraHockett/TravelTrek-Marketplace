// ===================================================================
// 📁 middleware.ts
// Location: REPLACE existing middleware.ts at project root
// ===================================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Configuração de idiomas suportados
const locales = ["pt", "en", "es", "fr", "de"] as const;
const defaultLocale = "pt";

type Locale = (typeof locales)[number];

// Obtém o locale do pathname
function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split("/");
  const potentialLocale = segments[1];

  if (locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale;
  }

  return null;
}

// Obtém o locale preferido do cabeçalho Accept-Language
function getLocaleFromHeader(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get("Accept-Language");

  if (!acceptLanguage) return defaultLocale;

  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [language, quality] = lang.split(";");
      return {
        language: language.trim().toLowerCase(),
        quality: quality ? parseFloat(quality.split("=")[1]) : 1.0,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { language } of languages) {
    if (locales.includes(language as Locale)) {
      return language as Locale;
    }
    const langCode = language.split("-")[0];
    if (locales.includes(langCode as Locale)) {
      return langCode as Locale;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip middleware para arquivos estáticos, API routes e assets
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_vercel/") ||
    pathname.includes("/_not-found") ||
    /\.(ico|png|svg|webp|jpeg|gif|webp|woff|woff2|ttf|eot|css|js|json|txt|xml|pdf)$/.test(
      pathname
    )
  ) {
    return NextResponse.next();
  }

  const currentLocale = getLocaleFromPathname(pathname);

  // Se já tem um locale válido no URL, continuar
  if (currentLocale) {
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", currentLocale, {
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return response;
  }

  // Determina o locale preferido (cookie > browser > default)
  let preferredLocale: Locale = defaultLocale;

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    preferredLocale = cookieLocale as Locale;
  } else {
    preferredLocale = getLocaleFromHeader(request);
  }

  // Redireciona para a versão localizada
  const redirectPathname = `/${preferredLocale}${pathname === "/" ? "" : pathname}`;
  const redirectUrl = new URL(redirectPathname + search, request.url);

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set("NEXT_LOCALE", preferredLocale, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_vercel|favicon.ico|favicon.svg|.*\\..*).*)",
  ],
};
