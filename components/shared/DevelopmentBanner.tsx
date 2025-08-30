// File: components/shared/DevelopmentBanner.tsx
// Location: Create this NEW file in components/shared/

"use client";

import { useState } from "react";
import { X, Code, Globe } from "lucide-react";
import Link from "next/link";

interface DevelopmentBannerProps {
  locale: string;
}

// Simple translations object - add to your actual translation files later
const bannerTranslations = {
  pt: {
    showcase: "TravelTrek Marketplace - Demonstração de Desenvolvimento",
    techDemo: "Demo Técnica: Next.js 15 + React 19 + i18n (5 idiomas)",
    status: "Estado do Projeto",
    inProgress: "🔄 Em Desenvolvimento",
  },
  en: {
    showcase: "TravelTrek Marketplace - Development Showcase",
    techDemo: "Technical Demo: Next.js 15 + React 19 + i18n (5 languages)",
    status: "Project Status",
    inProgress: "🔄 In Development",
  },
  es: {
    showcase: "TravelTrek Marketplace - Demostración de Desarrollo",
    techDemo: "Demo Técnica: Next.js 15 + React 19 + i18n (5 idiomas)",
    status: "Estado del Proyecto",
    inProgress: "🔄 En Desarrollo",
  },
  fr: {
    showcase: "TravelTrek Marketplace - Démonstration de Développement",
    techDemo: "Démo Technique: Next.js 15 + React 19 + i18n (5 langues)",
    status: "État du Projet",
    inProgress: "🔄 En Développement",
  },
  de: {
    showcase: "TravelTrek Marketplace - Entwicklungs-Showcase",
    techDemo: "Technische Demo: Next.js 15 + React 19 + i18n (5 Sprachen)",
    status: "Projektstatus",
    inProgress: "🔄 In Entwicklung",
  },
};

export default function DevelopmentBanner({ locale }: DevelopmentBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Fallback to 'en' if locale not found
  const t =
    bannerTranslations[locale as keyof typeof bannerTranslations] ||
    bannerTranslations.en;

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 sm:py-3">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            {/* Status indicator */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-blue-800 uppercase tracking-wide hidden sm:inline">
                  {t.inProgress}
                </span>
              </div>
              <Code className="w-4 h-4 text-blue-600 hidden sm:block" />
            </div>

            {/* Main text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-800 truncate">
                {t.showcase}
              </p>
              <p className="text-xs text-blue-600 hidden md:block truncate">
                {t.techDemo}
              </p>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Globe icon for mobile */}
            <Globe className="w-4 h-4 text-blue-600 sm:hidden" />

            {/* Status link */}
            <Link
              href={`/${locale}/status`}
              className="text-xs sm:text-sm text-blue-700 hover:text-blue-900 underline font-medium whitespace-nowrap"
            >
              {t.status}
            </Link>

            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="text-blue-500 hover:text-blue-700 transition-colors p-1"
              aria-label="Close banner"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
