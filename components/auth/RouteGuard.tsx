// ===================================================================
// 📁 components/auth/RouteGuard.tsx
// Location: SUBSTITUIR o arquivo existente components/auth/RouteGuard.tsx
// ===================================================================

"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/lib/i18n";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AuthLoadingSpinner from "@/components/auth/AuthLoadingSpinner";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Shield, Lock, UserX } from "lucide-react";

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations(locale);

  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;
  const user = session?.user;

  useEffect(() => {
    if (!isLoading) {
      // Se requer autenticação mas não está autenticado
      if (requireAuth && !isAuthenticated) {
        router.push(`/${locale}/auth/login`);
        return;
      }

      // Se requer role específico mas utilizador não tem
      if (isAuthenticated && requiredRole && user?.role !== requiredRole) {
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
  }, [
    isLoading,
    isAuthenticated,
    user,
    requiredRole,
    requireAuth,
    router,
    locale,
  ]);

  // 🔄 LOADING STATE - Loading spinner elegante
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
          </div>

          {/* Loading Spinner com texto */}
          <div className="mb-4">
            <AuthLoadingSpinner
              size="lg"
              showText={true}
              text={t("auth.verifyingAccess") || "A verificar acesso..."}
              className="justify-center"
            />
          </div>

          {/* Mensagem adicional */}
          <p className="text-sm text-gray-500">
            {t("auth.pleaseWait") || "Por favor, aguarde..."}
          </p>
        </div>
      </div>
    );
  }

  // 🔐 NÃO AUTENTICADO (mas requer autenticação)
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("auth.accessDenied") || "Acesso Negado"}
            </h2>
            <p className="text-gray-600">
              {t("auth.loginRequired") ||
                "É necessário fazer login para aceder a esta página."}
            </p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => router.push(`/${locale}/auth/login`)}
              className="w-full"
            >
              {t("auth.login") || "Iniciar Sessão"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}`)}
              className="w-full"
            >
              {t("navigation.home") || "Início"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ⚠️ ROLE INSUFICIENTE
  if (isAuthenticated && requiredRole && user?.role !== requiredRole) {
    const getRoleDisplayName = (role: string) => {
      const roleNames: Record<string, string> = {
        customer: t("roles.customer") || "Cliente",
        host: t("roles.host") || "Anfitrião",
        admin: t("roles.admin") || "Administrador",
      };
      return roleNames[role] || role;
    };

    const getRequiredRoleMessage = () => {
      if (requiredRole === "customer") {
        return t("auth.customerOnly") || "Esta página é apenas para clientes.";
      }
      if (requiredRole === "host") {
        return t("auth.hostOnly") || "Esta página é apenas para anfitriões.";
      }
      if (requiredRole === "admin") {
        return (
          t("auth.adminOnly") || "Esta página é apenas para administradores."
        );
      }
      return (
        t("auth.insufficientPermissions") || "Não tem permissões suficientes."
      );
    };

    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("auth.accessRestricted") || "Acesso Restrito"}
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>{getRequiredRoleMessage()}</p>
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                <p>
                  <span className="font-medium">
                    {t("auth.yourRole") || "Seu tipo de conta"}:
                  </span>{" "}
                  {getRoleDisplayName(user?.role || "")}
                </p>
                <p>
                  <span className="font-medium">
                    {t("auth.requiredRole") || "Tipo necessário"}:
                  </span>{" "}
                  {getRoleDisplayName(requiredRole)}
                </p>
              </div>
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
              {t("common.goToDashboard") || "Ir para o Painel"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}`)}
              className="w-full"
            >
              {t("navigation.home") || "Início"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ✅ UTILIZADOR AUTORIZADO - Mostrar conteúdo
  return <>{children}</>;
}
