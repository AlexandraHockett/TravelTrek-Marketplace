import { Metadata } from "next";
import Link from "next/link";
import { getServerTranslations } from "@/lib/server-translations";
import {
  CheckCircle,
  Clock,
  Code,
  Globe,
  Database,
  Shield,
  Users,
  TrendingUp,
  Zap,
  ExternalLink,
  Github,
  Play,
  Award,
  Layers,
  Server,
  Smartphone,
} from "lucide-react";

interface StatusPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: StatusPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getServerTranslations(locale);

  return {
    title: t("status.meta.title"),
    description: t("status.meta.description"),
    keywords: t("status.meta.keywords"),
    openGraph: {
      title: t("status.meta.openGraph.title"),
      description: t("status.meta.openGraph.description"),
      type: "website",
    },
  };
}

export default async function StatusPage({ params }: StatusPageProps) {
  const { locale } = await params;
  const t = await getServerTranslations(locale);

  // Key achievements and metrics
  const achievements = {
    totalFeatures: 25,
    completedFeatures: 18,
    apiEndpoints: 15,
    languages: 5,
    liveUsers: 8,
    activeTours: 1,
    completedBookings: 2,
  };

  const completionRate = Math.round(
    (achievements.completedFeatures / achievements.totalFeatures) * 100
  );

  // Live demo links
  const demoLinks = [
    {
      label: t("status.demoLinks.browseTours.label"),
      href: `/${locale}/tours`,
      description: t("status.demoLinks.browseTours.description"),
      status: t("status.statusLabels.live"),
    },
    {
      label: t("status.demoLinks.authDemo.label"),
      href: `/${locale}/auth/login`,
      description: t("status.demoLinks.authDemo.description"),
      status: t("status.statusLabels.live"),
    },
    {
      label: t("status.demoLinks.customerDashboard.label"),
      href: `/${locale}/customer`,
      description: t("status.demoLinks.customerDashboard.description"),
      status: t("status.statusLabels.live"),
    },
    {
      label: t("status.demoLinks.hostPortal.label"),
      href: `/${locale}/host`,
      description: t("status.demoLinks.hostPortal.description"),
      status: t("status.statusLabels.live"),
    },
  ];

  // Technical architecture
  const techStack = [
    {
      category: t("status.techStack.frontend.category"),
      icon: Code,
      color: "bg-blue-500",
      technologies: [
        t("status.techStack.frontend.technologies.nextjs"),
        t("status.techStack.frontend.technologies.react"),
        t("status.techStack.frontend.technologies.typescript"),
        t("status.techStack.frontend.technologies.tailwind"),
      ],
      status: t("status.statusLabels.production"),
    },
    {
      category: t("status.techStack.backend.category"),
      icon: Server,
      color: "bg-green-500",
      technologies: [
        t("status.techStack.backend.technologies.apiRoutes"),
        t("status.techStack.backend.technologies.postgresql"),
        t("status.techStack.backend.technologies.drizzle"),
        t("status.techStack.backend.technologies.neon"),
      ],
      status: t("status.statusLabels.production"),
    },
    {
      category: t("status.techStack.auth.category"),
      icon: Shield,
      color: "bg-purple-500",
      technologies: [
        t("status.techStack.auth.technologies.nextAuth"),
        t("status.techStack.auth.technologies.googleOAuth"),
        t("status.techStack.auth.technologies.roleBasedAccess"),
        t("status.techStack.auth.technologies.protectedRoutes"),
      ],
      status: t("status.statusLabels.production"),
    },
    {
      category: t("status.techStack.i18n.category"),
      icon: Globe,
      color: "bg-orange-500",
      technologies: [
        t("status.techStack.i18n.technologies.languages"),
        t("status.techStack.i18n.technologies.dynamicRouting"),
        t("status.techStack.i18n.technologies.nextIntl"),
        t("status.techStack.i18n.technologies.localeSwitching"),
      ],
      status: t("status.statusLabels.production"),
    },
  ];

  // Implementation highlights
  const highlights = [
    {
      icon: Database,
      title: t("status.highlights.database.title"),
      description: t("status.highlights.database.description"),
      metric: `${achievements.liveUsers} utilizadores ativos`,
      status: t("status.statusLabels.operational"),
    },
    {
      icon: Users,
      title: t("status.highlights.auth.title"),
      description: t("status.highlights.auth.description"),
      metric: t("status.highlights.auth.metric"),
      status: t("status.statusLabels.operational"),
    },
    {
      icon: Globe,
      title: t("status.highlights.i18n.title"),
      description: t("status.highlights.i18n.description"),
      metric: `${achievements.languages} idiomas suportados`,
      status: t("status.statusLabels.operational"),
    },
    {
      icon: Zap,
      title: t("status.highlights.techStack.title"),
      description: t("status.highlights.techStack.description"),
      metric: t("status.highlights.techStack.metric"),
      status: t("status.statusLabels.operational"),
    },
  ];

  // Development categories with real completion status
  const categories = [
    {
      name: t("status.categories.core.name"),
      icon: Layers,
      completion: 100,
      features: [
        {
          name: t("status.categories.core.features.nextjs"),
          status: t("status.statusLabels.completed"),
        },
        {
          name: t("status.categories.core.features.typescript"),
          status: t("status.statusLabels.completed"),
        },
        {
          name: t("status.categories.core.features.tailwind"),
          status: t("status.statusLabels.completed"),
        },
        {
          name: t("status.categories.core.features.architecture"),
          status: t("status.statusLabels.completed"),
        },
        {
          name: t("status.categories.core.features.i18n"),
          status: t("status.statusLabels.completed"),
        },
      ],
    },
    {
      name: t("status.categories.database.name"),
      icon: Database,
      completion: 90,
      features: [
        {
          name: t("status.categories.database.features.postgresql"),
          status: t("status.statusLabels.completed"),
        },
        {
          name: t("status.categories.database.features.drizzle"),
          status: t("status.statusLabels.completed"),
        },
        {
          name: t("status.categories.database.features.crud"),
          status: t("status.statusLabels.completed"),
        },
        {
          name: t("status.categories.database.features.validation"),
          status: t("status.statusLabels.completed"),
        },
        {
          name: t("status.categories.database.features.errorHandling"),
          status: t("status.statusLabels.progress"),
        },
      ],
    },
    {
      name: t("status.categories.auth.name"),
      icon: Shield,
      completion: 95,
      features: [
        {
          name: t("status.categories.auth.features.nextAuth"),
          status: t("status.statusLabels.completed"),
        },
        {
          name: t("status.categories.auth.features.googleOAuth"),
          status: t("status.statusLabels.completed"),
        },
        {
          name: t("status.categories.auth.features.roleBasedAccess"),
          status: t("status.statusLabels.completed"),
        },
        {
          name: t("status.categories.auth.features.protectedRoutes"),
          status: t("status.statusLabels.completed"),
        },
        {
          name: t("status.categories.auth.features.session"),
          status: t("status.statusLabels.completed"),
        },
      ],
    },
    {
      name: t("status.categories.ui.name"),
      icon: Smartphone,
      completion: 75,
      features: [
        {
          name: t("status.categories.ui.features.browsing"),
          status: t("status.statusLabels.completed"),
        },
        {
          name: t("status.categories.ui.features.customerDashboard"),
          status: t("status.statusLabels.completed"),
        },
        {
          name: t("status.categories.ui.features.hostDashboard"),
          status: t("status.statusLabels.completed"),
        },
        {
          name: t("status.categories.ui.features.booking"),
          status: t("status.statusLabels.progress"),
        },
        {
          name: t("status.categories.ui.features.responsive"),
          status: t("status.statusLabels.completed"),
        },
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case t("status.statusLabels.completed"):
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case t("status.statusLabels.progress"):
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case t("status.statusLabels.operational"):
        return "bg-green-100 text-green-800 border-green-200";
      case t("status.statusLabels.live"):
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="w-8 h-8 text-yellow-300" />
              <span className="px-3 py-1 bg-yellow-300 text-yellow-900 rounded-full text-sm font-medium">
                {t("status.hero.portfolio")}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t("status.hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {t("status.hero.subtitle")}
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">
                  {completionRate}%
                </div>
                <div className="text-blue-100 text-sm">
                  {t("status.hero.metrics.complete")}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">
                  {achievements.apiEndpoints}
                </div>
                <div className="text-blue-100 text-sm">
                  {t("status.hero.metrics.apiEndpoints")}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">
                  {achievements.languages}
                </div>
                <div className="text-blue-100 text-sm">
                  {t("status.hero.metrics.languages")}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">
                  {achievements.liveUsers}
                </div>
                <div className="text-blue-100 text-sm">
                  {t("status.hero.metrics.liveUsers")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Live Demo Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("status.demo.title")}
            </h2>
            <p className="text-lg text-gray-600">{t("status.demo.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demoLinks.map((demo, index) => (
              <Link
                key={index}
                href={demo.href}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 p-6 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(demo.status)}`}
                  >
                    {demo.status.toUpperCase()}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {demo.label}
                </h3>
                <p className="text-sm text-gray-600">{demo.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("status.tech.title")}
            </h2>
            <p className="text-lg text-gray-600">{t("status.tech.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`p-3 rounded-lg ${tech.color} text-white mr-3`}
                  >
                    <tech.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {tech.category}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tech.status)}`}
                    >
                      {tech.status}
                    </span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {tech.technologies.map((technology, techIndex) => (
                    <li
                      key={techIndex}
                      className="text-sm text-gray-600 flex items-center"
                    >
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                      {technology}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation Highlights */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("status.highlights.title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("status.highlights.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex items-start">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <highlight.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {highlight.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(highlight.status)}`}
                      >
                        {highlight.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {highlight.description}
                    </p>
                    <div className="text-sm font-medium text-blue-600">
                      {highlight.metric}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Progress */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("status.progress.title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("status.progress.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border overflow-hidden"
              >
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <category.icon className="w-6 h-6 text-blue-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">
                        {category.name}
                      </h3>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {category.completion}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${category.completion}%` }}
                    />
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <div className="space-y-3">
                    {category.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          {getStatusIcon(feature.status)}
                          <span className="ml-3 text-sm text-gray-700">
                            {feature.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills Demonstrated */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t("status.skills.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                {t("status.skills.frontend.title")}
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <Zap className="w-3 h-3 mr-2 text-blue-500" />
                  {t("status.skills.frontend.nextjs")}
                </li>
                <li className="flex items-center">
                  <Zap className="w-3 h-3 mr-2 text-blue-500" />
                  {t("status.skills.frontend.react")}
                </li>
                <li className="flex items-center">
                  <Zap className="w-3 h-3 mr-2 text-blue-500" />
                  {t("status.skills.frontend.typescript")}
                </li>
                <li className="flex items-center">
                  <Zap className="w-3 h-3 mr-2 text-blue-500" />
                  {t("status.skills.frontend.responsive")}
                </li>
                <li className="flex items-center">
                  <Zap className="w-3 h-3 mr-2 text-blue-500" />
                  {t("status.skills.frontend.state")}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                {t("status.skills.backend.title")}
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <Database className="w-3 h-3 mr-2 text-green-500" />
                  {t("status.skills.backend.postgresql")}
                </li>
                <li className="flex items-center">
                  <Database className="w-3 h-3 mr-2 text-green-500" />
                  {t("status.skills.backend.api")}
                </li>
                <li className="flex items-center">
                  <Database className="w-3 h-3 mr-2 text-green-500" />
                  {t("status.skills.backend.orm")}
                </li>
                <li className="flex items-center">
                  <Database className="w-3 h-3 mr-2 text-green-500" />
                  {t("status.skills.backend.validation")}
                </li>
                <li className="flex items-center">
                  <Database className="w-3 h-3 mr-2 text-green-500" />
                  {t("status.skills.backend.error")}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                {t("status.skills.devops.title")}
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <Shield className="w-3 h-3 mr-2 text-purple-500" />
                  {t("status.skills.devops.auth")}
                </li>
                <li className="flex items-center">
                  <Shield className="w-3 h-3 mr-2 text-purple-500" />
                  {t("status.skills.devops.security")}
                </li>
                <li className="flex items-center">
                  <Shield className="w-3 h-3 mr-2 text-purple-500" />
                  {t("status.skills.devops.env")}
                </li>
                <li className="flex items-center">
                  <Shield className="w-3 h-3 mr-2 text-purple-500" />
                  {t("status.skills.devops.migrations")}
                </li>
                <li className="flex items-center">
                  <Shield className="w-3 h-3 mr-2 text-purple-500" />
                  {t("status.skills.devops.deployment")}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
