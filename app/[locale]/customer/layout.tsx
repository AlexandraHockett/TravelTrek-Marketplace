// ===================================================================
// 📁 app/[locale]/customer/layout.tsx
// Location: CRIAR/SUBSTITUIR arquivo app/[locale]/customer/layout.tsx
// ===================================================================

import { ReactNode } from "react";
import RouteGuard from "@/components/auth/RouteGuard";
import { getServerTranslations } from "@/lib/utils";

interface CustomerLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function CustomerLayout({
  children,
  params,
}: CustomerLayoutProps) {
  const { locale } = await params;

  return (
    <RouteGuard requiredRole="customer" requireAuth={true} locale={locale}>
      <div className="min-h-screen bg-gray-50">
        {/* Customer-specific layout elements can go here */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </RouteGuard>
  );
}

// ✅ CORRIGIDO: generateMetadata usa função de tradução server-side
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getServerTranslations(locale);

  return {
    title: `${t("navigation.customerPortal")} | TravelTrek`,
    description: t("pages.customer.dashboard.subtitle"),
  };
}
