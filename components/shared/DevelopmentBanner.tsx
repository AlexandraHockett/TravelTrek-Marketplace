// ===================================================================
// 📁 components/shared/DevelopmentBanner.tsx
// Location: REPLACE existing components/shared/DevelopmentBanner.tsx
// ===================================================================

"use client";

import { useState } from "react";
import { X, CheckCircle, Database, Globe, Code2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n";

interface DevelopmentBannerProps {
  locale: string;
}

export default function DevelopmentBanner({ locale }: DevelopmentBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const t = useTranslations(locale);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 via-blue-50 to-indigo-50 border-b border-green-200 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 sm:py-3">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            {/* Status indicators */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-800 uppercase tracking-wide hidden sm:inline">
                  {t("banner.productionReady")}
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <Database className="w-3 h-3 text-blue-600" />
                <Globe className="w-3 h-3 text-indigo-600" />
                <Code2 className="w-3 h-3 text-purple-600" />
              </div>
            </div>

            {/* Main text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {t("banner.showcase")}
              </p>
              <p className="text-xs text-gray-600 hidden md:block truncate">
                {t("banner.techDemo")}
              </p>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Progress indicator */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700">75%</span>
              </div>
            </div>

            {/* Status link */}
            <Link
              href={`/${locale}/status`}
              className="text-xs sm:text-sm text-blue-700 hover:text-blue-900 underline font-medium whitespace-nowrap flex items-center gap-1"
            >
              <span>{t("banner.status")}</span>
              <CheckCircle className="w-3 h-3 sm:hidden" />
            </Link>

            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1"
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
