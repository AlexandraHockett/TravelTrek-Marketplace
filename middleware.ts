// File: middleware.ts
// Location: SUBSTITUIR o arquivo existente middleware.ts na raiz do projeto

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

  // Parse do cabeçalho Accept-Language
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

  // Procura pelo primeiro idioma suportado
  for (const { language } of languages) {
    if (locales.includes(language as Locale)) {
      return language as Locale;
    }
    // Verifica código de idioma sem região (ex: 'en' de 'en-US')
    const langCode = language.split("-")[0];
    if (locales.includes(langCode as Locale)) {
      return langCode as Locale;
    }
  }

  return defaultLocale;
}

// Remove locale do pathname
function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/");
  if (locales.includes(segments[1] as Locale)) {
    return "/" + segments.slice(2).join("/") || "/";
  }
  return pathname;
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
    // Armazena locale no cookie
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

  // Armazena locale no cookie
  response.cookies.set("NEXT_LOCALE", preferredLocale, {
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _vercel (Vercel files)
     * - favicon.ico, favicon.svg (favicon files)
     * - Any files with extensions (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|_vercel|favicon.ico|favicon.svg|.*\\..*).*)",
  ],
};
