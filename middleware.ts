// ===================================================================
// 📁 middleware.ts - CORRECTED VERSION
// Location: REPLACE ENTIRE CONTENT of middleware.ts (root)
// ===================================================================

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

// ✅ CONFIGURAÇÃO DE LOCALES
const locales = ["pt", "en", "es", "fr", "de"];
const defaultLocale = "pt";

// ✅ INTL MIDDLEWARE SETUP
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

// ✅ ROLE-BASED ROUTE PROTECTION
export default withAuth(
  function middleware(req: NextRequest & { nextauth?: any }) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    // ✅ CRITICAL: API routes should NEVER be redirected by i18n
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // ✅ CRITICAL: Static assets should pass through
    if (
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/images/") ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    // ✅ Aplicar i18n middleware para rotas de páginas
    const intlResponse = intlMiddleware(req);
    if (intlResponse) return intlResponse;

    // ✅ EXTRAIR LOCALE DA URL
    const locale = pathname.split("/")[1];
    const pathWithoutLocale = pathname.replace(`/${locale}`, "");

    // ✅ ROTAS PÚBLICAS - Não precisam de autenticação
    const publicPaths = [
      "/",
      "/auth/login",
      "/auth/signup",
      "/auth/error",
      "/tours", // Browse tours (público)
      "/status",
    ];

    if (publicPaths.some((path) => pathWithoutLocale.startsWith(path))) {
      return NextResponse.next();
    }

    // ✅ VERIFICAR AUTENTICAÇÃO
    if (!token) {
      const loginUrl = new URL(`/${locale}/auth/login`, req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // ✅ ROLE-BASED ACCESS CONTROL
    const userRole = token.role as string;

    // 🔐 CUSTOMER ROUTES - Apenas para customers
    if (pathWithoutLocale.startsWith("/customer")) {
      if (userRole !== "customer" && userRole !== "admin") {
        return NextResponse.redirect(
          new URL(`/${locale}/auth/access-denied`, req.url)
        );
      }
    }

    // 🏠 HOST ROUTES - Apenas para hosts
    if (pathWithoutLocale.startsWith("/host")) {
      if (userRole !== "host" && userRole !== "admin") {
        return NextResponse.redirect(
          new URL(`/${locale}/auth/access-denied`, req.url)
        );
      }
    }

    // 👑 ADMIN ROUTES - Apenas para admins
    if (pathWithoutLocale.startsWith("/admin")) {
      if (userRole !== "admin") {
        return NextResponse.redirect(
          new URL(`/${locale}/auth/access-denied`, req.url)
        );
      }
    }

    // ✅ Utilizador autorizado - continuar
    return NextResponse.next();
  },
  {
    callbacks: {
      // ✅ QUANDO EXECUTAR O MIDDLEWARE AUTH
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // ✅ CRITICAL: API routes are always authorized (handle auth inside API)
        if (pathname.startsWith("/api/")) {
          return true;
        }

        const locale = pathname.split("/")[1];
        const pathWithoutLocale = pathname.replace(`/${locale}`, "");

        // Rotas públicas não precisam de token
        const publicPaths = [
          "/",
          "/auth/login",
          "/auth/signup",
          "/auth/error",
          "/tours",
          "/status",
        ];

        if (publicPaths.some((path) => pathWithoutLocale.startsWith(path))) {
          return true;
        }

        // Todas as outras rotas precisam de token
        return !!token;
      },
    },
  }
);

// ✅ CRITICAL FIX: MATCHER configuration - EXCLUDE ALL /api/* routes
export const config = {
  matcher: [
    // Apply to all routes EXCEPT API routes, static files, and Next.js internals
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    // ❌ REMOVED: "/api/bookings/:path*" - API routes should NOT be in matcher!
    // ❌ REMOVED: "/api/tours/:path*" - API routes should NOT be in matcher!
    // ❌ REMOVED: "/api/users/:path*" - API routes should NOT be in matcher!
  ],
};
