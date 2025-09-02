// File: app/[locale]/status/page.tsx
// Location: UPDATE this existing file in app/[locale]/status/

import { Metadata } from "next";
import { getTranslations } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  FileText,
  Palette,
  Code,
  Globe,
  Database,
  Shield,
  CreditCard,
  TestTube,
  Zap,
  TrendingUp,
} from "lucide-react";

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

  // Configuração das features com estado REAL baseado na análise
  const features = [
    {
      category: t.pages.status.categories.coreInfrastructure,
      icon: Code,
      completion: 85,
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
        {
          name: t.pages.status.features.projectStructure,
          status: "completed",
          description: t.pages.status.descriptions.projectStructureDesc,
        },
      ],
    },
    {
      category: t.pages.status.categories.customerPortal,
      icon: Globe,
      completion: 15,
      items: [
        {
          name: t.pages.status.features.tourBrowsing,
          status: "progress",
          description: t.pages.status.descriptions.tourBrowsingDesc,
        },
        {
          name: t.pages.status.features.bookingSystem,
          status: "planned",
          description: t.pages.status.descriptions.bookingSystemDesc,
        },
        {
          name: t.pages.status.features.userDashboard,
          status: "planned",
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
      icon: TrendingUp,
      completion: 10,
      items: [
        {
          name: t.pages.status.features.bookingManagement,
          status: "planned",
          description: t.pages.status.descriptions.bookingManagementDesc,
        },
        {
          name: t.pages.status.features.tourCreation,
          status: "planned",
          description: t.pages.status.descriptions.tourCreationDesc,
        },
        {
          name: t.pages.status.features.earningsDashboard,
          status: "planned",
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
      category: t.pages.status.categories.backendApi,
      icon: Database,
      completion: 5,
      items: [
        {
          name: t.pages.status.features.databaseSchema,
          status: "planned",
          description: t.pages.status.descriptions.databaseSchemaDesc,
        },
        {
          name: t.pages.status.features.apiRoutes,
          status: "planned",
          description: t.pages.status.descriptions.apiRoutesDesc,
        },
        {
          name: t.pages.status.features.dataValidation,
          status: "planned",
          description: t.pages.status.descriptions.dataValidationDesc,
        },
      ],
    },
    {
      category: t.pages.status.categories.integrations,
      icon: CreditCard,
      completion: 0,
      items: [
        {
          name: t.pages.status.features.stripeIntegration,
          status: "planned",
          description: t.pages.status.descriptions.stripeIntegrationDesc,
        },
        {
          name: t.pages.status.features.authenticationSystem,
          status: "planned",
          description: t.pages.status.descriptions.authenticationSystemDesc,
        },
        {
          name: t.pages.status.features.viatorApiIntegration,
          status: "planned",
          description: t.pages.status.descriptions.viatorApiIntegrationDesc,
        },
        {
          name: t.pages.status.features.emailSystem,
          status: "planned",
          description: t.pages.status.descriptions.emailSystemDesc,
        },
      ],
    },
    {
      category: t.pages.status.categories.testingQuality,
      icon: TestTube,
      completion: 0,
      items: [
        {
          name: t.pages.status.features.unitTesting,
          status: "planned",
          description: t.pages.status.descriptions.unitTestingDesc,
        },
        {
          name: t.pages.status.features.e2eTesting,
          status: "planned",
          description: t.pages.status.descriptions.e2eTestingDesc,
        },
        {
          name: t.pages.status.features.cicdPipeline,
          status: "planned",
          description: t.pages.status.descriptions.cicdPipelineDesc,
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

  // Cálculo de progresso geral do projeto
  const totalFeatures = features.reduce(
    (acc, category) => acc + category.items.length,
    0
  );
  const completedFeatures = features.reduce(
    (acc, category) =>
      acc + category.items.filter((item) => item.status === "completed").length,
    0
  );
  const inProgressFeatures = features.reduce(
    (acc, category) =>
      acc + category.items.filter((item) => item.status === "progress").length,
    0
  );
  const overallProgress = Math.round(
    ((completedFeatures + inProgressFeatures * 0.5) / totalFeatures) * 100
  );

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
        {/* Header com progresso geral */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t.pages.status.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            {t.pages.status.subtitle}
          </p>

          {/* Progress indicator geral */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{t.pages.status.overallProgress}</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>
                {completedFeatures} {t.pages.status.featuresCompleted}
              </span>
              <span>
                {inProgressFeatures} {t.pages.status.featuresInProgress}
              </span>
              <span>
                {totalFeatures - completedFeatures - inProgressFeatures}{" "}
                {t.pages.status.featuresPlanned}
              </span>
            </div>
          </div>
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

        {/* Feature Status por categoria */}
        <div className="space-y-8">
          {features.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <div
                key={categoryIndex}
                className="bg-white rounded-lg shadow-sm border"
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CategoryIcon className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-bold text-gray-900">
                        {category.category}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {t.pages.status.progress}: {category.completion}%
                      </span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${category.completion}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getStatusIcon(item.status)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {item.name}
                                </h3>
                                {getStatusBadge(item.status)}
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Portfolio Context */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t.pages.status.portfolioContext}
          </h2>
          <p className="text-gray-700 mb-6">
            {t.pages.status.portfolioDescription}
          </p>
          <ul className="space-y-3">
            {portfolioPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t.pages.status.nextSteps.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-amber-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Database className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-2">
                {t.pages.status.nextSteps.thisWeek}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>{t.pages.status.nextSteps.thisWeekItems.database}</li>
                <li>{t.pages.status.nextSteps.thisWeekItems.envSetup}</li>
                <li>{t.pages.status.nextSteps.thisWeekItems.firstApi}</li>
              </ul>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">
                {t.pages.status.nextSteps.nextWeek}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>{t.pages.status.nextSteps.nextWeekItems.auth}</li>
                <li>{t.pages.status.nextSteps.nextWeekItems.tourPages}</li>
                <li>{t.pages.status.nextSteps.nextWeekItems.uiComponents}</li>
              </ul>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">
                {t.pages.status.nextSteps.thisMonth}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  {t.pages.status.nextSteps.thisMonthItems.customerPortal}
                </li>
                <li>{t.pages.status.nextSteps.thisMonthItems.bookingSystem}</li>
                <li>{t.pages.status.nextSteps.thisMonthItems.hostDashboard}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
