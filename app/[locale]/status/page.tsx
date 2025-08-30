// File: app/[locale]/status/page.tsx
// Location: CREATE this NEW file in app/[locale]/status/

import { Metadata } from "next";
import { getTranslations } from "@/lib/utils";
import { CheckCircle, Clock, FileText, Palette } from "lucide-react";

interface StatusPageProps {
  params: Promise<{ locale: string }>;
}

// Metadata dinâmica baseada no locale
export async function generateMetadata({
  params,
}: StatusPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return {
    title: `${t.pages.status.title} | TravelTrek Development Showcase`,
    description: t.pages.status.subtitle,
  };
}

export default async function StatusPage({ params }: StatusPageProps) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  // Configuração das features usando EXCLUSIVAMENTE as chaves de tradução
  const features = [
    {
      category: t.pages.status.categories.coreInfrastructure,
      items: [
        {
          name: t.pages.status.features.i18nSystem,
          status: "completed",
          description: t.pages.status.descriptions.i18nSystemDesc,
        },
        {
          name: t.pages.status.features.nextjsReact,
          status: "completed",
          description: t.pages.status.descriptions.nextjsReactDesc,
        },
        {
          name: t.pages.status.features.responsiveNavigation,
          status: "completed",
          description: t.pages.status.descriptions.responsiveNavigationDesc,
        },
        {
          name: t.pages.status.features.typescriptIntegration,
          status: "completed",
          description: t.pages.status.descriptions.typescriptIntegrationDesc,
        },
      ],
    },
    {
      category: t.pages.status.categories.customerPortal,
      items: [
        {
          name: t.pages.status.features.tourBrowsing,
          status: "progress",
          description: t.pages.status.descriptions.tourBrowsingDesc,
        },
        {
          name: t.pages.status.features.bookingSystem,
          status: "progress",
          description: t.pages.status.descriptions.bookingSystemDesc,
        },
        {
          name: t.pages.status.features.userDashboard,
          status: "progress",
          description: t.pages.status.descriptions.userDashboardDesc,
        },
        {
          name: t.pages.status.features.reviewSystem,
          status: "planned",
          description: t.pages.status.descriptions.reviewSystemDesc,
        },
      ],
    },
    {
      category: t.pages.status.categories.hostPortal,
      items: [
        {
          name: t.pages.status.features.bookingManagement,
          status: "progress",
          description: t.pages.status.descriptions.bookingManagementDesc,
        },
        {
          name: t.pages.status.features.tourCreation,
          status: "progress",
          description: t.pages.status.descriptions.tourCreationDesc,
        },
        {
          name: t.pages.status.features.earningsDashboard,
          status: "progress",
          description: t.pages.status.descriptions.earningsDashboardDesc,
        },
        {
          name: t.pages.status.features.messagingSystem,
          status: "planned",
          description: t.pages.status.descriptions.messagingSystemDesc,
        },
      ],
    },
    {
      category: t.pages.status.categories.integrations,
      items: [
        {
          name: t.pages.status.features.stripeIntegration,
          status: "progress",
          description: t.pages.status.descriptions.stripeIntegrationDesc,
        },
        {
          name: t.pages.status.features.databasePostgres,
          status: "progress",
          description: t.pages.status.descriptions.databasePostgresDesc,
        },
        {
          name: t.pages.status.features.viatorApiIntegration,
          status: "planned",
          description: t.pages.status.descriptions.viatorApiIntegrationDesc,
        },
        {
          name: t.pages.status.features.authenticationSystem,
          status: "planned",
          description: t.pages.status.descriptions.authenticationSystemDesc,
        },
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "progress":
        return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: "bg-green-100 text-green-800 border-green-200",
      progress: "bg-amber-100 text-amber-800 border-amber-200",
      planned: "bg-gray-100 text-gray-600 border-gray-200",
    };

    const getStatusLabel = (status: string) => {
      switch (status) {
        case "completed":
          return t.pages.status.status.implemented;
        case "progress":
          return t.pages.status.status.inProgress;
        case "planned":
          return t.pages.status.status.planned;
        default:
          return status;
      }
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${badges[status as keyof typeof badges]}`}
      >
        {getStatusLabel(status)}
      </span>
    );
  };

  // Tech stack items usando traduções
  const techStackItems = [
    {
      emoji: "⚡",
      bgColor: "bg-black",
      title: t.pages.status.techStackItems.nextjs.title,
      subtitle: t.pages.status.techStackItems.nextjs.subtitle,
    },
    {
      emoji: "🎨",
      bgColor: "bg-blue-500",
      title: t.pages.status.techStackItems.tailwind.title,
      subtitle: t.pages.status.techStackItems.tailwind.subtitle,
    },
    {
      emoji: "TS",
      bgColor: "bg-blue-700",
      title: t.pages.status.techStackItems.typescript.title,
      subtitle: t.pages.status.techStackItems.typescript.subtitle,
    },
    {
      emoji: "🌍",
      bgColor: "bg-green-600",
      title: t.pages.status.techStackItems.i18n.title,
      subtitle: t.pages.status.techStackItems.i18n.subtitle,
    },
  ];

  // Portfolio points usando traduções
  const portfolioPoints = [
    t.pages.status.portfolioPoints.modernReact,
    t.pages.status.portfolioPoints.i18nExpertise,
    t.pages.status.portfolioPoints.marketplaceArchitecture,
    t.pages.status.portfolioPoints.contemporaryStyling,
    t.pages.status.portfolioPoints.professionalStructure,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t.pages.status.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t.pages.status.subtitle}
          </p>
        </div>

        {/* Tech Stack Highlight */}
        <div className="bg-white rounded-lg shadow-sm border mb-12 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Palette className="w-6 h-6 text-blue-600" />
            {t.pages.status.techStack}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStackItems.map((item, index) => (
              <div key={index} className="text-center p-4">
                <div
                  className={`w-12 h-12 ${item.bgColor} rounded-lg mx-auto mb-3 flex items-center justify-center text-white font-bold`}
                >
                  {item.emoji}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Status */}
        <div className="space-y-8">
          {features.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white rounded-lg shadow-sm border"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {category.category}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50"
                    >
                      <div className="flex-shrink-0">
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">
                            {item.name}
                          </h3>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio Context */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 border border-blue-200">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            {t.pages.status.portfolioContext}
          </h2>
          <div className="prose prose-blue max-w-none">
            <p className="text-blue-800 mb-4">
              {t.pages.status.portfolioDescription}
            </p>
            <ul className="text-blue-800 space-y-2">
              {portfolioPoints.map((point, index) => (
                <li key={index}>
                  <strong>{point.split(":")[0]}:</strong> {point.split(":")[1]}
                </li>
              ))}
            </ul>
            <p className="text-blue-800 mt-4 text-sm italic">
              {t.pages.status.portfolioFooter}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
