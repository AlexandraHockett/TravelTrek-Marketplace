// ===================================================================
// 📁 app/[locale]/auth/login/page.tsx
// Location: SUBSTITUIR file app/[locale]/auth/login/page.tsx
// ===================================================================

import { Suspense } from "react";
import { getTranslations } from "@/lib/utils";
import LoginForm from "@/components/auth/LoginForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner"; // ✅ CORRIGIDO: export default

interface LoginPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <LoginForm locale={locale} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ params }: LoginPageProps) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return {
    title: `${t("auth.login")} | TravelTrek`,
    description: t("auth.loginSubtitle"),
  };
}
