// // ===================================================================
// // 📁 app/[locale]/host/layout.tsx
// // Location: CRIAR/SUBSTITUIR arquivo app/[locale]/host/layout.tsx
// // ===================================================================

// import { ReactNode } from "react";
// import RouteGuard from "@/components/auth/RouteGuard";
// import { getServerTranslations } from "@/lib/utils";

// interface HostLayoutProps {
//   children: ReactNode;
//   params: Promise<{ locale: string }>;
// }

// export default async function HostLayout({
//   children,
//   params,
// }: HostLayoutProps) {
//   const { locale } = await params;

//   return (
//     <RouteGuard requiredRole="host" requireAuth={true} locale={locale}>
//       <div className="min-h-screen bg-gray-50">
//         {/* Host-specific layout elements can go here */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {children}
//         </div>
//       </div>
//     </RouteGuard>
//   );
// }

// // ✅ CORRIGIDO: generateMetadata usa função de tradução server-side
// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = await params;
//   const t = await getServerTranslations(locale);

//   return {
//     title: `${t("navigation.hostPortal")} | TravelTrek`,
//     description: t("pages.host.dashboard.subtitle"),
//   };
// }
// ===================================================================
// 📁 app/[locale]/host/layout.tsx
// Location: SUBSTITUIR app/[locale]/host/layout.tsx
// ===================================================================

import { ReactNode } from "react";
import { getServerTranslations } from "@/lib/utils";
import DevModeBypass from "@/components/auth/DevModeBypass";
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

  // ✅ DEVELOPMENT MODE - Bypass authentication completely
  if (process.env.NODE_ENV === "development") {
    console.log("🔧 DEV MODE: Host layout bypassing authentication");
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    );
  }

  // ✅ PRODUCTION MODE - Use RouteGuard
  return (
    <RouteGuard requiredRole="host" requireAuth={true} locale={locale}>
      <div className="min-h-screen bg-gray-50">
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

  // Simple fallback for development
  if (process.env.NODE_ENV === "development") {
    return {
      title: `Host Dashboard | TravelTrek`,
      description: "Host dashboard for managing tours and bookings",
    };
  }

  // Production metadata with translations
  try {
    const t = await getServerTranslations(locale);
    return {
      title: `${t("navigation.hostPortal")} | TravelTrek`,
      description: t("pages.host.dashboard.subtitle"),
    };
  } catch (error) {
    return {
      title: `Host Dashboard | TravelTrek`,
      description: "Host dashboard for managing tours and bookings",
    };
  }
}
