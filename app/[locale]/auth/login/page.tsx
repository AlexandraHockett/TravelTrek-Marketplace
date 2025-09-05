// ===================================================================
// 📁 app/[locale]/auth/login/page.tsx
// Location: SUBSTITUIR ficheiro existente
// ===================================================================

import { Suspense } from "react";
import { getServerTranslations } from "@/lib/utils";
import LoginForm from "@/components/auth/LoginForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

interface LoginPageProps {
  params: Promise<{ locale: string }>; // ✅ FIXED: Now Promise<>
}

// ✅ FIXED: Await params in component
export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params; // ✅ Await the Promise
  const user = await getCurrentUser();

  if (user) {
    // Redirect based on user role
    switch (user.role) {
      case "customer":
        redirect(`/${locale}/customer`);
        break;
      case "host":
        redirect(`/${locale}/host`);
        break;
      case "admin":
        redirect(`/${locale}/admin`);
        break;
      default:
        redirect(`/${locale}`);
    }
  }

  return (
    
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <LoginForm locale={locale} />
      </Suspense>
    </div>
  );
}

// ✅ FIXED: Await params in generateMetadata
export async function generateMetadata({ params }: LoginPageProps) {
  const { locale } = await params; // ✅ Await the Promise
  const t = await getServerTranslations(locale);

  return {
    title: `${t("auth.login")} | TravelTrek`,
    description: t("auth.loginSubtitle"),
  };
}
