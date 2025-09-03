// ===================================================================
// 📁 components/auth/RouteGuard.tsx
// Location: CREATE file components/auth/RouteGuard.tsx
// ===================================================================

"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useTranslations } from "@/lib/i18n";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface RouteGuardProps {
  children: ReactNode;
  requiredRole?: "customer" | "host" | "admin";
  requireAuth?: boolean;
  locale: string;
}

export default function RouteGuard({
  children,
  requiredRole,
  requireAuth = true,
  locale,
}: RouteGuardProps) {
  const { user, loading, authenticated } = useAuth();
  const router = useRouter();
  const t = useTranslations(locale);

  useEffect(() => {
    if (!loading) {
      // Se requer autenticação mas não está autenticado
      if (requireAuth && !authenticated) {
        router.push(`/${locale}/auth/login`);
        return;
      }

      // Se requer role específico mas utilizador não tem
      if (authenticated && requiredRole && user?.role !== requiredRole) {
        // Redirecionar para dashboard apropriado baseado no role do utilizador
        if (user?.role === "customer") {
          router.push(`/${locale}/customer`);
        } else if (user?.role === "host") {
          router.push(`/${locale}/host`);
        } else {
          router.push(`/${locale}`);
        }
        return;
      }
    }
  }, [loading, authenticated, user, requiredRole, requireAuth, router, locale]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">{t("common.loading")}...</span>
      </div>
    );
  }

  // Não autenticado (mas requer autenticação)
  if (requireAuth && !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("auth.accessDenied")}
            </h2>
            <p className="text-gray-600">{t("auth.loginRequired")}</p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => router.push(`/${locale}/auth/login`)}
              className="w-full"
            >
              {t("auth.login")}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}`)}
              className="w-full"
            >
              {t("navigation.home")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Role insuficiente
  if (authenticated && requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("auth.accessDenied")}
            </h2>
            <p className="text-gray-600 mb-4">
              {t("auth.insufficientPermissions")}
            </p>
            <div className="text-sm text-gray-500">
              {requiredRole === "customer" && <p>{t("auth.customerOnly")}</p>}
              {requiredRole === "host" && <p>{t("auth.hostOnly")}</p>}
              {requiredRole === "admin" && <p>{t("auth.adminOnly")}</p>}
            </div>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => {
                if (user?.role === "customer") {
                  router.push(`/${locale}/customer`);
                } else if (user?.role === "host") {
                  router.push(`/${locale}/host`);
                } else {
                  router.push(`/${locale}`);
                }
              }}
              className="w-full"
            >
              {t("common.goToDashboard")}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}`)}
              className="w-full"
            >
              {t("navigation.home")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Utilizador autorizado - mostrar conteúdo
  return <>{children}</>;
}
