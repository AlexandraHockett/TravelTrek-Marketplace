// ===================================================================
// 📁 app/[locale]/auth/error/page.tsx
// Location: CRIAR este ficheiro
// ===================================================================

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";

interface AuthErrorPageProps {
  params: Promise<{ locale: string }>;
}

export default function AuthErrorPage({ params }: AuthErrorPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  useEffect(() => {
    const handleGoogleSignupRedirect = async () => {
      const { locale } = await params;

      // Se for erro de Google signin (user não existe), redireciona para signup
      if (error === "Callback" || error === "OAuthCallback") {
        console.log("Google user not found - redirecting to signup");
        setTimeout(() => {
          router.push(`/${locale}/auth/signup?google_signup=true`);
        }, 2000); // 2 segundos para mostrar mensagem
      }
    };

    handleGoogleSignupRedirect();
  }, [error, router, params]);

  const getErrorMessage = () => {
    switch (error) {
      case "Callback":
      case "OAuthCallback":
        return {
          title: "Conta não encontrada",
          message:
            "Esta conta Google não está registada. A redirecionar para o registo...",
          action: "signup",
        };
      case "AccessDenied":
        return {
          title: "Acesso Negado",
          message: "Não tem permissão para aceder a esta aplicação.",
          action: "login",
        };
      case "Verification":
        return {
          title: "Erro de Verificação",
          message: "Erro na verificação da conta. Tente novamente.",
          action: "login",
        };
      default:
        return {
          title: "Erro de Autenticação",
          message: "Ocorreu um erro durante a autenticação. Tente novamente.",
          action: "login",
        };
    }
  };

  const errorInfo = getErrorMessage();

  const handleManualRedirect = async () => {
    const { locale } = await params;

    if (errorInfo.action === "signup") {
      router.push(`/${locale}/auth/signup`);
    } else {
      router.push(`/${locale}/auth/login`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {errorInfo.title}
          </h2>
          <p className="text-gray-600">{errorInfo.message}</p>
        </div>

        {error === "Callback" || error === "OAuthCallback" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">
                A redirecionar...
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Button onClick={handleManualRedirect} className="w-full">
              {errorInfo.action === "signup"
                ? "Ir para Registo"
                : "Tentar Novamente"}
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 text-xs text-gray-400">
            Código de erro: {error}
          </div>
        )}
      </Card>
    </div>
  );
}
