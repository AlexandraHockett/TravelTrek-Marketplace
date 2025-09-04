// ===================================================================
// 📁 app/[locale]/auth/signup/page.tsx
// Location: CREATE this new file
// ===================================================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignupForm from "@/components/auth/SignupForm";

type Props = {
  params: { locale: string };
};

// Generate metadata for SEO
export async function generateMetadata({ params: { locale } }: Props) {
  const titles = {
    pt: "Criar Conta - TravelTrek",
    en: "Create Account - TravelTrek",
    es: "Crear Cuenta - TravelTrek",
    fr: "Créer un Compte - TravelTrek",
    de: "Konto Erstellen - TravelTrek",
  };

  const descriptions = {
    pt: "Junta-te à nossa comunidade de viajantes. Cria a tua conta no TravelTrek e descobre experiências incríveis.",
    en: "Join our community of travelers. Create your TravelTrek account and discover amazing experiences.",
    es: "Únete a nuestra comunidad de viajeros. Crea tu cuenta de TravelTrek y descubre experiencias increíbles.",
    fr: "Rejoignez notre communauté de voyageurs. Créez votre compte TravelTrek et découvrez des expériences incroyables.",
    de: "Treten Sie unserer Reisegemeinschaft bei. Erstellen Sie Ihr TravelTrek-Konto und entdecken Sie unglaubliche Erfahrungen.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.en,
    robots: "index, follow",
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.en,
      type: "website",
    },
  };
}

export default async function SignupPage({ params: { locale } }: Props) {
  // Redirect if already logged in
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect(`/${locale}/customer`);
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <SignupForm locale={locale} />
      </div>
    </>
  );
}
