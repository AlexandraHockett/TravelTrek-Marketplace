// ===================================================================
// 📁 app/[locale]/host/tours/create/page.tsx - PRODUCTION WITH AUTH
// Location: REPLACE ENTIRE CONTENT of app/[locale]/host/tours/create/page.tsx
// ===================================================================

import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServerTranslations } from "@/lib/utils";
import CreateTourClient from "./client";

interface CreateTourPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  try {
    const t = await getServerTranslations(locale);
    return {
      title: `${t("host.tours.create.title") || "Criar Novo Tour"} | TravelTrek`,
      description:
        t("host.tours.create.description") ||
        "Criar uma nova experiência de tour para viajantes",
      robots: "noindex, nofollow", // Host pages should not be indexed
    };
  } catch (error) {
    return {
      title: "Criar Novo Tour | TravelTrek",
      description: "Criar uma nova experiência de tour para viajantes",
      robots: "noindex, nofollow",
    };
  }
}

export default async function CreateTourPage({ params }: CreateTourPageProps) {
  const { locale } = await params;

  // ✅ SEMPRE verificar autenticação
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  if (session.user.role !== "host" && session.user.role !== "admin") {
    redirect(`/${locale}/unauthorized`);
  }

  let t: any;
  try {
    t = await getServerTranslations(locale);
  } catch (error) {
    // Fallback function if translations fail
    t = (key: string, fallback: string) => fallback;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <a
                    href={`/${locale}/host`}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Dashboard
                  </a>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-400 mx-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <a
                    href={`/${locale}/host/tours`}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Tours
                  </a>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-400 mx-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-900 font-medium">
                    {t("host.tours.create.title", "Criar Novo Tour")}
                  </span>
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("host.tours.create.title", "Criar Novo Tour")}
            </h1>
            <p className="text-gray-600">
              {t(
                "host.tours.create.subtitle",
                "Partilhe a sua experiência e crie experiências inesquecíveis para viajantes"
              )}
            </p>
          </div>

          {/* User Info Bar */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-blue-800 font-medium">
                    Bem-vindo, {session.user.name || session.user.email}
                  </p>
                  <p className="text-blue-600 text-sm">
                    A criar como anfitrião autorizado
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {session.user.role === "admin" ? "Admin" : "Host"}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <CreateTourClient locale={locale} />
        </div>
      </div>
    </div>
  );
}
