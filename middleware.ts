// ===================================================================
// 📁 middleware.ts - ROLE-BASED ROUTE PROTECTION
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

    // ✅ Aplicar i18n middleware primeiro
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

// ✅ CONFIGURAÇÃO DE MATCHER - Quais rotas aplicar o middleware
export const config = {
  matcher: [
    // Aplicar a todas as rotas exceto:
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    // Incluir APIs protegidas
    "/api/bookings/:path*",
    "/api/tours/:path*",
    "/api/users/:path*",
  ],
};
