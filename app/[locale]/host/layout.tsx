// ===================================================================
// 📁 app/[locale]/host/layout.tsx - PRODUCTION READY WITH AUTH
// Location: REPLACE ENTIRE CONTENT of app/[locale]/host/layout.tsx
// ===================================================================

import { ReactNode } from "react";
import { getServerTranslations } from "@/lib/utils";
import RouteGuard from "@/components/auth/RouteGuard";

interface HostLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function HostLayout({
  children,
  params,
}: HostLayoutProps) {
  const { locale } = await params;

  // ✅ SEMPRE usar autenticação - remover bypass de desenvolvimento
  return (
    <RouteGuard requiredRole="host" requireAuth={true} locale={locale}>
      <div className="min-h-screen bg-gray-50">
        {/* Host Navigation Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Portal do Anfitrião
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Host
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </RouteGuard>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  try {
    const t = await getServerTranslations(locale);
    return {
      title: `${t("navigation.hostPortal") || "Portal do Anfitrião"} | TravelTrek`,
      description:
        t("pages.host.dashboard.subtitle") || "Gerir tours e reservas",
      robots: "noindex, nofollow", // Host area should not be indexed
    };
  } catch (error) {
    return {
      title: `Portal do Anfitrião | TravelTrek`,
      description: "Dashboard para anfitriões gerirem tours e reservas",
      robots: "noindex, nofollow",
    };
  }
}
