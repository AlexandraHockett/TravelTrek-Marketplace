// ===================================================================
// 📁 app/[locale]/auth/signup/page.tsx
// Location: SUBSTITUIR ficheiro existente
// ===================================================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getServerTranslations } from "@/lib/utils";
import SignupForm from "@/components/auth/SignupForm";

interface Props {
  params: Promise<{ locale: string }>; // ✅ FIXED: Now Promise<>
}

// ✅ FIXED: Await params in generateMetadata
export async function generateMetadata({ params }: Props) {
  const { locale } = await params; // ✅ Await the Promise
  const t = await getServerTranslations(locale);

  return {
    title: `${t("auth.signupTitle")} | TravelTrek`,
    description: t("auth.signupSubtitle"),
    robots: "index, follow",
    openGraph: {
      title: `${t("auth.signupTitle")} | TravelTrek`,
      description: t("auth.signupSubtitle"),
      type: "website",
    },
  };
}

// ✅ FIXED: Await params in component
export default async function SignupPage({ params }: Props) {
  const { locale } = await params; // ✅ Await the Promise

  // Redirect if already logged in
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect(`/${locale}/customer`);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignupForm locale={locale} />
    </div>
  );
}
