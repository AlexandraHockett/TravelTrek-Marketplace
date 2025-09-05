// ===================================================================
// 📁 app/[locale]/auth/signup/page.tsx - ENHANCED FOR GOOGLE SIGNUP
// Location: SUBSTITUIR ficheiro existente
// ===================================================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getServerTranslations } from "@/lib/utils";
import SignupForm from "@/components/auth/SignupForm";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ google_signup?: string }>; // ✅ NEW: Detect Google signup
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getServerTranslations(locale);

  return {
    title: `${t("auth.signupTitle") || "Criar Conta"} | TravelTrek`,
    description: t("auth.signupSubtitle") || "Junta-te à nossa comunidade",
    robots: "index, follow",
    openGraph: {
      title: `${t("auth.signupTitle") || "Criar Conta"} | TravelTrek`,
      description: t("auth.signupSubtitle") || "Junta-te à nossa comunidade",
      type: "website",
    },
  };
}

export default async function SignupPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { google_signup } = await searchParams;

  // Redirect if already logged in
  const session = await getServerSession(authOptions);
  if (session?.user) {
    // Redirect based on user role
    switch (session.user.role) {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* ✅ NEW: Show message if coming from Google login */}
      {google_signup && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded shadow-lg">
            <p className="text-sm">
              <strong>Conta Google não encontrada.</strong> Por favor,
              registe-se primeiro.
            </p>
          </div>
        </div>
      )}

      <SignupForm locale={locale} />
    </div>
  );
}
